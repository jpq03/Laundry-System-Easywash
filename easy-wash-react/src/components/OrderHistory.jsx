import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, Download, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_price,
          service_types (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'washing': return 'status-washing';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  return (
    <div className="history-page">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order History</h1>
        <p style={{ color: 'var(--text-muted)' }}>View and manage your past laundry services.</p>
      </header>

      <div className="history-controls">
        <div className="history-search">
          <Search size={18} />
          <input type="text" placeholder="Search by Order ID or Service..." />
        </div>
        <div className="filter-group">
          <button className="btn-icon"><Filter size={18} /></button>
          <button className="btn-icon"><Calendar size={18} /></button>
        </div>
      </div>

      <div className="order-table">
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--primary)' }}>
            <Loader2 className="animate-spin" />
            <span>Loading your history...</span>
          </div>
        ) : (
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Order ID</th>
                <th style={{ width: '18%' }}>Date</th>
                <th style={{ width: '18%' }}>Service</th>
                <th style={{ width: '16%' }}>Status</th>
                <th style={{ width: '15%' }}>Total</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>#EW-{order.id.toString().padStart(4, '0')}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>{order.service_types?.name || 'Standard Wash'}</td>
                  <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                  <td style={{ fontWeight: 700 }}>₱{order.total_price || '0.00'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-icon"><Download size={16} /></button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div style={{ 
                      padding: '5rem 2rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '1.5rem',
                      color: 'var(--text-muted)',
                      opacity: 0.8
                    }}>
                      <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        background: 'rgba(45, 212, 191, 0.05)', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                      }}>
                        <ShoppingBag size={48} strokeWidth={1.5} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>No Orders Yet</h3>
                        <p>When you place your first order, it will appear here!</p>
                      </div>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="btn-primary" 
                        style={{ padding: '0.75rem 2rem', marginTop: '1rem' }}
                      >
                        Start Your First Order
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
