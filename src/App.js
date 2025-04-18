import { useState } from 'react';
import { FlightsProvider } from './context/FlightsContext';
import Header from './components/Header';
import FlightSearch from './components/FlightSearch';
import SearchResults from './components/SearchResults';

function App() {
  const [searchPerformed, setSearchPerformed] = useState(false);

  return (
    <FlightsProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <FlightSearch onSearch={() => setSearchPerformed(true)} />
          {searchPerformed && <SearchResults />}
        </div>
      </div>
    </FlightsProvider>
  );
}

export default App;