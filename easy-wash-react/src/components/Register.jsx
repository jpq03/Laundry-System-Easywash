import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Easy Wash Logo" style={{ width: '150px', height: 'auto', borderRadius: '16px' }} />
        </Link>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Experience premium laundry care today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input type="text" id="fullname" placeholder="Joseph Quisido" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="name@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="city">Service Area</label>
            <select id="city" required defaultValue="">
              <option value="" disabled>Select Your City</option>
              <option value="mandaue">Mandaue City</option>
              <option value="lapulapu">Lapu-Lapu City</option>
              <option value="cebu">Cebu City</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', padding: '1rem', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}>
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
