const Header = () => {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L1 9L5 11.18V21L12 18L19 21V11.18L23 9L12 2Z" fill="currentColor" />
                <path d="M12 2V18V21L19 18V11.18L23 9L12 2Z" fill="currentColor" fillOpacity="0.5" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-800">FlightFinder</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Explore</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Deals</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Trips</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Help</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;