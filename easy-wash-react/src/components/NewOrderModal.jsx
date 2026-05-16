import React, { useState } from 'react';
import { X, WashingMachine, Shirt } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';

const NewOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    service_id: 1, // Default: Wash & Fold
    pickup_date: '',
    pickup_time: '9:00 AM - 11:00 AM'
  });

  if (!isOpen) return null;

  const handleServiceSelect = (id) => {
    setFormData({ ...formData, service_id: id });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          { 
            user_id: 1, // Hardcoded for now until Auth is implemented
            service_type_id: formData.service_id,
            pickup_date: `${formData.pickup_date} ${formData.pickup_time.split(' ')[0]}`,
            status: 'Pending',
            weight_kg: 0, // Will be updated by staff later
            total_price: 0 // Will be calculated by staff later
          }
        ])
        .select();

      if (error) throw error;

      toast.success('Order Placed Successfully!');
      if (onOrderCreated) onOrderCreated(); // Refresh dashboard stats
      setStep(1);
      onClose();
    } catch (error) {
      toast.error('Error placing order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="modal-backdrop" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}><X /></button>
        
        <div className="progress-dots">
          {[1, 2].map(i => (
            <div key={i} className={`dot ${step === i ? 'active' : ''}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="wizard-step active">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center' }}>Choose Service</h2>
            <div className="service-grid" style={{ marginTop: '1.5rem' }}>
              <div 
                className={`service-card ${formData.service_id === 1 ? 'selected' : ''}`} 
                onClick={() => handleServiceSelect(1)}
              >
                <WashingMachine size={40} color="var(--primary)" />
                <h3 style={{ marginTop: '1rem' }}>Wash & Fold</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₱35.00 / kg</p>
              </div>
              <div 
                className={`service-card ${formData.service_id === 3 ? 'selected' : ''}`} 
                onClick={() => handleServiceSelect(3)}
              >
                <Shirt size={40} color="var(--primary)" />
                <h3 style={{ marginTop: '1rem' }}>Dry Clean</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₱120.00 / pc</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step active">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center' }}>Schedule Pickup</h2>
            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Select Date</label>
              <input 
                type="date" 
                value={formData.pickup_date}
                onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Select Time Window</label>
              <select 
                value={formData.pickup_time}
                onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
              >
                <option>08:00 AM - 10:00 AM</option>
                <option>10:00 AM - 12:00 PM</option>
                <option>02:00 PM - 04:00 PM</option>
                <option>04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>
        )}

        <div className="wizard-footer">
          <button 
            className="btn-primary" 
            style={{ background: '#f1f5f9', color: 'var(--text-muted)', visibility: step === 1 ? 'hidden' : 'visible' }}
            onClick={prevStep}
            disabled={loading}
          >Back</button>
          <button 
            className="btn-primary" 
            disabled={loading || (step === 2 && !formData.pickup_date)}
            onClick={() => {
              if (step === 2) {
                handleSubmit();
              } else {
                nextStep();
              }
            }}
          >
            {loading ? 'Processing...' : (step === 2 ? 'Confirm Order' : 'Next Step')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
