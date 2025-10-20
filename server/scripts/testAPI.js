import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.yellow}=== ${msg} ===${colors.reset}`),
  data: (msg) => console.log(`${colors.cyan}  ${msg}${colors.reset}`)
};

let testResourceId;
let testTaskId;
let testTaskId2;
let testHolidayId;

async function testHealthCheck() {
  log.section('Health Check');
  try {
    const response = await axios.get('http://localhost:5000/health');
    log.success(`Server is running: ${response.data.message}`);
    log.data(`Timestamp: ${response.data.timestamp}`);
    return true;
  } catch (error) {
    log.error('Server is not running. Make sure to start the server first.');
    log.error('Run: npm run dev');
    return false;
  }
}

async function testResourceEndpoints() {
  log.section('Resource Endpoints');

  try {
    // CREATE Resource
    log.info('Creating new resource...');
    const createResponse = await axios.post(`${API_URL}/resources`, {
      Name: 'John Doe',
      Unit: 'Engineering',
      Role: 'Senior Developer',
      CapacityPerWeek: 40,
      RateCard: 500,
      Generalization: 'Software Development',
      Specialization: 'Full Stack'
    });
    testResourceId = createResponse.data.data.ResourceID;
    log.success(`Resource created with ID: ${testResourceId}`);
    log.data(`Name: ${createResponse.data.data.Name}`);
    log.data(`Rate Card: $${createResponse.data.data.RateCard}/day`);

    // GET All Resources
    log.info('Fetching all resources...');
    const allResponse = await axios.get(`${API_URL}/resources`);
    log.success(`Fetched ${allResponse.data.count} resource(s)`);
    if (allResponse.data.data.length > 0) {
      const resource = allResponse.data.data[0];
      log.data(`Current Allocation: ${resource.CurrentAllocation}%`);
      log.data(`Billable Allocation: ${resource.BillableAllocation}%`);
      log.data(`Max Revenue/Week: $${resource.MaxRevenuePerWeek}`);
    }

    // GET Single Resource
    log.info(`Fetching resource ID: ${testResourceId}...`);
    const singleResponse = await axios.get(`${API_URL}/resources/${testResourceId}`);
    log.success(`Resource found: ${singleResponse.data.data.Name}`);
    log.data(`Unit: ${singleResponse.data.data.Unit}`);
    log.data(`Role: ${singleResponse.data.data.Role}`);

    // UPDATE Resource
    log.info('Updating resource (changing rate card)...');
    const updateResponse = await axios.put(`${API_URL}/resources/${testResourceId}`, {
      Name: 'John Doe',
      Unit: 'Engineering',
      Role: 'Lead Developer',
      CapacityPerWeek: 40,
      RateCard: 600,
      Generalization: 'Software Development',
      Specialization: 'Full Stack'
    });
    log.success(`Resource updated successfully`);
    log.data(`Old Rate: $500 → New Rate: $${updateResponse.data.data.RateCard}`);
    log.data(`Role updated: ${updateResponse.data.data.Role}`);

    return true;
  } catch (error) {
    log.error(`Resource test failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.data?.error) {
      log.error(`Details: ${error.response.data.error}`);
    }
    return false;
  }
}

