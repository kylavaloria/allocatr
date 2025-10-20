import { getPool } from '../config/database.js';
import { calculateTaskProgress, calculateTaskAllocationPercentage } from '../services/calculationService.js';

// GET /api/tasks - Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT
        t.*,
        r.Name as ResourceName,
        r.Unit as ResourceUnit,
        r.Role as ResourceRole
      FROM Tasks t
      INNER JOIN Resources r ON t.ResourceID = r.ResourceID
      ORDER BY t.StartDate DESC
    `);

    const tasks = result.recordset.map(task => ({
      ...task,
      TaskAllocationPercentage: calculateTaskAllocationPercentage(task.TaskAllocationHours),
      TaskProgress: calculateTaskProgress(task.StartDate, task.EndDate)
    }));

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// GET /api/tasks/:id - Get single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('taskId', id)
      .query(`
        SELECT
          t.*,
          r.Name as ResourceName,
          r.Unit as ResourceUnit,
          r.Role as ResourceRole,
          r.RateCard as ResourceRateCard
        FROM Tasks t
        INNER JOIN Resources r ON t.ResourceID = r.ResourceID
        WHERE t.TaskID = @taskId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const task = result.recordset[0];

    res.json({
      success: true,
      data: {
        ...task,
        TaskAllocationPercentage: calculateTaskAllocationPercentage(task.TaskAllocationHours),
        TaskProgress: calculateTaskProgress(task.StartDate, task.EndDate)
      }
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};

// GET /api/tasks/resource/:resourceId - Get all tasks for a specific resource
export const getTasksByResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const pool = getPool();

    // First check if resource exists
    const resourceCheck = await pool.request()
      .input('resourceId', resourceId)
      .query('SELECT ResourceID, Name FROM Resources WHERE ResourceID = @resourceId');

    if (resourceCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const result = await pool.request()
      .input('resourceId', resourceId)
      .query(`
        SELECT * FROM Tasks
        WHERE ResourceID = @resourceId
        ORDER BY StartDate DESC
      `);

    const tasks = result.recordset.map(task => ({
      ...task,
      TaskAllocationPercentage: calculateTaskAllocationPercentage(task.TaskAllocationHours),
      TaskProgress: calculateTaskProgress(task.StartDate, task.EndDate)
    }));

    res.json({
      success: true,
      count: tasks.length,
      resourceName: resourceCheck.recordset[0].Name,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching tasks by resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// POST /api/tasks - Create new task
export const createTask = async (req, res) => {
  try {
    const {
      ResourceID,
      TaskName,
      TaskType,
      TaskStatus,
      StartDate,
      EndDate,
      TaskAllocationHours,
      Billable
    } = req.body;

    // Validation
    if (!ResourceID || !TaskName) {
      return res.status(400).json({
        success: false,
        message: 'ResourceID and TaskName are required'
      });
    }

    // Validate TaskType
    const validTaskTypes = [
      'Admin',
      'Community',
      'Learning',
      'Managed Services',
      'Mentoring',
      'Others',
      'Pre-sales',
      'Program',
      'Project'
    ];

    if (TaskType && !validTaskTypes.includes(TaskType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid TaskType. Must be one of: ${validTaskTypes.join(', ')}`
      });
    }

    // Validate TaskStatus
    const validTaskStatuses = ['Done', 'Future Work', 'Leave', 'Ongoing', 'Paused'];
    if (TaskStatus && !validTaskStatuses.includes(TaskStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid TaskStatus. Must be one of: ${validTaskStatuses.join(', ')}`
      });
    }

    // Validate dates if both provided
    if (StartDate && EndDate) {
      const start = new Date(StartDate);
      const end = new Date(EndDate);
      if (start > end) {
        return res.status(400).json({
          success: false,
          message: 'StartDate cannot be after EndDate'
        });
      }
    }

    // Validate TaskAllocationHours
    if (TaskAllocationHours && (TaskAllocationHours < 0 || TaskAllocationHours > 24)) {
      return res.status(400).json({
        success: false,
        message: 'TaskAllocationHours must be between 0 and 24'
      });
    }

    const pool = getPool();

    // Check if resource exists
    const resourceCheck = await pool.request()
      .input('resourceId', ResourceID)
      .query('SELECT ResourceID FROM Resources WHERE ResourceID = @resourceId');

    if (resourceCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const result = await pool.request()
      .input('ResourceID', ResourceID)
      .input('TaskName', TaskName)
      .input('TaskType', TaskType || null)
      .input('TaskStatus', TaskStatus || 'Ongoing')
      .input('StartDate', StartDate || null)
      .input('EndDate', EndDate || null)
      .input('TaskAllocationHours', TaskAllocationHours || null)
      .input('Billable', Billable ? 1 : 0)
      .query(`
        INSERT INTO Tasks (
          ResourceID, TaskName, TaskType, TaskStatus,
          StartDate, EndDate, TaskAllocationHours, Billable
        )
        OUTPUT INSERTED.*
        VALUES (
          @ResourceID, @TaskName, @TaskType, @TaskStatus,
          @StartDate, @EndDate, @TaskAllocationHours, @Billable
        )
      `);

    const newTask = result.recordset[0];

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        ...newTask,
        TaskAllocationPercentage: calculateTaskAllocationPercentage(newTask.TaskAllocationHours),
        TaskProgress: calculateTaskProgress(newTask.StartDate, newTask.EndDate)
      }
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// PUT /api/tasks/:id - Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      TaskName,
      TaskType,
      TaskStatus,
      StartDate,
      EndDate,
      TaskAllocationHours,
      Billable,
      IsVisible
    } = req.body;

    // Validation
    if (!TaskName) {
      return res.status(400).json({
        success: false,
        message: 'TaskName is required'
      });
    }

    // Validate TaskType
    const validTaskTypes = [
      'Admin',
      'Community',
      'Learning',
      'Managed Services',
      'Mentoring',
      'Others',
      'Pre-sales',
      'Program',
      'Project'
    ];

    if (TaskType && !validTaskTypes.includes(TaskType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid TaskType. Must be one of: ${validTaskTypes.join(', ')}`
      });
    }

    // Validate TaskStatus
    const validTaskStatuses = ['Done', 'Future Work', 'Leave', 'Ongoing', 'Paused'];
    if (TaskStatus && !validTaskStatuses.includes(TaskStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid TaskStatus. Must be one of: ${validTaskStatuses.join(', ')}`
      });
    }

    // Validate dates if both provided
    if (StartDate && EndDate) {
      const start = new Date(StartDate);
      const end = new Date(EndDate);
      if (start > end) {
        return res.status(400).json({
          success: false,
          message: 'StartDate cannot be after EndDate'
        });
      }
    }

    // Validate TaskAllocationHours
    if (TaskAllocationHours !== undefined && (TaskAllocationHours < 0 || TaskAllocationHours > 24)) {
      return res.status(400).json({
        success: false,
        message: 'TaskAllocationHours must be between 0 and 24'
      });
    }

    const pool = getPool();

    // Check if task exists
    const checkResult = await pool.request()
      .input('taskId', id)
      .query('SELECT TaskID FROM Tasks WHERE TaskID = @taskId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const result = await pool.request()
      .input('taskId', id)
      .input('TaskName', TaskName)
      .input('TaskType', TaskType || null)
      .input('TaskStatus', TaskStatus)
      .input('StartDate', StartDate || null)
      .input('EndDate', EndDate || null)
      .input('TaskAllocationHours', TaskAllocationHours || null)
      .input('Billable', Billable ? 1 : 0)
      .input('IsVisible', IsVisible !== undefined ? (IsVisible ? 1 : 0) : 1)
      .query(`
        UPDATE Tasks
        SET
          TaskName = @TaskName,
          TaskType = @TaskType,
          TaskStatus = @TaskStatus,
          StartDate = @StartDate,
          EndDate = @EndDate,
          TaskAllocationHours = @TaskAllocationHours,
          Billable = @Billable,
          IsVisible = @IsVisible,
          UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE TaskID = @taskId
      `);

    const updatedTask = result.recordset[0];

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: {
        ...updatedTask,
        TaskAllocationPercentage: calculateTaskAllocationPercentage(updatedTask.TaskAllocationHours),
        TaskProgress: calculateTaskProgress(updatedTask.StartDate, updatedTask.EndDate)
      }
    });

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// PATCH /api/tasks/bulk - Bulk update tasks
export const bulkUpdateTasks = async (req, res) => {
  try {
    const { taskIds, updates } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'taskIds array is required and must not be empty'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'updates object is required and must not be empty'
      });
    }

    const pool = getPool();

    // Build dynamic update query
    let updateFields = [];
    const request = pool.request();

    // Validate and add TaskStatus
    if (updates.TaskStatus !== undefined) {
      const validTaskStatuses = ['Done', 'Future Work', 'Leave', 'Ongoing', 'Paused'];
      if (!validTaskStatuses.includes(updates.TaskStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid TaskStatus. Must be one of: ${validTaskStatuses.join(', ')}`
        });
      }
      updateFields.push('TaskStatus = @TaskStatus');
      request.input('TaskStatus', updates.TaskStatus);
    }

    // Validate and add IsVisible
    if (updates.IsVisible !== undefined) {
      updateFields.push('IsVisible = @IsVisible');
      request.input('IsVisible', updates.IsVisible ? 1 : 0);
    }

    // Validate and add Billable
    if (updates.Billable !== undefined) {
      updateFields.push('Billable = @Billable');
      request.input('Billable', updates.Billable ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid update fields provided (TaskStatus, IsVisible, or Billable)'
      });
    }

    updateFields.push('UpdatedAt = GETDATE()');

    // Create parameter placeholders for IN clause
    const placeholders = taskIds.map((_, index) => `@taskId${index}`).join(',');
    taskIds.forEach((id, index) => {
      request.input(`taskId${index}`, id);
    });

    const query = `
      UPDATE Tasks
      SET ${updateFields.join(', ')}
      WHERE TaskID IN (${placeholders})
    `;

    const result = await request.query(query);

    res.json({
      success: true,
      message: `Successfully updated ${result.rowsAffected[0]} task(s)`,
      affectedRows: result.rowsAffected[0]
    });

  } catch (error) {
    console.error('Error bulk updating tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tasks',
      error: error.message
    });
  }
};

// DELETE /api/tasks/:id - Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Check if task exists
    const checkResult = await pool.request()
      .input('taskId', id)
      .query('SELECT TaskID, TaskName FROM Tasks WHERE TaskID = @taskId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const taskName = checkResult.recordset[0].TaskName;

    await pool.request()
      .input('taskId', id)
      .query('DELETE FROM Tasks WHERE TaskID = @taskId');

    res.json({
      success: true,
      message: `Task "${taskName}" deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};
