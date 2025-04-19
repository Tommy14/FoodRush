export default function orderPlacedLayout(data) {
  const {
    customerName,
    restaurantName,
    total,
    paymentMethod,
    deliveryAddress,
    deliveryPerson,
    orderDateTime,
    orderId,
  } = data;

  return `
    <div style="max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;font-family:Arial,sans-serif;">
      <div style="background:#e8f5e9;padding:30px;text-align:left;">
        <h2 style="margin:0;font-size:22px;">Thanks for ordering, ${customerName} 👋</h2>
        <p style="margin-top:8px;font-size:15px;">Here's your receipt for <strong>${restaurantName}</strong>.</p>
        <a href="#" style="display:inline-block;margin-top:12px;background:#1f8a43;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;font-size:14px;">Rate Order</a>
      </div>
  
      <div style="padding:24px;">
        <h3 style="margin:0 0 10px;">Total</h3>
        <p style="font-size:24px;font-weight:bold;margin:0 0 20px;">LKR ${total}</p>
  
        <h4 style="margin:0 0 6px;font-size:16px;">Payment</h4>
        <p style="margin:0 0 20px;">${paymentMethod} — ${orderDateTime}</p>
  
        <h4 style="margin:0 0 6px;">Delivered to</h4>
        <p style="margin:0 0 20px;">${deliveryAddress}</p>
  
        <h4 style="margin:0 0 6px;">Delivered by</h4>
        <p style="margin:0 0 20px;">
          ${Array.isArray(deliveryPerson)
            ? deliveryPerson.map(dp => `${dp.name}`).join('<br>')
            : 'N/A'}
        </p>
  
        <div style="text-align:center;margin-top:30px;">
          <a href="#" style="margin:0 10px;color:#1f8a43;text-decoration:none;">Contact Support</a> |
          <a href="#" style="margin:0 10px;color:#1f8a43;text-decoration:none;">My Orders</a>
        </div>
      </div>
  
      <div style="background:#f5f5f5;padding:14px;text-align:center;font-size:12px;color:#666;">
        &copy; ${new Date().getFullYear()} FoodRush. All rights reserved.
      </div>
    </div>
    `;
}
