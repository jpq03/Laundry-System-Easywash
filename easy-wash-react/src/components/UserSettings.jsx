import React, { useState } from 'react';
import { User, MapPin, Settings as SettingsIcon, Shield, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <main className="main-content">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account preferences and delivery locations.</p>
      </header>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`tab-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="settings-card">
        {activeTab === 'profile' && (
          <div className="settings-section active">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>JQ</div>
              <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)', border: '2px solid var(--primary)', boxShadow: 'none' }}>Change Photo</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success('Profile Updated!', {
                description: 'Your account settings have been saved.',
              });
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Joseph Quisido" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="joseph@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" defaultValue="09123456789" />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', border: 'none', cursor: 'pointer' }}>Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="settings-section active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 800 }}>Saved Locations</h3>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>+ Add New</button>
            </div>
            <div className="address-item primary">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 800 }}>Home</span>
                  <span className="status-badge status-completed" style={{ fontSize: '0.7rem' }}>Default</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>123 Blue St, Banilad, Mandaue City</p>
              </div>
              <button className="btn-icon"><Edit2 size={18} /></button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="settings-section active">
            <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>Laundry Preferences</h3>
            <div className="toggle-group">
              <div>
                <h4 style={{ fontWeight: 700 }}>Detergent (Scented)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Always use our premium fresh breeze scent.</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section active">
            <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>Change Password</h3>
            <form style={{ maxWidth: '400px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', border: 'none', cursor: 'pointer' }}>Update Password</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserSettings;
