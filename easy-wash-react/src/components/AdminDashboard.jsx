import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Clock, Users, TrendingUp, MoreVertical, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState({ active: 0, completed: 0, revenue: 0, totalUsers: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch orders with joins
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_price,
          weight_kg,
          users (full_name, email),
          service_types (name)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Calculate stats
      const active = (ordersData || []).filter(o => o.status !== 'Completed').length;
      const completed = (ordersData || []).filter(o => o.status === 'Completed').length;
      const revenue = (ordersData || []).reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);

      setStats({ active, completed, revenue, totalUsers: (usersData || []).length });

    } catch (error) {
      toast.error('Error loading admin data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order #EW-${orderId.toString().padStart(4, '0')} → ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Update failed: ' + error.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'washing': return 'status-washing';
      case 'pending': return 'status-pending';
      case 'ready': return 'status-ready';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--primary)' }}>
        <Loader2 className="animate-spin" size={28} />
        <span style={{ fontSize: '1.1rem' }}>Loading Admin Panel...</span>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Admin Command Center</h1>
          <p>Managing {stats.active} active orders • {stats.totalUsers} registered users</p>
        </div>
        <button className="btn-primary" onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={18} /> Refresh
        </button>
      </header>

      {/* Stats */}
      <div className="status-grid">
        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--primary)' }}>
            <Clock size={24} />
          </div>
          <div className="card-info">
            <h3>Active Orders</h3>
            <p>{stats.active}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}>
            <CheckCircle size={24} />
          </div>
          <div className="card-info">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
            <TrendingUp size={24} />
          </div>
          <div className="card-info">
            <h3>Revenue</h3>
            <p>₱{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="status-card">
          <div className="icon-box" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc' }}>
            <Users size={24} />
          </div>
          <div className="card-info">
            <h3>Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs" style={{ borderColor: 'rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
        <span className={`tab-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          All Orders ({orders.length})
        </span>
        <span className={`tab-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users ({users.length})
        </span>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="order-table">
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Order</th>
                <th style={{ width: '22%' }}>Customer</th>
                <th style={{ width: '16%' }}>Service</th>
                <th style={{ width: '20%' }}>Status</th>
                <th style={{ width: '15%' }}>Total</th>
                <th style={{ width: '12%' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>#EW-{order.id.toString().padStart(4, '0')}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.users?.full_name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.users?.email}</div>
                  </td>
                  <td>{order.service_types?.name || '—'}</td>
                  <td>
                    <select
                      className={`status-badge ${getStatusClass(order.status)}`}
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{ border: 'none', cursor: 'pointer', outline: 'none', fontSize: '0.8rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Picking Up">Picking Up</option>
                      <option value="Washing">Washing</option>
                      <option value="Drying">Drying</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td style={{ fontWeight: 700 }}>₱{order.total_price || '0.00'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No orders in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="order-table">
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '10%' }}>ID</th>
                <th style={{ width: '25%' }}>Full Name</th>
                <th style={{ width: '30%' }}>Email</th>
                <th style={{ width: '20%' }}>Address</th>
                <th style={{ width: '15%' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700 }}>#{user.id}</td>
                  <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                  <td>{user.address || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
