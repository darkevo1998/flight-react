import { useFlights } from '../context/FlightsContext';
import FlightCard from './FlightCard';
import FlightFilters from './FlightFilters';
import LoadingSpinner from './LoadingSpinner';

const SearchResults = () => {
  const { flightDetails, loading, error, filters, applyFilters } = useFlights();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!flightDetails?.data?.itineraries?.length) {
    return <div className="text-center py-8">No flights found. Try different search criteria.</div>;
  }

  // Process flight data from the new API response
  const processedFlights = flightDetails.data.itineraries.map(itinerary => {
    const firstLeg = itinerary.legs[0];
    const lastLeg = itinerary.legs[itinerary.legs.length - 1];
    
    // Calculate duration in minutes
    const departure = new Date(firstLeg.departure);
    const arrival = new Date(lastLeg.arrival);
    const durationInMinutes = Math.round((arrival - departure) / (1000 * 60));
    
    return {
      id: itinerary.id,
      airline: firstLeg.carriers.marketing[0]?.name || 'Unknown Airline',
      flightNumber: firstLeg.carriers.marketing[0]?.flightNumber || '',
      departureTime: departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      arrivalTime: arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      departureDate: departure.toLocaleDateString(),
      origin: `${firstLeg.origin.city} (${firstLeg.origin.displayCode})`,
      destination: `${lastLeg.destination.city} (${lastLeg.destination.displayCode})`,
      duration: `${Math.floor(durationInMinutes / 60)}h ${durationInMinutes % 60}m`,
      stops: itinerary.stopCount,
      price: itinerary.price.raw,
      formattedPrice: itinerary.price.formatted,
      cabinClass: 'economy', // Default or extract from itinerary if available
      farePolicy: {
        isRefundable: itinerary.farePolicy?.isCancellationAllowed || false,
        isChangeable: itinerary.farePolicy?.isChangeAllowed || false
      },
      tags: itinerary.tags || []
    };
  });

  // Apply filters
  let filteredFlights = processedFlights;
  
  if (filters.airlines.length > 0) {
    filteredFlights = filteredFlights.filter(flight => 
      filters.airlines.includes(flight.airline)
    );
  }
  
  if (filters.maxPrice) {
    filteredFlights = filteredFlights.filter(flight => 
      flight.price <= filters.maxPrice
    );
  }
  
  if (filters.stops !== null) {
    filteredFlights = filteredFlights.filter(flight => 
      flight.stops === filters.stops
    );
  }
  
  // Apply sorting
  filteredFlights = [...filteredFlights].sort((a, b) => {
    if (filters.sortBy === 'price') return a.price - b.price;
    if (filters.sortBy === 'duration') {
      return (a.durationInMinutes || 0) - (b.durationInMinutes || 0);
    }
    if (filters.sortBy === 'departure') {
      return new Date(a.departureDate + ' ' + a.departureTime) - 
             new Date(b.departureDate + ' ' + b.departureTime);
    }
    return 0;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/4">
        <FlightFilters 
          flights={processedFlights} 
          currentFilters={filters}
          onFilterChange={applyFilters}
        />
      </div>
      <div className="lg:w-3/4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredFlights.length} {filteredFlights.length === 1 ? 'Flight' : 'Flights'} Found
          </h2>
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">Sort by:</label>
            <select 
              className="p-2 border border-gray-300 rounded-md text-sm"
              value={filters.sortBy}
              onChange={(e) => applyFilters({...filters, sortBy: e.target.value})}
            >
              <option value="price">Price (Lowest)</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="departure">Departure (Earliest)</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              isCheapest={flight.tags.includes('cheapest')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;