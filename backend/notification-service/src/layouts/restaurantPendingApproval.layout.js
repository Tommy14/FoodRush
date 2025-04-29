export default function restaurantPendingApprovalLayout(data) {
    const { restaurantName, restaurantId } = data;
  
    return `
      <div style="max-width:600px;margin:auto;border:1px solid #ddd;border-radius:12px;overflow:hidden;font-family:Arial,sans-serif;background-color:#fff;">
        <div style="background:#e8f5e9;padding:30px 20px;">
          <h2 style="margin:0;font-size:22px;color:#1b5e20;">New Restaurant Awaiting Approval</h2>
          <p style="margin:8px 0;color:#333;">A new restaurant has been added and is awaiting your review and approval.</p>
        </div>
  
        <div style="padding:24px;">
          <h4 style="margin:0 0 6px;color:#1b5e20;">Restaurant Name</h4>
          <p style="margin:0 0 20px;">${restaurantName}</p>
  
          <h4 style="margin:0 0 6px;color:#1b5e20;">Restaurant ID</h4>
          <p style="margin:0 0 20px;">${restaurantId}</p>
  
          <p style="margin-top:20px;color:#333;">The restaurant is currently marked as <strong style="color:#1b5e20;">Pending Approval</strong>.</p>
          <a href="#" style="display:inline-block;margin-top:12px;background:#1b5e20;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;font-size:14px;">
            Review in Admin Dashboard
          </a>
        </div>
  
        <div style="background:#f1f1f1;padding:14px;text-align:center;font-size:12px;color:#777;">
          &copy; ${new Date().getFullYear()} FoodRush. Making cravings go away 🍲
        </div>
      </div>
    `;
  }
  