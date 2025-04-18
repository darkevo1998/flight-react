// services/api.js
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const API_HOST = 'sky-scrapper.p.rapidapi.com';

export const searchFlights = async (params) => {
    const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights');
    
    // Required parameters
    url.searchParams.append('originSkyId', params.originSkyId);
    url.searchParams.append('destinationSkyId', params.destinationSkyId);
    url.searchParams.append('originEntityId', params.originEntityId || params.originSkyId);
    url.searchParams.append('destinationEntityId', params.destinationEntityId || params.destinationSkyId);
    url.searchParams.append('date', params.date);
    url.searchParams.append('adults', params.adults);
    url.searchParams.append('cabinClass', params.cabinClass || 'economy');
    url.searchParams.append('currency', 'USD');
    url.searchParams.append('locale', 'en-US');
    url.searchParams.append('countryCode', 'US');
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    };
  
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to search flights');
    }
  
    return data;
  };

export const getFlightDetails = async (sessionId) => {
  const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails');
  url.searchParams.append('sessionId', sessionId);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  const response = await fetch(url, options);
  return response.json();
};

export const fetchFlightDetails = async (params) => {
    const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsWebComplete');
    
    // Required parameters
    url.searchParams.append('originSkyId', params.originSkyId);
    url.searchParams.append('destinationSkyId', params.destinationSkyId);
    url.searchParams.append('originEntityId', params.originEntityId || params.originSkyId);
    url.searchParams.append('destinationEntityId', params.destinationEntityId || params.destinationSkyId);
    url.searchParams.append('date', params.date);
    url.searchParams.append('adults', params.adults || 1);
    url.searchParams.append('cabinClass', params.cabinClass || 'economy');
    url.searchParams.append('currency', 'USD');
    url.searchParams.append('market', 'en-US');
    url.searchParams.append('countryCode', 'US');
  
    // Optional parameters
    if (params.returnDate) {
      url.searchParams.append('returnDate', params.returnDate);
    }
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    };
  
    const response = await fetch(url, options);
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Flight search failed');
    }
  
    return data;
  };

export const fetchAirportSuggestions = async (query) => {
    const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport');
    url.searchParams.append('query', query);
    url.searchParams.append('locale', 'en-US');
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
  
      if (!data.data || !Array.isArray(data.data)) {
        console.error('Unexpected API response format');
        return [];
      }
  
      return data.data.map(item => {
        // Extract all possible identifiers
        const skyId = item.relevantFlightParams?.skyId || item.skyId || '';
        const entityId = item.entityId || '';
        const code = skyId || item.relevantFlightParams?.iataCode || ''; // Fallback to IATA code if available
        const name = item.presentation?.title || item.relevantFlightParams?.localizedName || '';
        const city = item.relevantFlightParams?.localizedName || 
                    item.presentation?.suggestionTitle || 
                    (name.includes(',') ? name.split(',')[0] : name); // Fallback to first part of name
  
        return {
          code: code || skyId || entityId, // Final fallback to other IDs
          name,
          city,
          skyId,
          entityId,
          rawData: item // Keep original for debugging
        };
      });
  
    } catch (error) {
      console.error('Error fetching airport suggestions:', error);
      return [];
    }
  };

    export const searchFlightsWebComplete = async (params) => {
    const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsWebComplete');
    
    // Required parameters from your curl example
    url.searchParams.append('originSkyId', params.originSkyId);
    url.searchParams.append('destinationSkyId', params.destinationSkyId);
    url.searchParams.append('originEntityId', params.originEntityId);
    url.searchParams.append('destinationEntityId', params.destinationEntityId);
    url.searchParams.append('date', params.date); // Format: YYYY-MM-DD
    url.searchParams.append('adults', params.adults || 1);
    url.searchParams.append('cabinClass', params.cabinClass || 'economy');
    url.searchParams.append('sortBy', params.sortBy || 'best');
    url.searchParams.append('currency', params.currency || 'USD');
    url.searchParams.append('market', params.market || 'en-US');
    url.searchParams.append('countryCode', params.countryCode || 'US');
  
    // Optional parameters
    if (params.returnDate) {
      url.searchParams.append('returnDate', params.returnDate);
    }
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    };
  
    const response = await fetch(url, options);
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Flight search failed');
    }
  
    return data;
  };