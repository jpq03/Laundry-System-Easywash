import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, History, Settings, LogOut, ShieldCheck } from 'lucide-react';
import OrderTimeline from './components/OrderTimeline';
import NewOrderModal from './components/NewOrderModal';
import OrderHistory from './components/OrderHistory';
import UserSettings from './components/UserSettings';
import Login from './components/Login';
import Register from './components/Register';
import { Toaster } from 'sonner';
import './index.css';

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    {children}
  </div>
);

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
          <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)' }}><LayoutDashboard /></div>
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

const Sidebar = () => (
  <aside className="sidebar">
    <div className="logo" style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
      <img src="/logo.png" alt="Easy Wash Logo" style={{ width: '120px', height: 'auto', borderRadius: '12px' }} />
    </div>
    <div className="sidebar-menu">
      <NavLink to="/" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} /> Dashboard
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        <History size={20} /> Order History
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        <Settings size={20} /> Settings
      </NavLink>
      <NavLink to="/logout" className="menu-item" style={{ marginTop: 'auto', color: '#ef4444' }}>
        <LogOut size={20} /> Logout
      </NavLink>
    </div>
  </aside>
);

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
