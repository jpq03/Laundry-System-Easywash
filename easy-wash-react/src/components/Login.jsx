import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Easy Wash Logo" style={{ width: '150px', height: 'auto', borderRadius: '16px' }} />
        </Link>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Sign in to manage your laundry orders</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password"><Lock size={16} /> Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', border: 'none', padding: '1rem', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
