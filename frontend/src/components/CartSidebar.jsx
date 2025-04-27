import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { useNavigate } from "react-router-dom";

export default function CartSidebar({ isOpen, onClose }) {
  const { items: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">🛒 Your Cart</h2>
        <button onClick={() => onClose(false)} className="text-gray-600 hover:text-gray-800 text-4xl">&times;</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="p-4 text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col h-[calc(100%-120px)] justify-between">
          <div className="overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.menuItemId} className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Rs. {item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(updateQuantity({ menuItemId: item.menuItemId, quantity: parseInt(e.target.value) }))
                    }
                    className="w-12 text-center border rounded"
                  />
                  <button onClick={() => dispatch(removeFromCart(item.menuItemId))} className="text-red-500 hover:text-red-700">&times;</button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-green-600">Rs. {totalAmount}</span>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/auth");
                } else {
                  navigate("/place-order"); 
                };
                onClose();
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
