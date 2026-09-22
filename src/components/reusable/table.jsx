import { useState, useEffect, useRef } from "react";
import { Edit, Eye, Trash2, Search, Filter, X, ChevronUp, ChevronDown, Loader2 } from "lucide-react";

const ReusableTable = ({
  columns = [],
  data = [],
  onEdit,
  onView,
  onDelete,
  emptyMessage = "No data available",
  pagination = null,
  onPageChange = null,
  enableSearch = false,
  enableFilter = false,
  onSearch = null,
  onFilter = null,
  filterOptions = [],
  isSearching = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const filterDropdownRef = useRef(null);
  const tableRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (onSearch) {
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, 500);
    }
  };

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
    if (onFilter) {
      onFilter(filterValue);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const clearFilter = () => {
    setSelectedFilter("");
    if (onFilter) {
      onFilter("");
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleSort = (columnKey) => {
    if (columnKey === "sNo") return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  };

  const sortedData = getSortedData();

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col w-full overflow-hidden text-gray-700 bg-gray-50 shadow-md rounded-xl bg-clip-border">
      
      {/* Search and Filter Header */}
      {(enableSearch || enableFilter) && (
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-b from-white/0 to-green-800/5">
          {enableSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="animate-spin text-green-600" size={16} />
                </div>
              ) : searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
          )}
          
          {enableFilter && (
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                  selectedFilter 
                    ? "bg-green-50 border-green-300 text-green-700" 
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Filter size={16} />
                <span>Filter</span>
                {selectedFilter && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter();
                    }}
                    className="ml-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-1">
                    <button
                      onClick={() => handleFilterChange("")}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        !selectedFilter ? "bg-green-50 text-green-700" : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      All
                    </button>
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange(option.value)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          selectedFilter === option.value 
                            ? "bg-green-50 text-green-700" 
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Horizontal Scroll */}
      <div
        ref={tableRef}
        className="w-full overflow-x-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: isDragging ? 'none' : 'auto' }}
      >
        <table className="w-full min-w-max text-left table-auto">
          
          {/* Table Header */}
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`p-4 border-b border-gray-200 bg-green-700 text-white ${
                    column.key !== "sNo" ? "hover:bg-green-600 transition-colors" : ""
                  }`}
                  onClick={() => handleSort(column.key)}
                  style={column.key !== "sNo" ? { cursor: 'pointer' } : {}}
                >
                  <div className="flex items-center gap-2">
                    <p className="block font-sans text-sm font-semibold leading-none">
                      {column.label}
                    </p>
                    {column.key !== "sNo" && (
                      <div className="flex flex-col">
                        <ChevronUp
                          size={14}
                          className={`${
                            sortColumn === column.key && sortDirection === "asc"
                              ? "text-white"
                              : "text-green-300"
                          }`}
                        />
                        <ChevronDown
                          size={14}
                          className={`-mt-2 ${
                            sortColumn === column.key && sortDirection === "desc"
                              ? "text-white"
                              : "text-green-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}

              {/* Action Header */}
              {(onEdit || onView || onDelete) && (
                <th className="p-4 border-b border-gray-200 bg-green-700 text-white">
                  <p className="block font-sans text-sm font-semibold leading-none">
                    Action
                  </p>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
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
                            style={{ cursor: 'pointer' }}
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                            style={{ cursor: 'pointer' }}
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            style={{ cursor: 'pointer' }}
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
                  colSpan={columns.length + ((onEdit || onView || onDelete) ? 1 : 0)}
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