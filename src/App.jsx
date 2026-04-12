import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import UsagePage from './components/UsagePage';
import './App.css';

const defaultLoadNames = ['Load 1', 'Load 2', 'Load 3'];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loadNames, setLoadNames] = useState(() => {
    try {
      const stored = localStorage.getItem('loadNames');
      return stored ? JSON.parse(stored) : defaultLoadNames;
    } catch {
      return defaultLoadNames;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('loadNames', JSON.stringify(loadNames));
    } catch {
      // Ignore storage errors
    }
  }, [loadNames]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleChangeLoadName = (index, value) => {
    setLoadNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="app" id="app-root">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage loadNames={loadNames} onChangeLoadName={handleChangeLoadName} />
        )}
        {currentPage === 'usage' && <UsagePage loadNames={loadNames} />}
      </main>
    </div>
  );
}

export default App;
