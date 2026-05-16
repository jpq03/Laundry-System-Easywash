import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, History, Settings, LogOut, ShieldCheck, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTimeline from './components/OrderTimeline';
import NewOrderModal from './components/NewOrderModal';
import OrderHistory from './components/OrderHistory';
import UserSettings from './components/UserSettings';
import Login from './components/Login';
import Register from './components/Register';
import { Toaster } from 'sonner';
import './index.css';

const DashboardLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="logo" style={{ fontSize: '1.2rem' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '80px' }} />
        </div>
        <div style={{ width: '24px' }}></div> {/* Spacer */}
      </header>

      {/* Sidebar with Mobile Drawer Logic */}
      <AnimatePresence>
        {(isMenuOpen || window.innerWidth > 1024) && (
          <motion.aside 
            className={`sidebar ${isMenuOpen ? 'mobile-open' : ''}`}
            initial={{ x: window.innerWidth <= 1024 ? -300 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="sidebar-header">
              <div className="logo">
                <img src="/logo.png" alt="Easy Wash Logo" style={{ width: '120px' }} />
              </div>
              <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="sidebar-menu">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>
              <NavLink to="/history" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                <History size={20} /> Order History
              </NavLink>
              <NavLink to="/settings" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                <Settings size={20} /> Settings
              </NavLink>
              <NavLink to="/logout" className="menu-item" style={{ marginTop: 'auto', color: '#94a3b8' }}>
                <LogOut size={20} /> Logout
              </NavLink>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="main-content">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome back, Joseph!</h1>
          <p style={{ color: 'var(--text-muted)' }}>You have 1 active laundry order.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ border: 'none', cursor: 'pointer' }}>
          + New Order
        </button>
      </header>

      <div className="status-grid">
        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--primary)' }}><LayoutDashboard /></div>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active Orders</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>1</p>
          </div>
        </div>
      </div>

      <OrderTimeline />

      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
};

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/history" element={<DashboardLayout><OrderHistory /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><UserSettings /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
