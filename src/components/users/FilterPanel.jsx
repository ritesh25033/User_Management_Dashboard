import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Modal from '../common/Modal';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    onFilterChange({ search: value });
  };

  const handleLocalFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    setLocalFilters({ search: '', name: '', email: '', company: '' });
    onClearFilters();
    setIsFilterModalOpen(false);
  };

  const hasActiveFilters = filters.name || filters.email || filters.company;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
              hasActiveFilters 
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                {Object.values(filters).filter(v => v && v !== filters.search).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Users"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={localFilters.name}
              onChange={handleLocalFilterChange}
              placeholder="Filter by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={localFilters.email}
              onChange={handleLocalFilterChange}
              placeholder="Filter by email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={localFilters.company}
              onChange={handleLocalFilterChange}
              placeholder="Filter by company..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
            <div className="space-x-2">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterPanel;
