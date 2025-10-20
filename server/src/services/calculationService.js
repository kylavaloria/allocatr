import {
  getNetworkDays,
  getWeekStart,
  getWeekEnd,
  addWorkDays,
  isToday,
  isBefore,
  isAfter
} from './dateService.js';

/**
 * 1. Current Allocation %
 * Sum of all allocation percentages from ongoing tasks
 */
export const calculateCurrentAllocation = async (resourceId, tasks) => {
  const ongoingTasks = tasks.filter(task =>
    task.TaskStatus === 'Ongoing' &&
    task.IsVisible === true
  );

  const totalAllocation = ongoingTasks.reduce((sum, task) => {
    const allocationPercentage = (task.TaskAllocationHours || 0) / 8;
    return sum + allocationPercentage;
  }, 0);

  return Math.round(totalAllocation * 100); // Return as percentage (0-100)
};

/**
 * 2. Billable Allocation %
 * Portion of Current Allocation that is billable
 */
export const calculateBillableAllocation = async (resourceId, tasks) => {
  const billableOngoingTasks = tasks.filter(task =>
    task.TaskStatus === 'Ongoing' &&
    task.IsVisible === true &&
    task.Billable === true
  );

  const totalBillable = billableOngoingTasks.reduce((sum, task) => {
    const allocationPercentage = (task.TaskAllocationHours || 0) / 8;
    return sum + allocationPercentage;
  }, 0);

  return Math.round(totalBillable * 100); // Return as percentage (0-100)
};

/**
 * 3. Next Availability
 * Date when resource is projected to be free
 */
export const calculateNextAvailability = async (resourceId, tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Separate tasks into ongoing and future non-ongoing
  const ongoingTasks = tasks.filter(task =>
    task.TaskStatus === 'Ongoing' && task.EndDate
  );

  const futureNonOngoingTasks = tasks.filter(task =>
    task.TaskStatus !== 'Ongoing' &&
    task.EndDate &&
    new Date(task.EndDate) >= today
  );

  // Find earliest future non-ongoing date
  let earliestFutureDate = null;
  if (futureNonOngoingTasks.length > 0) {
    earliestFutureDate = futureNonOngoingTasks.reduce((earliest, task) => {
      const taskDate = new Date(task.EndDate);
      return !earliest || taskDate < earliest ? taskDate : earliest;
    }, null);
  }

  // Find latest ongoing task end date
  let latestOngoingEndDate = null;
  if (ongoingTasks.length > 0) {
    latestOngoingEndDate = ongoingTasks.reduce((latest, task) => {
      const taskDate = new Date(task.EndDate);
      return !latest || taskDate > latest ? taskDate : latest;
    }, null);
  }

  // Determine next availability
  if (earliestFutureDate) {
    return earliestFutureDate;
  } else if (latestOngoingEndDate) {
    // Add one workday after latest ongoing task
    return addWorkDays(latestOngoingEndDate, 1);
  } else {
    // No tasks, available now
    return today;
  }
};

/**
 * 4. Maximum Revenue per Week
 * Highest possible revenue at 100% billable rate
 */
export const calculateMaxRevenuePerWeek = (rateCard) => {
  if (!rateCard || rateCard <= 0) return 0;
  return rateCard * 5; // 5 working days per week
};

/**
 * 5. Actual Revenue this Week
 * Realized revenue based on hours spent on billable projects this week
 */
export const calculateActualRevenueThisWeek = async (resourceId, rateCard, tasks) => {
  if (!rateCard || rateCard <= 0) return 0;

  const weekStart = getWeekStart(new Date());
  const weekEnd = getWeekEnd(new Date());

  // Filter valid tasks
  const validTasks = tasks.filter(task =>
    task.Billable === true &&
    task.TaskStatus === 'Ongoing' &&
    task.IsVisible === true &&
    task.StartDate &&
    task.EndDate &&
    task.TaskAllocationHours
  );

  let totalRevenue = 0;

  for (const task of validTasks) {
    const taskStart = new Date(task.StartDate);
    const taskEnd = new Date(task.EndDate);

    // Find overlap between task duration and current week
    const overlapStart = taskStart > weekStart ? taskStart : weekStart;
    const overlapEnd = taskEnd < weekEnd ? taskEnd : weekEnd;

    // Only calculate if there's an overlap
    if (overlapStart <= overlapEnd) {
      const workingDays = await getNetworkDays(overlapStart, overlapEnd);
      const allocationDecimal = (task.TaskAllocationHours || 0) / 8;
      const taskRevenue = workingDays * allocationDecimal * rateCard;

      totalRevenue += taskRevenue;
    }
  }

  return Math.round(totalRevenue * 100) / 100; // Round to 2 decimal places
};

/**
 * 6. Forecasted Revenue next Week/s
 * Estimated revenue based on future planned allocations
 */
export const calculateForecastedRevenue = async (resourceId, rateCard, tasks, actualRevenue) => {
  if (!rateCard || rateCard <= 0) return 0;

  // Valid tasks: Billable, ONGOING or FUTURE WORK, visible
  const validTasks = tasks.filter(task =>
    task.Billable === true &&
    (task.TaskStatus === 'Ongoing' || task.TaskStatus === 'Future Work') &&
    task.IsVisible === true &&
    task.StartDate &&
    task.EndDate &&
    task.TaskAllocationHours
  );

  let allRevenue = 0;

  for (const task of validTasks) {
    const workingDays = await getNetworkDays(
      new Date(task.StartDate),
      new Date(task.EndDate)
    );
    const allocationDecimal = (task.TaskAllocationHours || 0) / 8;
    const taskRevenue = workingDays * allocationDecimal * rateCard;

    allRevenue += taskRevenue;
  }

  // Subtract actual revenue already earned
  const forecasted = allRevenue - (actualRevenue || 0);

  return Math.max(0, Math.round(forecasted * 100) / 100); // No negative forecasts
};

/**
 * 8. Task Progress
 * Measures completion progress per task
 */
export const calculateTaskProgress = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // If start and end are the same date
  if (start.getTime() === end.getTime()) {
    return today >= start ? 100 : 0;
  }

  // If today is before start
  if (today < start) {
    return 0;
  }

  // If today is after end
  if (today > end) {
    return 100;
  }

  // Calculate progress based on working days
  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const daysPassed = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
  const progress = (daysPassed / totalDays) * 100;

  return Math.min(100, Math.max(0, Math.round(progress)));
};

/**
 * 9. Task Allocation %
 * Percentage of time committed to a task per day
 */
export const calculateTaskAllocationPercentage = (taskAllocationHours) => {
  if (!taskAllocationHours || taskAllocationHours <= 0) return 0;
  return Math.round((taskAllocationHours / 8) * 100);
};
