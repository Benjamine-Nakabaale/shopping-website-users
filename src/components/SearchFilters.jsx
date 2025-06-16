import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getCategories } from '../services/productService';

export default function SearchFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  sortBy,
  onSortChange 
}) {
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await getCategories();
    setCategories(data || []);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center space-x-2 text-gray-600 mb-4"
      >
        <Filter size={16} />
        <span>Filters</span>
      </button>

      {/* Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4`}>
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}