async function testTaskEndpoints() {
  log.section('Task Endpoints');

  if (!testResourceId) {
    log.error('No resource ID available. Skipping task tests.');
    return false;
  }

  try {
    // CREATE Task 1 (Billable, Ongoing)
    log.info('Creating billable task...');
    const createResponse = await axios.post(`${API_URL}/tasks`, {
      ResourceID: testResourceId,
      TaskName: 'Build Allocatr API',
      TaskType: 'Project',
      TaskStatus: 'Ongoing',
      StartDate: '2025-10-01',
      EndDate: '2025-12-31',
      TaskAllocationHours: 6,
      Billable: true
    });
    testTaskId = createResponse.data.data.TaskID;
    log.success(`Task created with ID: ${testTaskId}`);
    log.data(`Task: ${createResponse.data.data.TaskName}`);
    log.data(`Allocation: ${createResponse.data.data.TaskAllocationPercentage}%`);
    log.data(`Progress: ${createResponse.data.data.TaskProgress}%`);
    log.data(`Billable: ${createResponse.data.data.Billable ? 'Yes' : 'No'}`);

    // CREATE Task 2 (Non-billable, Ongoing)
    log.info('Creating non-billable task...');
    const createResponse2 = await axios.post(`${API_URL}/tasks`, {
      ResourceID: testResourceId,
      TaskName: 'Team Meetings',
      TaskType: 'Admin',
      TaskStatus: 'Ongoing',
      StartDate: '2025-10-01',
      EndDate: '2025-12-31',
      TaskAllocationHours: 1,
      Billable: false
    });
    testTaskId2 = createResponse2.data.data.TaskID;
    log.success(`Task created with ID: ${testTaskId2}`);
    log.data(`Task: ${createResponse2.data.data.TaskName}`);
    log.data(`Allocation: ${createResponse2.data.data.TaskAllocationPercentage}%`);

    // GET All Tasks
    log.info('Fetching all tasks...');
    const allResponse = await axios.get(`${API_URL}/tasks`);
    log.success(`Fetched ${allResponse.data.count} task(s)`);

    // GET Tasks by Resource
    log.info(`Fetching tasks for resource ${testResourceId}...`);
    const resourceTasksResponse = await axios.get(`${API_URL}/tasks/resource/${testResourceId}`);
    log.success(`Found ${resourceTasksResponse.data.count} task(s) for ${resourceTasksResponse.data.resourceName}`);
    resourceTasksResponse.data.data.forEach((task, index) => {
      log.data(`Task ${index + 1}: ${task.TaskName} (${task.TaskStatus}) - ${task.TaskAllocationPercentage}%`);
    });

    // GET Single Task
    log.info(`Fetching task ID: ${testTaskId}...`);
    const singleResponse = await axios.get(`${API_URL}/tasks/${testTaskId}`);
    log.success(`Task found: ${singleResponse.data.data.TaskName}`);
    log.data(`Status: ${singleResponse.data.data.TaskStatus}`);
    log.data(`Type: ${singleResponse.data.data.TaskType}`);

    // UPDATE Task
    log.info('Updating task (reducing allocation)...');
    const updateResponse = await axios.put(`${API_URL}/tasks/${testTaskId}`, {
      TaskName: 'Build Allocatr API (Updated)',
      TaskType: 'Project',
      TaskStatus: 'Ongoing',
      StartDate: '2025-10-01',
      EndDate: '2025-12-31',
      TaskAllocationHours: 4,
      Billable: true,
      IsVisible: true
    });
    log.success(`Task updated successfully`);
    log.data(`Allocation: 75% → ${updateResponse.data.data.TaskAllocationPercentage}%`);

    // BULK UPDATE Tasks
    log.info('Testing bulk update (pausing all tasks)...');
    const bulkResponse = await axios.patch(`${API_URL}/tasks/bulk`, {
      taskIds: [testTaskId, testTaskId2],
      updates: {
        TaskStatus: 'Paused'
      }
    });
    log.success(`Bulk update completed`);
    log.data(`Updated ${bulkResponse.data.affectedRows} task(s)`);

    // Verify bulk update
    log.info('Verifying bulk update...');
    const verifyResponse = await axios.get(`${API_URL}/tasks/${testTaskId}`);
    log.success(`Status changed to: ${verifyResponse.data.data.TaskStatus}`);

    // Restore tasks to Ongoing for calculations
    log.info('Restoring tasks to Ongoing status...');
    await axios.patch(`${API_URL}/tasks/bulk`, {
      taskIds: [testTaskId, testTaskId2],
      updates: {
        TaskStatus: 'Ongoing'
      }
    });
    log.success('Tasks restored to Ongoing');

    // Test Resource with Updated Calculations
    log.info('Fetching resource with updated calculations...');
    const detailsResponse = await axios.get(`${API_URL}/resources/${testResourceId}/details`);
    log.success('Resource calculations updated:');
    log.data(`Current Allocation: ${detailsResponse.data.data.resource.CurrentAllocation}%`);
    log.data(`Billable Allocation: ${detailsResponse.data.data.resource.BillableAllocation}%`);
    log.data(`Max Revenue/Week: $${detailsResponse.data.data.resource.MaxRevenuePerWeek}`);
    log.data(`Actual Revenue This Week: $${detailsResponse.data.data.resource.ActualRevenueThisWeek}`);
    log.data(`Forecasted Revenue: $${detailsResponse.data.data.resource.ForecastedRevenue}`);
    log.data(`Total Tasks: ${detailsResponse.data.data.tasks.length}`);

    return true;
  } catch (error) {
    log.error(`Task test failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.data?.error) {
      log.error(`Details: ${error.response.data.error}`);
    }
    return false;
  }
}

async function testHolidayEndpoints() {
  log.section('Holiday Endpoints');

  try {
    // CREATE Holiday
    log.info('Creating new holiday...');
    const createResponse = await axios.post(`${API_URL}/holidays`, {
      HolidayDate: '2025-11-15',
      Description: 'Kyla Birthday (Test)'
    });
    testHolidayId = createResponse.data.data.HolidayID;
    log.success(`Holiday created with ID: ${testHolidayId}`);
    log.data(`Date: ${new Date(createResponse.data.data.HolidayDate).toLocaleDateString()}`);
    log.data(`Description: ${createResponse.data.data.Description}`);

    // GET All Holidays
    log.info('Fetching all holidays...');
    const allResponse = await axios.get(`${API_URL}/holidays`);
    log.success(`Fetched ${allResponse.data.count} holiday(s)`);
    if (allResponse.data.count > 0) {
      const firstHoliday = allResponse.data.data[0];
      log.data(`First holiday: ${firstHoliday.Description} (${new Date(firstHoliday.HolidayDate).toLocaleDateString()})`);
    }

    // GET Single Holiday
    log.info(`Fetching holiday ID: ${testHolidayId}...`);
    const singleResponse = await axios.get(`${API_URL}/holidays/${testHolidayId}`);
    log.success(`Holiday found: ${singleResponse.data.data.Description}`);

    // GET Holidays by Date Range
    log.info('Fetching holidays in date range (2025)...');
    const rangeResponse = await axios.get(`${API_URL}/holidays/range?start=2025-01-01&end=2025-12-31`);
    log.success(`Found ${rangeResponse.data.count} holiday(s) in 2025`);
    if (rangeResponse.data.count > 0) {
      rangeResponse.data.data.slice(0, 3).forEach((holiday, index) => {
        log.data(`${index + 1}. ${holiday.Description} - ${new Date(holiday.HolidayDate).toLocaleDateString()}`);
      });
      if (rangeResponse.data.count > 3) {
        log.data(`... and ${rangeResponse.data.count - 3} more`);
      }
    }

    // UPDATE Holiday
    log.info('Updating holiday description...');
    const updateResponse = await axios.put(`${API_URL}/holidays/${testHolidayId}`, {
      HolidayDate: '2025-02-25',
      Description: 'Test Holiday (Updated Test)'
    });
    log.success(`Holiday updated: ${updateResponse.data.data.Description}`);

    // Test duplicate prevention
    log.info('Testing duplicate date prevention...');
    try {
      await axios.post(`${API_URL}/holidays`, {
        HolidayDate: '2025-12-25',
        Description: 'Duplicate Holiday'
      });
      log.error('Duplicate prevention failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        log.success('Duplicate prevention working correctly');
        log.data(`Error message: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    return true;
  } catch (error) {
    log.error(`Holiday test failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.data?.error) {
      log.error(`Details: ${error.response.data.error}`);
    }
    return false;
  }
}

async function testValidation() {
  log.section('Validation Tests');

  try {
    // Test invalid TaskType
    log.info('Testing invalid TaskType validation...');
    try {
      await axios.post(`${API_URL}/tasks`, {
        ResourceID: testResourceId,
        TaskName: 'Invalid Task',
        TaskType: 'InvalidType',
        TaskStatus: 'Ongoing'
      });
      log.error('TaskType validation failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        log.success('TaskType validation working');
      } else {
        throw error;
      }
    }

    // Test invalid TaskStatus
    log.info('Testing invalid TaskStatus validation...');
    try {
      await axios.post(`${API_URL}/tasks`, {
        ResourceID: testResourceId,
        TaskName: 'Invalid Task',
        TaskType: 'Project',
        TaskStatus: 'InvalidStatus'
      });
      log.error('TaskStatus validation failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        log.success('TaskStatus validation working');
      } else {
        throw error;
      }
    }

    // Test invalid date range
    log.info('Testing date range validation...');
    try {
      await axios.post(`${API_URL}/tasks`, {
        ResourceID: testResourceId,
        TaskName: 'Invalid Dates',
        TaskType: 'Project',
        TaskStatus: 'Ongoing',
        StartDate: '2025-12-31',
        EndDate: '2025-01-01'
      });
      log.error('Date validation failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        log.success('Date range validation working');
      } else {
        throw error;
      }
    }

    // Test missing required fields
    log.info('Testing required field validation...');
    try {
      await axios.post(`${API_URL}/resources`, {
        Unit: 'Engineering'
      });
      log.error('Required field validation failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        log.success('Required field validation working');
      } else {
        throw error;
      }
    }

    // Test non-existent resource
    log.info('Testing resource existence check...');
    try {
      await axios.post(`${API_URL}/tasks`, {
        ResourceID: 99999,
        TaskName: 'Task for non-existent resource',
        TaskType: 'Project',
        TaskStatus: 'Ongoing'
      });
      log.error('Resource existence check failed - should have been rejected');
      return false;
    } catch (error) {
      if (error.response?.status === 404) {
        log.success('Resource existence check working');
      } else {
        throw error;
      }
    }

    log.success('All validation tests passed!');
    return true;
  } catch (error) {
    log.error(`Validation test failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function cleanup() {
  log.section('Cleanup');

  try {
    // Delete test tasks
    if (testTaskId) {
      log.info(`Deleting test task ${testTaskId}...`);
      await axios.delete(`${API_URL}/tasks/${testTaskId}`);
      log.success('Task 1 deleted');
    }

    if (testTaskId2) {
      log.info(`Deleting test task ${testTaskId2}...`);
      await axios.delete(`${API_URL}/tasks/${testTaskId2}`);
      log.success('Task 2 deleted');
    }

    // Delete test resource (will cascade delete tasks if any remain)
    if (testResourceId) {
      log.info(`Deleting test resource ${testResourceId}...`);
      await axios.delete(`${API_URL}/resources/${testResourceId}`);
      log.success('Resource deleted');
    }

    // Delete test holiday
    if (testHolidayId) {
      log.info(`Deleting test holiday ${testHolidayId}...`);
      await axios.delete(`${API_URL}/holidays/${testHolidayId}`);
      log.success('Holiday deleted');
    }

    return true;
  } catch (error) {
    log.error(`Cleanup failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log(`${colors.magenta}
╔════════════════════════════════════════════╗
║                                            ║
║      Allocatr API Test Suite v2.0         ║
║                                            ║
╚════════════════════════════════════════════╝${colors.reset}
  `);

  const results = {
    health: false,
    resources: false,
    tasks: false,
    holidays: false,
    validation: false,
    cleanup: false
  };

  // Run tests
  results.health = await testHealthCheck();

  if (results.health) {
    results.resources = await testResourceEndpoints();
    results.tasks = await testTaskEndpoints();
    results.holidays = await testHolidayEndpoints();
    results.validation = await testValidation();
    results.cleanup = await cleanup();
  } else {
    log.error('Server health check failed. Stopping tests.');
    log.info('Please start the server with: npm run dev');
  }

  // Summary
  log.section('Test Summary');
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;

  console.log(`\n${colors.cyan}Test Results:${colors.reset}`);
  console.log(`  Health Check:           ${results.health ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`  Resource Endpoints:     ${results.resources ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`  Task Endpoints:         ${results.tasks ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`  Holiday Endpoints:      ${results.holidays ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`  Validation Tests:       ${results.validation ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`  Cleanup:                ${results.cleanup ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);

  console.log(`\n${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}Final Score: ${passedTests}/${totalTests} test suites passed${colors.reset}`);
  console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (passedTests === totalTests) {
    console.log(`${colors.green}╔════════════════════════════════════════════╗`);
    console.log(`║                                            ║`);
    console.log(`║     ✓ ALL TESTS PASSED! 🎉                ║`);
    console.log(`║                                            ║`);
    console.log(`║  Your API is fully functional and ready   ║`);
    console.log(`║  for frontend integration!                ║`);
    console.log(`║                                            ║`);
    console.log(`╚════════════════════════════════════════════╝${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}╔════════════════════════════════════════════╗`);
    console.log(`║                                            ║`);
    console.log(`║     ✗ SOME TESTS FAILED                   ║`);
    console.log(`║                                            ║`);
    console.log(`║  Please review the errors above and fix   ║`);
    console.log(`║  the issues before proceeding.            ║`);
    console.log(`║                                            ║`);
    console.log(`╚════════════════════════════════════════════╝${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test runner failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
