import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, History, Settings, LogOut, ShieldCheck, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTimeline from './components/OrderTimeline';
import NewOrderModal from './components/NewOrderModal';
import OrderHistory from './components/OrderHistory';
import UserSettings from './components/UserSettings';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import { Toaster, toast } from 'sonner';
import './index.css';

const DashboardLayout = ({ children, onLogout, user, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="logo" style={{ fontSize: '1.2rem' }}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <div style={{ width: '24px' }}></div> {/* Spacer */}
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/logo.png" alt="Easy Wash Logo" />
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
          
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={20} /> Admin Panel
            </NavLink>
          )}

          <button onClick={onLogout} className="menu-item" style={{ marginTop: 'auto', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

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


const Dashboard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState(0);

  const fetchStats = async () => {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'Completed');
    
    if (!error) setActiveOrders(count || 0);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Welcome back, {user?.user_metadata?.full_name || 'Friend'}!</h1>
          <p>You have {activeOrders} active laundry order{activeOrders !== 1 ? 's' : ''}.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + New Order
        </button>
      </header>

      <div className="status-grid">
        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--primary)' }}>
            <LayoutDashboard size={24} />
          </div>
          <div className="card-info">
            <h3>Active Orders</h3>
            <p>{activeOrders}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="card-info">
            <h3>Completed</h3>
            <p>12</p>
          </div>
        </div>

        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="card-info">
            <h3>Points</h3>
            <p>450</p>
          </div>
        </div>
      </div>

      <OrderTimeline />

      <NewOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onOrderCreated={fetchStats}
      />
    </main>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.email);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', email)
      .single();
    
    if (!error && data) {
      setIsAdmin(data.is_admin);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success('Logged out successfully');
  };

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!session ? <Register /> : <Navigate to="/" />} />
        
        <Route 
          path="/" 
          element={session ? <DashboardLayout user={session.user} onLogout={handleLogout} isAdmin={isAdmin}><Dashboard user={session.user} /></DashboardLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/history" 
          element={session ? <DashboardLayout user={session.user} onLogout={handleLogout} isAdmin={isAdmin}><OrderHistory /></DashboardLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={session ? <DashboardLayout user={session.user} onLogout={handleLogout} isAdmin={isAdmin}><UserSettings /></DashboardLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={session && isAdmin ? <DashboardLayout user={session.user} onLogout={handleLogout} isAdmin={isAdmin}><AdminDashboard /></DashboardLayout> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
