// Define price ranges outside the component so they don't get recreated on every render
const priceRanges = [
  { label: 'Any Price', min: 0, max: Infinity, id: 'any' },
  { label: 'Under ₹100', min: 0, max: 100, id: '0-100' },
  { label: '₹100 to ₹500', min: 100, max: 500, id: '100-500' },
  { label: '₹500 to ₹1000', min: 500, max: 1000, id: '500-1000' },
  { label: 'Over ₹1000', min: 1000, max: Infinity, id: '1000+' },
];

export default function FilterSidebar({ 
  searchQuery, setSearchQuery, 
  categories, selectedCategories, setSelectedCategories,
  activePriceRange, setActivePriceRange
}) {

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== value));
    }
  };

  return (
    <aside className="lg:w-1/4 p-6 bg-gray-50 rounded-lg shadow-sm h-fit sticky top-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Filters</h2>

      {/* Search Filter */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for items..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6 border-t pt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <input
                id={category}
                name={category}
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={category} className="ml-3 text-sm text-gray-600">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="border-t pt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setActivePriceRange(range.id === 'any' ? null : range)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activePriceRange?.id === range.id || (range.id === 'any' && !activePriceRange)
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}