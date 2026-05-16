import { Check, WashingMachine, ShieldCheck, Truck } from 'lucide-react';

const OrderTimeline = () => {
  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Order Status: #EW-2405</h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Estimated Delivery: Today, 5:00 PM</span>
      </div>
      <div className="timeline">
        <div className="timeline-progress" style={{ width: '50%' }}></div>
        
        <div className="step completed">
          <div className="step-icon"><Check size={20} strokeWidth={3} /></div>
          <span className="step-label">Order Placed</span>
        </div>

        <div className="step completed">
          <div className="step-icon"><WashingMachine size={20} /></div>
          <span className="step-label">Picked Up</span>
        </div>

        <div className="step active">
          <div className="step-icon"><ShieldCheck size={20} /></div>
          <span className="step-label">Washing</span>
        </div>

        <div className="step">
          <div className="step-icon" style={{ transform: 'rotate(-10deg)' }}>$</div>
          <span className="step-label">Drying</span>
        </div>

        <div className="step">
          <div className="step-icon"><Truck size={20} /></div>
          <span className="step-label">Out for Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
