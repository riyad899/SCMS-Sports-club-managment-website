import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  Clock,
  Star
} from 'lucide-react';
import Swal from 'sweetalert2';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.selectedPlan;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no plan is selected
  useEffect(() => {
    if (!selectedPlan) {
      navigate('/');
    }
  }, [selectedPlan, navigate]);

  if (!selectedPlan) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length <= 19) {
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length <= 5) {
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    // Format CVV (3-4 digits only)
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Swal.fire({
        title: 'Payment Successful!',
        html: `
          <div style="text-align: center;">
            <div style="color: #10B981; font-size: 48px; margin-bottom: 16px;">✓</div>
            <h3 style="color: #162E50; margin-bottom: 8px;">Welcome to ${selectedPlan.title} Membership!</h3>
            <p style="color: #6B7280; margin-bottom: 16px;">Your payment of <strong>${selectedPlan.price}${selectedPlan.period}</strong> has been processed successfully.</p>
            <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <p style="color: #374151; font-size: 14px; margin: 0;">A confirmation email will be sent to your registered email address with your membership details.</p>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Continue to Dashboard',
        confirmButtonColor: '#162E50',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard');
        }
      });
    }, 3000);
  };

  const planFeatures = selectedPlan.features || [];
  const planPrice = parseFloat(selectedPlan.price.replace('$', ''));
  const taxAmount = planPrice * 0.1; // 10% tax
  const totalAmount = planPrice + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#162E50] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-[#162E50] mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure checkout for your membership plan</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-[#162E50] bg-[#162E50]/5 text-[#162E50]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === 'paypal' 
                        ? 'border-[#162E50] bg-[#162E50]/5 text-[#162E50]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162E50] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162E50] focus:border-transparent"
                      placeholder="+880 1234 567890"
                    />
                  </div>
                </div>
              </div>

              {/* Card Information */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Card Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162E50] focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162E50] focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162E50] focus:border-transparent"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162E50] focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-[#162E50] text-white hover:bg-[#1c3a66] shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Payment - ${totalAmount.toFixed(2)}
                  </>
                )}
              </motion.button>
            </form>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                Your payment information is encrypted and secure
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-[#162E50] mb-6">Order Summary</h2>
            
            {/* Plan Details */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#162E50]">{selectedPlan.title} Membership</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#162E50]">{selectedPlan.price}</div>
                  <div className="text-sm text-gray-500">{selectedPlan.period}</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
              
              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Included Features:
                </h4>
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Membership ({selectedPlan.period})</span>
                <span>${planPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-[#162E50]">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                What happens next?
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Instant access to your membership benefits</li>
                <li>• Welcome email with login credentials</li>
                <li>• Access to member dashboard</li>
                <li>• Book courts and facilities immediately</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
