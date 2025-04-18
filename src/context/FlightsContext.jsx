import { createContext, useContext, useState } from 'react';
import { fetchFlightDetails } from '../services/api';

const FlightsContext = createContext();

export const FlightsProvider = ({ children }) => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    airlines: [],
    maxPrice: null,
    stops: null,
    sortBy: 'price',
  });

  const searchFlightDetails = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFlightDetails(searchParams);
      setFlightDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const value = {
    flightDetails,
    setFlightDetails,
    loading,
    error,
    filters,
    searchFlightDetails,
    applyFilters,
  };

  return <FlightsContext.Provider value={value}>{children}</FlightsContext.Provider>;
};

export const useFlights = () => {
  const context = useContext(FlightsContext);
  if (context === undefined) {
    throw new Error('useFlights must be used within a FlightsProvider');
  }
  return context;
};