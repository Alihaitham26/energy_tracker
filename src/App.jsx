import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import UsagePage from './components/UsagePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app" id="app-root">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'usage' && <UsagePage />}
      </main>
    </div>
  );
}

export default App;
