export default function orderPlacedLayout(data) {
    const {
      customerName,
      restaurantName,
      orderId,
      total,
      paymentMethod,
      orderDateTime,
      deliveryAddress
    } = data;
  
    return `
    <div style="max-width:600px;margin:auto;border:1px solid #ddd;border-radius:12px;overflow:hidden;font-family:Arial,sans-serif;background-color:#fff;">
      <div style="background:#e8f5e9;padding:30px 20px;">
        <h2 style="margin:0;font-size:22px;color:#1b5e20;">Thanks for your order, ${customerName}!</h2>
        <p style="margin:8px 0;color:#333;">We’ve received your order from <strong>${restaurantName}</strong>.</p>
        <a href="#" style="display:inline-block;margin-top:12px;background:#1b5e20;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;font-size:14px;">Track your order</a>
      </div>
  
      <div style="padding:24px;">
        <h3 style="margin:0 0 10px;">Total</h3>
        <p style="font-size:22px;font-weight:bold;margin:0 0 20px;">LKR ${total}</p>
  
        <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">
  
        <h4 style="margin:0 0 6px;">Payment</h4>
        <p style="margin:0 0 20px;">${paymentMethod} — ${orderDateTime}</p>
  
        <h4 style="margin:0 0 6px;">Delivery Address</h4>
        <p style="margin:0 0 20px;">${deliveryAddress}</p>
  
        <h4 style="margin:0 0 6px;">Order ID</h4>
        <p style="margin:0 0 20px;">#${orderId}</p>
  
        <div style="margin-top:40px;text-align:center;">
          <a href="#" style="margin:0 10px;color:#1b5e20;text-decoration:none;">Contact Support</a> |
          <a href="#" style="margin:0 10px;color:#1b5e20;text-decoration:none;">My Orders</a>
        </div>
      </div>
  
      <div style="background:#f1f1f1;padding:14px;text-align:center;font-size:12px;color:#777;">
        &copy; ${new Date().getFullYear()} FoodRush. Making cravings go away 🍲
      </div>
    </div>
    `;
  }
  