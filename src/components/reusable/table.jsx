import { useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";

const ReusableTable = ({
  columns = [],
  data = [],
  onEdit,
  onView,
  onDelete,
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
                  className="p-4 border-b border-gray-200 bg-gradient-to-t from-white/0 to-green-800/30 cursor-grab select-none text-gray-700"
                >
                  <p className="block font-sans text-sm font-semibold leading-none">
                    {column.label}
                  </p>
                </th>
              ))}

              {/* Action Header */}
              {(onEdit || onView || onDelete) && (
                <th className="p-4 border-b border-gray-200 bg-gradient-to-t from-white/0 to-green-800/30 text-gray-700">
                  <p className="block font-sans text-sm font-semibold leading-none">
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
                  {orderedColumns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className="p-4 border-b border-gray-100"
                    >
                      <p className="block font-sans text-sm font-normal leading-normal text-gray-700">
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : row[column.key] ?? "-"}
                      </p>
                    </td>
                  ))}

                  {/* Action */}
                  {(onEdit || onView || onDelete) && (
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={orderedColumns.length + ((onEdit || onView || onDelete) ? 1 : 0)}
                  className="p-8 text-center text-sm text-gray-500 bg-gradient-to-b from-white/0 to-green-800/5"
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
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gradient-to-b from-white/0 to-green-800/5">
          <div className="text-sm text-gray-600">
            Showing {pagination.totalElements > 0 ? (pagination.pageNumber * pagination.pageSize) + 1 : 0} to{" "}
            {Math.min((pagination.pageNumber + 1) * pagination.pageSize, pagination.totalElements)} of{" "}
            {pagination.totalElements} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber === 0}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">
              Page {pagination.pageNumber + 1} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              disabled={pagination.last}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
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