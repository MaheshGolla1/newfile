import React, { useState } from 'react';

const Payment = ({ appointment, onPaymentComplete, onClose }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    amount: appointment?.amount || 100
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    if (!paymentData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Use format MM/YY';
    }

    if (!paymentData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const payment = {
        id: Date.now().toString(),
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        serviceId: 'service_001',
        paymentStatus: 'completed',
        paymentDate: new Date().toISOString(),
        transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: paymentData.amount
      };

      // Save payment to localStorage
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      payments.push(payment);
      localStorage.setItem('payments', JSON.stringify(payments));

      setIsProcessing(false);
      onPaymentComplete(payment);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h3>Payment Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="payment-content">
          {appointment && (
            <div className="appointment-summary">
              <h4>Appointment Summary</h4>
              <div className="summary-item">
                <span>Patient:</span>
                <span>{appointment.patientName}</span>
              </div>
              <div className="summary-item">
                <span>Doctor:</span>
                <span>Dr. {appointment.doctorName}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Time:</span>
                <span>{appointment.time}</span>
              </div>
              <div className="summary-item total">
                <span>Amount:</span>
                <span>${paymentData.amount}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  cardNumber: formatCardNumber(e.target.value)
                }))}
                placeholder="1234 5678 9012 3456"
                className={`form-control-modern ${errors.cardNumber ? 'is-invalid' : ''}`}
                maxLength="19"
              />
              {errors.cardNumber && (
                <div className="invalid-feedback">
                  {errors.cardNumber}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Card Holder Name *</label>
              <input
                type="text"
                name="cardHolder"
                value={paymentData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`form-control-modern ${errors.cardHolder ? 'is-invalid' : ''}`}
              />
              {errors.cardHolder && (
                <div className="invalid-feedback">
                  {errors.cardHolder}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData(prev => ({
                    ...prev,
                    expiryDate: formatExpiryDate(e.target.value)
                  }))}
                  placeholder="MM/YY"
                  className={`form-control-modern ${errors.expiryDate ? 'is-invalid' : ''}`}
                  maxLength="5"
                />
                {errors.expiryDate && (
                  <div className="invalid-feedback">
                    {errors.expiryDate}
                  </div>
                )}
              </div>

              <div className="form-group col-md-6">
                <label className="form-label">CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={`form-control-modern ${errors.cvv ? 'is-invalid' : ''}`}
                  maxLength="3"
                />
                {errors.cvv && (
                  <div className="invalid-feedback">
                    {errors.cvv}
                  </div>
                )}
              </div>
            </div>

            <div className="payment-actions">
              <button 
                type="button" 
                className="btn-modern btn-cancel"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-modern btn-pay"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${paymentData.amount}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .payment-modal {
          background: white;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .payment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .payment-header h3 {
          margin: 0;
          color: #1e293b;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
          padding: 0;
          line-height: 1;
        }

        .modal-close:hover {
          color: #1e293b;
        }

        .payment-content {
          padding: 2rem;
        }

        .appointment-summary {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .appointment-summary h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-weight: 600;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .summary-item.total {
          border-top: 1px solid #e2e8f0;
          padding-top: 0.5rem;
          margin-top: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .col-md-6 {
          flex: 1;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-control-modern {
          width: 100%;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          background: #ffffff;
          font-size: 1rem;
        }

        .form-control-modern:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          outline: none;
        }

        .form-control-modern.is-invalid {
          border-color: #fa709a;
        }

        .invalid-feedback {
          color: #fa709a;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .payment-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-modern {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #e2e8f0;
          color: #1e293b;
        }

        .btn-pay {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-pay:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-modern:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 576px) {
          .payment-modal {
            margin: 1rem;
          }

          .payment-content {
            padding: 1.5rem;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .payment-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
