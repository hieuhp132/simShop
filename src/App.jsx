import React, { useState, useEffect } from 'react';
import SideBar from './components/SideBar';
import MainContent from './components/MainContent';
import TopNav from './components/TopNav';
import TabNav from './components/TabNav';
import './App.css';
import Footer from './components/Footer';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <div className="app-wrapper">
      <TopNav activePage={activePage} setActivePage={setActivePage} theme={theme} setTheme={setTheme} />
      <TabNav activePage={activePage} setActivePage={setActivePage} />

      <div className="main-layout">
        <SideBar />
        <MainContent activePage={activePage} />
      </div>
      <Footer/>
    </div>
  );
}

export default App;
