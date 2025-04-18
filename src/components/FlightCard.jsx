const FlightCard = ({ flight }) => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src={`https://logo.clearbit.com/${flight.airline.toLowerCase()}.com`} 
                alt={flight.airline}
                className="h-8 w-8 mr-3 object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/32?text=Airline';
                }}
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{flight.airline}</h3>
                <p className="text-sm text-gray-500">Flight #{flight.flightNumber}</p>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{flight.departureTime}</p>
              <p className="text-sm text-gray-500">{flight.origin}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 mb-1">{flight.duration}</div>
              <div className="w-full border-t border-gray-300 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
              <p className="text-sm text-gray-500">{flight.destination}</p>
            </div>
          </div>
  
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">Price per person</p>
              <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Select
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default FlightCard;