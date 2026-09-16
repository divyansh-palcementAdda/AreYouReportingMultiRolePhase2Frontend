import { useState } from "react";

const ReusableTable = ({
  columns = [],
  data = [],
  onEdit,
  emptyMessage = "No data available",
  pagination = null,
  onPageChange = null,
}) => {
  const [orderedColumns, setOrderedColumns] = useState(columns);
  const [draggedColumn, setDraggedColumn] = useState(null);

  const handleDragStart = (index) => {
    setDraggedColumn(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (draggedColumn === null || draggedColumn === dropIndex) return;

    const updatedColumns = [...orderedColumns];

    const draggedItem = updatedColumns.splice(draggedColumn, 1)[0];

    updatedColumns.splice(dropIndex, 0, draggedItem);

    setOrderedColumns(updatedColumns);
    setDraggedColumn(null);
  };

  return (
    <div className="relative flex flex-col w-full overflow-hidden text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
      
      {/* Horizontal Scroll */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-max text-left table-auto">
          
          {/* Table Header */}
          <thead>
            <tr>
              {orderedColumns.map((column, index) => (
                <th
                  key={column.key}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="p-4 border-b border-gray-200 bg-gradient-to-b from-white/0 to-green-800/10 cursor-grab select-none"
                >
                  <p className="block font-sans text-sm font-semibold leading-none text-gray-700">
                    {column.label}
                  </p>
                </th>
              ))}

              {/* Action Header */}
              {onEdit && (
                <th className="p-4 border-b border-gray-200 bg-gradient-to-b from-white/0 to-green-800/10">
                  <p className="block font-sans text-sm font-semibold leading-none text-gray-700">
                    Action
                  </p>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {orderedColumns.map((column) => (
                    <td
                      key={column.key}
                      className="p-4 border-b border-gray-100"
                    >
                      <p className="block font-sans text-sm font-normal leading-normal text-gray-700">
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key] ?? "-"}
                      </p>
                    </td>
                  ))}

                  {/* Action */}
                  {onEdit && (
                    <td className="p-4 border-b border-gray-100">
                      <button
                        onClick={() => onEdit(row)}
                        className="font-medium text-sm text-green-700 hover:text-green-900"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={orderedColumns.length + (onEdit ? 1 : 0)}
                  className="p-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {pagination.totalElements > 0 ? (pagination.pageNumber * pagination.pageSize) + 1 : 0} to{" "}
            {Math.min((pagination.pageNumber + 1) * pagination.pageSize, pagination.totalElements)} of{" "}
            {pagination.totalElements} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber === 0}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.pageNumber + 1} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              disabled={pagination.last}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;