import React from "react";

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment,
  selectedLocation,
  setSelectedLocation,
  departments,
  locations,
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300  w-full md:w-auto"
      />
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300 w-full md:w-auto text-text-secondary"
      >
        <option value="">All Departments</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="p-2  bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-300 w-full md:w-auto text-text-secondary"
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilters;
