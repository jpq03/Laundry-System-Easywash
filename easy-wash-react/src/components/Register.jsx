import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Loader2, User, Mail, MapPin, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert extra profile info into our custom 'users' table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          { 
            full_name: formData.fullName, 
            email: formData.email,
            address: formData.city // Using city as a simple address for now
          }
        ]);

      if (profileError) {
        console.error('Profile Creation Error:', profileError.message);
        // We don't throw here to avoid blocking the user if they are already authed
      }

      toast.success('Registration successful! Please check your email for confirmation.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
            <label htmlFor="fullname"><User size={16} /> Full Name</label>
            <input 
              type="text" 
              id="fullname" 
              placeholder="Joseph Quisido" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email"><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="city"><MapPin size={16} /> Service Area</label>
            <select 
              id="city" 
              required 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            >
              <option value="" disabled>Select Your City</option>
              <option value="Mandaue City">Mandaue City</option>
              <option value="Lapu-Lapu City">Lapu-Lapu City</option>
              <option value="Cebu City">Cebu City</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password"><Lock size={16} /> Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', border: 'none', padding: '1rem', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
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
