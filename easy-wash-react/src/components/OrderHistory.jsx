import React from 'react';
import { Search, Filter, Calendar, Download, RotateCcw } from 'lucide-react';

const OrderHistory = () => {
  const orders = [
    { id: '#EW-2405', date: 'May 15, 2026', service: 'Wash & Fold', status: 'Washing', total: '₱192.50', statusClass: 'status-washing' },
    { id: '#EW-2398', date: 'May 10, 2026', service: 'Wash & Iron', status: 'Completed', total: '₱165.00', statusClass: 'status-completed' },
    { id: '#EW-2382', date: 'May 03, 2026', service: 'Dry Cleaning', status: 'Completed', total: '₱480.00', statusClass: 'status-completed' },
  ];

  return (
    <main className="main-content">
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
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Service</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 700 }}>{order.id}</td>
                <td style={{ color: 'var(--text-muted)' }}>{order.date}</td>
                <td>{order.service}</td>
                <td><span className={`status-badge ${order.statusClass}`}>{order.status}</span></td>
                <td style={{ fontWeight: 700 }}>{order.total}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.status === 'Completed' && (
                    <button className="btn-reorder">Re-order</button>
                  )}
                  <button className="btn-icon"><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default OrderHistory;
