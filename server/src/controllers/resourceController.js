import { getPool } from '../config/database.js';
import {
  calculateCurrentAllocation,
  calculateBillableAllocation,
  calculateNextAvailability,
  calculateMaxRevenuePerWeek,
  calculateActualRevenueThisWeek,
  calculateForecastedRevenue
} from '../services/calculationService.js';

// GET /api/resources - Get all resources with calculated fields
export const getAllResources = async (req, res) => {
  try {
    const pool = getPool();

    // Get all resources
    const result = await pool.request().query(`
      SELECT * FROM Resources
      ORDER BY Name ASC
    `);

    const resources = result.recordset;

    // Calculate fields for each resource
    const resourcesWithCalculations = await Promise.all(
      resources.map(async (resource) => {
        const calculations = await getResourceCalculations(resource.ResourceID);
        return {
          ...resource,
          ...calculations
        };
      })
    );

    res.json({
      success: true,
      count: resourcesWithCalculations.length,
      data: resourcesWithCalculations
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// GET /api/resources/:id - Get single resource by ID
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('resourceId', id)
      .query(`
        SELECT * FROM Resources
        WHERE ResourceID = @resourceId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = result.recordset[0];
    const calculations = await getResourceCalculations(resource.ResourceID);

    res.json({
      success: true,
      data: {
        ...resource,
        ...calculations
      }
    });

  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
};

// GET /api/resources/:id/details - Get resource with all calculations and tasks
export const getResourceWithCalculations = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get resource
    const resourceResult = await pool.request()
      .input('resourceId', id)
      .query(`
        SELECT * FROM Resources
        WHERE ResourceID = @resourceId
      `);

    if (resourceResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = resourceResult.recordset[0];

    // Get all tasks for this resource
    const tasksResult = await pool.request()
      .input('resourceId', id)
      .query(`
        SELECT * FROM Tasks
        WHERE ResourceID = @resourceId
        ORDER BY StartDate DESC
      `);

    const calculations = await getResourceCalculations(id);

    res.json({
      success: true,
      data: {
        resource: {
          ...resource,
          ...calculations
        },
        tasks: tasksResult.recordset
      }
    });

  } catch (error) {
    console.error('Error fetching resource details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource details',
      error: error.message
    });
  }
};

// POST /api/resources - Create new resource
export const createResource = async (req, res) => {
  try {
    const {
      Name,
      Unit,
      Role,
      CapacityPerWeek,
      RateCard,
      Generalization,
      Specialization
    } = req.body;

    // Validation
    if (!Name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const pool = getPool();

    const result = await pool.request()
      .input('Name', Name)
      .input('Unit', Unit || null)
      .input('Role', Role || null)
      .input('CapacityPerWeek', CapacityPerWeek || null)
      .input('RateCard', RateCard || null)
      .input('Generalization', Generalization || null)
      .input('Specialization', Specialization || null)
      .query(`
        INSERT INTO Resources (Name, Unit, Role, CapacityPerWeek, RateCard, Generalization, Specialization)
        OUTPUT INSERTED.*
        VALUES (@Name, @Unit, @Role, @CapacityPerWeek, @RateCard, @Generalization, @Specialization)
      `);

    const newResource = result.recordset[0];

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: newResource
    });

  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

// PUT /api/resources/:id - Update resource
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Name,
      Unit,
      Role,
      CapacityPerWeek,
      RateCard,
      Generalization,
      Specialization
    } = req.body;

    const pool = getPool();

    // Check if resource exists
    const checkResult = await pool.request()
      .input('resourceId', id)
      .query('SELECT ResourceID FROM Resources WHERE ResourceID = @resourceId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const result = await pool.request()
      .input('resourceId', id)
      .input('Name', Name)
      .input('Unit', Unit || null)
      .input('Role', Role || null)
      .input('CapacityPerWeek', CapacityPerWeek || null)
      .input('RateCard', RateCard || null)
      .input('Generalization', Generalization || null)
      .input('Specialization', Specialization || null)
      .query(`
        UPDATE Resources
        SET
          Name = @Name,
          Unit = @Unit,
          Role = @Role,
          CapacityPerWeek = @CapacityPerWeek,
          RateCard = @RateCard,
          Generalization = @Generalization,
          Specialization = @Specialization,
          UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE ResourceID = @resourceId
      `);

    const updatedResource = result.recordset[0];

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });

  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

// DELETE /api/resources/:id - Delete resource
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Check if resource exists
    const checkResult = await pool.request()
      .input('resourceId', id)
      .query('SELECT ResourceID FROM Resources WHERE ResourceID = @resourceId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Delete resource (CASCADE will delete associated tasks)
    await pool.request()
      .input('resourceId', id)
      .query('DELETE FROM Resources WHERE ResourceID = @resourceId');

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

// Helper function to get all calculations for a resource
async function getResourceCalculations(resourceId) {
  const pool = getPool();

  // Get resource data
  const resourceResult = await pool.request()
    .input('resourceId', resourceId)
    .query('SELECT * FROM Resources WHERE ResourceID = @resourceId');

  const resource = resourceResult.recordset[0];

  // Get all tasks for this resource
  const tasksResult = await pool.request()
    .input('resourceId', resourceId)
    .query(`
      SELECT * FROM Tasks
      WHERE ResourceID = @resourceId AND IsVisible = 1
    `);

  const tasks = tasksResult.recordset;

  // Calculate all metrics
  const currentAllocation = await calculateCurrentAllocation(resourceId, tasks);
  const billableAllocation = await calculateBillableAllocation(resourceId, tasks);
  const nextAvailability = await calculateNextAvailability(resourceId, tasks);
  const maxRevenuePerWeek = calculateMaxRevenuePerWeek(resource.RateCard);
  const actualRevenueThisWeek = await calculateActualRevenueThisWeek(resourceId, resource.RateCard, tasks);
  const forecastedRevenue = await calculateForecastedRevenue(resourceId, resource.RateCard, tasks, actualRevenueThisWeek);

  return {
    CurrentAllocation: currentAllocation,
    BillableAllocation: billableAllocation,
    NextAvailability: nextAvailability,
    MaxRevenuePerWeek: maxRevenuePerWeek,
    ActualRevenueThisWeek: actualRevenueThisWeek,
    ForecastedRevenue: forecastedRevenue
  };
}
