import { getPool } from '../config/database.js';
import { clearHolidaysCache } from '../services/dateService.js';

// GET /api/holidays - Get all holidays
export const getAllHolidays = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT * FROM Holidays
      ORDER BY HolidayDate ASC
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holidays',
      error: error.message
    });
  }
};

// GET /api/holidays/:id - Get single holiday by ID
export const getHolidayById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.request()
      .input('holidayId', id)
      .query(`
        SELECT * FROM Holidays
        WHERE HolidayID = @holidayId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error fetching holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holiday',
      error: error.message
    });
  }
};

// GET /api/holidays/range?start=YYYY-MM-DD&end=YYYY-MM-DD - Get holidays in date range
export const getHolidaysByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'start and end query parameters are required (format: YYYY-MM-DD)'
      });
    }

    const pool = getPool();

    const result = await pool.request()
      .input('startDate', start)
      .input('endDate', end)
      .query(`
        SELECT * FROM Holidays
        WHERE HolidayDate BETWEEN @startDate AND @endDate
        ORDER BY HolidayDate ASC
      `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error('Error fetching holidays by date range:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holidays',
      error: error.message
    });
  }
};

// POST /api/holidays - Create new holiday
export const createHoliday = async (req, res) => {
  try {
    const { HolidayDate, Description } = req.body;

    // Validation
    if (!HolidayDate) {
      return res.status(400).json({
        success: false,
        message: 'HolidayDate is required'
      });
    }

    const pool = getPool();

    // Check if holiday already exists for this date
    const checkResult = await pool.request()
      .input('holidayDate', HolidayDate)
      .query('SELECT HolidayID FROM Holidays WHERE HolidayDate = @holidayDate');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Holiday already exists for this date'
      });
    }

    const result = await pool.request()
      .input('HolidayDate', HolidayDate)
      .input('Description', Description || null)
      .query(`
        INSERT INTO Holidays (HolidayDate, Description)
        OUTPUT INSERTED.*
        VALUES (@HolidayDate, @Description)
      `);

    const newHoliday = result.recordset[0];

    // Clear holiday cache since we added a new holiday
    clearHolidaysCache();

    res.status(201).json({
      success: true,
      message: 'Holiday created successfully',
      data: newHoliday
    });

  } catch (error) {
    console.error('Error creating holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create holiday',
      error: error.message
    });
  }
};

// PUT /api/holidays/:id - Update holiday
export const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { HolidayDate, Description } = req.body;

    if (!HolidayDate) {
      return res.status(400).json({
        success: false,
        message: 'HolidayDate is required'
      });
    }

    const pool = getPool();

    // Check if holiday exists
    const checkResult = await pool.request()
      .input('holidayId', id)
      .query('SELECT HolidayID FROM Holidays WHERE HolidayID = @holidayId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }

    // Check if new date conflicts with another holiday
    const dateCheckResult = await pool.request()
      .input('holidayId', id)
      .input('holidayDate', HolidayDate)
      .query(`
        SELECT HolidayID FROM Holidays
        WHERE HolidayDate = @holidayDate AND HolidayID != @holidayId
      `);

    if (dateCheckResult.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Another holiday already exists for this date'
      });
    }

    const result = await pool.request()
      .input('holidayId', id)
      .input('HolidayDate', HolidayDate)
      .input('Description', Description || null)
      .query(`
        UPDATE Holidays
        SET
          HolidayDate = @HolidayDate,
          Description = @Description
        OUTPUT INSERTED.*
        WHERE HolidayID = @holidayId
      `);

    const updatedHoliday = result.recordset[0];

    // Clear holiday cache since we updated a holiday
    clearHolidaysCache();

    res.json({
      success: true,
      message: 'Holiday updated successfully',
      data: updatedHoliday
    });

  } catch (error) {
    console.error('Error updating holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update holiday',
      error: error.message
    });
  }
};

// DELETE /api/holidays/:id - Delete holiday
export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Check if holiday exists
    const checkResult = await pool.request()
      .input('holidayId', id)
      .query('SELECT HolidayID FROM Holidays WHERE HolidayID = @holidayId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }

    await pool.request()
      .input('holidayId', id)
      .query('DELETE FROM Holidays WHERE HolidayID = @holidayId');

    // Clear holiday cache since we deleted a holiday
    clearHolidaysCache();

    res.json({
      success: true,
      message: 'Holiday deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete holiday',
      error: error.message
    });
  }
};
