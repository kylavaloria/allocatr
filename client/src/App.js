import React from 'react';
import OffBalanceResources from './components/resources/OffBalanceResources';
import UpcomingAvailability from './components/resources/UpcomingAvailability';
import Resources from './components/resources/Resources';
import Header from './components/layout/Header';

function App() {
  return (
    <>
    <Header/>
      <div className="min-h-screen bg-primary-lighter p-8 font-sans">
        <div className="max-w-7xl mx-auto">

          {/* === Top Row: Two Columns === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* Column 1 */}
            <OffBalanceResources />

            {/* Column 2 */}
            <UpcomingAvailability />

          </div>

          {/* === Bottom Row: Full Width Table === */}
          <div className="bg-white rounded-2xl">
            <Resources />
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
