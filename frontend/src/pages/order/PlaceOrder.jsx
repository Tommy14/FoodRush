import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, CreditCard } from 'lucide-react';
import { placeOrder, initiatePaymentSession } from '../../services/orderService';
import { clearCart } from '../../store/slices/cartSlice';
import { useDispatch } from 'react-redux';

export default function PlaceOrder() {
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const restaurantId = cartItems[0]?.restaurantId;


  const handleConfirmOrder = async () => {
    try {
      // 1️⃣ Validate fields
      if (!name || !email || !address || !city || !postalCode || !contactNumber) {
        alert('Please fill in all required fields.');
        return;
      }
  
      if (cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
      }
  
      // 2️⃣ Prepare order data (for /orders endpoint)
      const orderPayload = {
        customerName: name,
        customerEmail: email,
        contactNumber: contactNumber,
        deliveryAddress: `${address}, ${city}, ${postalCode}`,
        paymentMethod: paymentMethod,
        restaurantId: restaurantId,
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totalAmount: totalAmount,
        status: 'pending'
      };
  
      // 3️⃣ Call BFF /orders to create the order
      const orderResponse = await placeOrder(orderPayload);
      const orderId = orderResponse?.data?._id || orderResponse?.order?._id;
  
      console.log('Order created:', orderId);
  
      // 4️⃣ Clear the cart after order is saved
      dispatch(clearCart());
  
      // 5️⃣ Prepare payment payload
      const paymentPayload = {
        orderId: orderId,
        email: email,
        amount: totalAmount,
        currency: 'LKR',
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.quantity
        }))
      };
  
      // 6️⃣ Call payment session endpoint
      const paymentResponse = await initiatePaymentSession(paymentPayload);
      const paymentUrl = paymentResponse?.session?.url;
  
      if (paymentUrl) {
        window.location.href = paymentUrl; // 🚀 Redirect to Stripe
      } else {
        alert('Failed to initiate payment session.');
      }
    } catch (error) {
      console.error('Order or payment error:', error);
      alert('Something went wrong. Please try again.');
    }
  };  

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pt-24"> {/* pt-24 fixes navbar overlap */}
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Place Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Summary */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-gray-700">
            <ShoppingCart className="w-6 h-6" />
            <span>Cart Summary</span>
          </div>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <div key={item.menuItemId} className="flex items-center gap-4 border-b pb-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-green-600">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-lg font-semibold mt-6">
                <span>Total:</span>
                <span className="text-green-700">Rs. {totalAmount}</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Delivery Details Sidebar */}
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6 h-fit">
          <div className="flex items-center gap-2 text-2xl font-bold text-gray-700">
            <Truck className="w-6 h-6" />
            <span>Delivery Details</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" /> Payment Method
              </label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border px-3 py-2 rounded-lg">
                <option value="card">Card</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
        <button
          onClick={() => navigate('/restaurants')}
          className="w-full md:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition"
        >
          Edit Cart & Order
        </button>
        <button
          onClick={() => {
            handleConfirmOrder();
            console.log('Confirm Order clicked');
          }}
          className="w-full md:w-1/2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
        >
          Confirm Order & Pay
        </button>
      </div>
    </div>
  );
}
