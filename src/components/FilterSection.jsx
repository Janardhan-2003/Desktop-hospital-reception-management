import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterSection = ({ onFilter }) => {
  const [nameSearch, setNameSearch] = useState('');
  const [placeSearch, setPlaceSearch] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [moreFilters, setMoreFilters] = useState({
    date: '',
    age: '',
    referralName: '',
    ipNo: ''
  });

  const handleShowResults = () => {
    onFilter({
      name: nameSearch,
      place: placeSearch,
      ...moreFilters
    });
    setShowMoreFilters(false);
  };

  const clearFilters = () => {
    setNameSearch('');
    setPlaceSearch('');
    setMoreFilters({ date: '', age: '', referralName: '', ipNo: '' });
    onFilter({});
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by place..."
            value={placeSearch}
            onChange={(e) => setPlaceSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowMoreFilters(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Filter size={18} />
          <span>More Filters</span>
        </button>

        <button
          onClick={handleShowResults}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Show Results
        </button>
      </div>

      {showMoreFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">More Filters</h2>
              <button onClick={() => setShowMoreFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <input
                type="date"
                placeholder="Date"
                value={moreFilters.date}
                onChange={(e) => setMoreFilters({...moreFilters, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="number"
                placeholder="Age"
                value={moreFilters.age}
                onChange={(e) => setMoreFilters({...moreFilters, age: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                placeholder="Referral Name"
                value={moreFilters.referralName}
                onChange={(e) => setMoreFilters({...moreFilters, referralName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                placeholder="IP No"
                value={moreFilters.ipNo}
                onChange={(e) => setMoreFilters({...moreFilters, ipNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <button
                onClick={clearFilters}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <X size={16} />
                <span>Clear All Filters</span>
              </button>
            </div>

            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowMoreFilters(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleShowResults}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;