import { useState, useEffect } from 'react';
import { useFlights } from '../context/FlightsContext';

const FlightFilters = ({ flights }) => {
  const { filters, applyFilters } = useFlights();
  const [localFilters, setLocalFilters] = useState(filters);

  // Get unique airlines from flights
  const airlines = [...new Set(flights?.map(flight => flight.airline) || [])];
  const maxPrice = Math.max(...flights?.map(flight => flight.price) || [0]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setLocalFilters(prev => {
      let newValue;
      if (type === 'checkbox') {
        if (checked) {
          newValue = [...prev[name], value];
        } else {
          newValue = prev[name].filter(item => item !== value);
        }
      } else if (type === 'radio') {
        newValue = value === 'null' ? null : parseInt(value);
      } else {
        newValue = type === 'number' ? parseInt(value) : value;
      }
      
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleApplyFilters = () => {
    applyFilters(localFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-gray-700">Price Range</h4>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">$0</span>
          <span className="text-sm text-gray-600">${maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          name="maxPrice"
          min="0"
          max={maxPrice}
          value={localFilters.maxPrice || maxPrice}
          onChange={handleFilterChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-blue-600">
            Max: ${localFilters.maxPrice ? localFilters.maxPrice.toLocaleString() : maxPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-gray-700">Stops</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="stops"
              value="null"
              checked={localFilters.stops === null}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Any stops</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="stops"
              value="0"
              checked={localFilters.stops === 0}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Non-stop only</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="stops"
              value="1"
              checked={localFilters.stops === 1}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Up to 1 stop</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="stops"
              value="2"
              checked={localFilters.stops === 2}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Up to 2 stops</span>
          </label>
        </div>
      </div>

      {airlines.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3 text-gray-700">Airlines</h4>
          <div className="space-y-2">
            {airlines.map(airline => (
              <label key={airline} className="flex items-center">
                <input
                  type="checkbox"
                  name="airlines"
                  value={airline}
                  checked={localFilters.airlines.includes(airline)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{airline}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FlightFilters;