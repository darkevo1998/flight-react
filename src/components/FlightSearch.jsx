import { useState, useEffect } from 'react';
import { useFlights } from '../context/FlightsContext';
import { fetchAirportSuggestions, searchFlights, pollFlightResults, searchFlightsComplete, searchFlightsWebComplete } from '../services/api';

const FlightSearch = ({ onSearch }) => {
    const { searchFlightDetails, setFlightDetails } = useFlights();
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    originSkyId: '',       // Add these to initial state
    originEntityId: '',    // Add these to initial state
    destinationSkyId: '',  // Add these to initial state
    destinationEntityId: '', // Add these to initial state
    date: '',
    returnDate: '',
    passengers: 1,
    tripType: 'one-way',
  });
  
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [isLoadingOrigins, setIsLoadingOrigins] = useState(false);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Added loading state for search

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchOriginSuggestions = async (query) => {
    if (!query) {
      setOriginSuggestions([]);
      return;
    }
    setIsLoadingOrigins(true);
    try {
      const data = await fetchAirportSuggestions(query);
      setOriginSuggestions(data);
    } catch (error) {
      console.error('Error fetching origin suggestions:', error);
      setOriginSuggestions([]);
    } finally {
      setIsLoadingOrigins(false);
    }
  };

  const fetchDestinationSuggestions = async (query) => {
    if (!query) {
      setDestinationSuggestions([]);
      return;
    }
    setIsLoadingDestinations(true);
    try {
      const data = await fetchAirportSuggestions(query);
      setDestinationSuggestions(data);
    } catch (error) {
      console.error('Error fetching destination suggestions:', error);
      setDestinationSuggestions([]);
    } finally {
      setIsLoadingDestinations(false);
    }
  };

  const debouncedFetchOrigins = debounce(fetchOriginSuggestions, 300);
  const debouncedFetchDestinations = debounce(fetchDestinationSuggestions, 300);

  useEffect(() => {
    debouncedFetchOrigins(searchParams.origin);
  }, [searchParams.origin]);

  useEffect(() => {
    debouncedFetchDestinations(searchParams.destination);
  }, [searchParams.destination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAirportSelect = (type, airport) => {
    if (type === 'origin') {
      setSearchParams(prev => ({
        ...prev,
        origin: airport.code,
        originEntityId: airport.entityId, // Added entityId
        originSkyId: airport.skyId       // Added skyId
      }));
      setShowOriginDropdown(false);
    } else {
      setSearchParams(prev => ({
        ...prev,
        destination: airport.code,
        destinationEntityId: airport.entityId, // Added entityId
        destinationSkyId: airport.skyId       // Added skyId
      }));
      setShowDestinationDropdown(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Set loading state to true
    try {
      // Validate inputs
      if (!searchParams.originSkyId || !searchParams.destinationSkyId || !searchParams.date) {
        throw new Error('Please select valid airports and date');
      }
  
      // Prepare API parameters
      const apiParams = {
        originSkyId: searchParams.originSkyId,
        destinationSkyId: searchParams.destinationSkyId,
        originEntityId: searchParams.originEntityId,
        destinationEntityId: searchParams.destinationEntityId,
        date: formatDate(searchParams.date),
        adults: searchParams.passengers,
        cabinClass: 'economy',
        ...(searchParams.tripType === 'round-trip' && {
          returnDate: formatDate(searchParams.returnDate)
        })
      };

      await searchFlightDetails(apiParams);
  
      // Call callback if provided
      if (onSearch) onSearch();
  
    } catch (error) {
      console.error('Search error:', error);
      alert(`Search failed: ${error.message}`);
    }
    finally{
        setIsSearching(false); // Reset loading state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <input
                type="text"
                name="origin"
                value={searchParams.origin}
                onChange={handleChange}
                onFocus={() => setShowOriginDropdown(true)}
                onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City or Airport"
                required
              />
              {showOriginDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {isLoadingOrigins ? (
                    <div className="px-4 py-2 text-gray-500">Loading...</div>
                  ) : originSuggestions.length > 0 ? (
                    originSuggestions.map((airport) => (
                      <div
                        key={airport.code}
                        className="cursor-pointer hover:bg-blue-50 px-4 py-2"
                        onClick={() => handleAirportSelect('origin', airport)}
                      >
                        <div className="font-medium">{airport.city} ({airport.code})</div>
                        <div className="text-xs text-gray-500">{airport.name}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No airports found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <input
                type="text"
                name="destination"
                value={searchParams.destination}
                onChange={handleChange}
                onFocus={() => setShowDestinationDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City or Airport"
                required
              />
              {showDestinationDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {isLoadingDestinations ? (
                    <div className="px-4 py-2 text-gray-500">Loading...</div>
                  ) : destinationSuggestions.length > 0 ? (
                    destinationSuggestions.map((airport) => (
                      <div
                        key={airport.code}
                        className="cursor-pointer hover:bg-blue-50 px-4 py-2"
                        onClick={() => handleAirportSelect('destination', airport)}
                      >
                        <div className="font-medium">{airport.city} ({airport.code})</div>
                        <div className="text-xs text-gray-500">{airport.name}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No airports found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {searchParams.tripType === 'round-trip' && (
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
              <input
                type="date"
                name="returnDate"
                value={searchParams.returnDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
            <select
              name="passengers"
              value={searchParams.passengers}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tripType"
                value="one-way"
                checked={searchParams.tripType === 'one-way'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">One-way</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tripType"
                value="round-trip"
                checked={searchParams.tripType === 'round-trip'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Round-trip</span>
            </label>
          </div>
          <button
  type="submit"
  disabled={isSearching}
  className={`
    relative overflow-hidden
    w-full md:w-auto
    px-6 py-3
    bg-gradient-to-r from-blue-600 to-blue-500
    hover:from-blue-700 hover:to-blue-600
    text-white font-medium rounded-lg
    shadow-lg hover:shadow-xl
    transition-all duration-300
    transform hover:scale-[1.02]
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
    ${isSearching ? 'cursor-not-allowed opacity-90' : ''}
  `}
>
  <span className="relative z-10 flex items-center justify-center gap-2">
    {isSearching ? (
      <>
        <svg 
          className="animate-spin h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Searching...
      </>
    ) : (
      <>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
            clipRule="evenodd" 
          />
        </svg>
        Search Flights
      </>
    )}
  </span>
  
  {/* Animated background element */}
  {!isSearching && (
    <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
  )}
</button>
        </div>
      </form>
    </div>
  );
};

export default FlightSearch;