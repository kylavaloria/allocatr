import React, { useState, Fragment } from 'react';
import ResourceTableHeader from './ResourceTableHeader';
import ResourceRow from './ResourceRow';
import TaskDrawer from '../tasks/TaskDrawer';

const ResourceTable = ({ resources = [], onUpdate, onDelete, onRefresh }) => {
  const [expandedRowIds, setExpandedRowIds] = useState([]);

  const handleRowClick = (id) => {
    setExpandedRowIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((rowId) => rowId !== id);
      }
      return [...prevIds, id];
    });
  };

  // Show empty state if no resources
  if (resources.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-gray-200">
        <table className="w-full border-collapse table-fixed">
          <ResourceTableHeader />
          <tbody>
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-300">
                No resources found. Add your first resource to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200">
      <table className="w-full border-collapse table-fixed">
        <ResourceTableHeader />
        <tbody>
          {resources.map((resource, index) => {
            const isExpanded = expandedRowIds.includes(resource.ResourceID);
            const isLastRow = index === resources.length - 1;

            return (
              <Fragment key={resource.ResourceID}>
                <ResourceRow
                  id={resource.ResourceID}
                  name={resource.Name || 'N/A'}
                  unit={resource.Unit || 'N/A'}
                  role={resource.Role || 'N/A'}
                  generalization={resource.Generalization || 'N/A'}
                  specialization={resource.Specialization || 'N/A'}
                  currentAllocation={resource.CurrentAllocation || 0}
                  billableAllocation={resource.BillableAllocation || 0}
                  capacity={resource.CapacityPerWeek || 0}
                  rateCard={resource.RateCard || 0}
                  nextAvailability={resource.NextAvailability}
                  maxRevenuePerWeek={resource.MaxRevenuePerWeek || 0}
                  actualRevenueThisWeek={resource.ActualRevenueThisWeek || 0}
                  forecastedRevenue={resource.ForecastedRevenue || 0}
                  isExpanded={isExpanded}
                  isLastRow={isLastRow && !isExpanded}
                  onClick={() => handleRowClick(resource.ResourceID)}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onRefresh={onRefresh}
                />

                {isExpanded && (
                  <tr>
                    <td
                      colSpan={8}
                      className={`border-t border-gray-200 ${
                        isLastRow ? 'rounded-b-2xl' : ''
                      }`}
                    >
                      <div className={`${isLastRow ? 'rounded-b-2xl' : ''}`}>
                        <TaskDrawer
                          resourceId={resource.ResourceID}
                          onRefresh={onRefresh}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
