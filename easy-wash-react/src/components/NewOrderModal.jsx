import React, { useState } from 'react';
import { X, WashingMachine, Shirt, Wind, Star, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

const NewOrderModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);

  if (!isOpen) return null;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="modal-backdrop" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}><X /></button>
        
        <div className="progress-dots">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`dot ${step === i ? 'active' : ''}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="wizard-step active">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center' }}>Choose Service</h2>
            <div className="service-grid">
              <div className={`service-card ${selectedService === 'Wash' ? 'selected' : ''}`} onClick={() => setSelectedService('Wash')}>
                <WashingMachine size={40} color="var(--primary)" />
                <h3 style={{ marginTop: '1rem' }}>Wash & Fold</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₱25 / kg</p>
              </div>
              <div className={`service-card ${selectedService === 'Dry' ? 'selected' : ''}`} onClick={() => setSelectedService('Dry')}>
                <Wind size={40} color="var(--primary)" />
                <h3 style={{ marginTop: '1rem' }}>Dry Clean</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₱50 / kg</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step active">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center' }}>Schedule Pickup</h2>
            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Select Date</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Select Time</label>
              <select>
                <option>9:00 AM - 11:00 AM</option>
                <option>1:00 PM - 3:00 PM</option>
              </select>
            </div>
          </div>
        )}

        <div className="wizard-footer">
          <button 
            className="btn-primary" 
            style={{ background: '#f1f5f9', color: 'var(--text-muted)', visibility: step === 1 ? 'hidden' : 'visible' }}
            onClick={prevStep}
          >Back</button>
          <button 
            className="btn-primary" 
            onClick={() => {
              if (step === 2) {
                toast.success('Order Placed Successfully!', {
                  description: 'Our driver will pick up your laundry at the scheduled time.',
                });
                setStep(1);
                onClose();
              } else {
                nextStep();
              }
            }}
          >
            {step === 2 ? 'Confirm Order' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
