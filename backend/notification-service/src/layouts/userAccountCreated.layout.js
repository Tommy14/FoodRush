export default function userAccountCreatedLayout(data) {
    const { name, email, createdAt, role } = data;
  
    return `
      <div style="max-width:600px;margin:auto;padding:30px;border:1px solid #eee;border-radius:12px;font-family:Arial,sans-serif;background-color:#ffffff;">
        <h2 style="color:#1b5e20;">Welcome to FoodRush, ${name} 👋</h2>
        <p style="font-size:15px;color:#333;">Your account <strong>${email}</strong> was created successfully.</p>
  
        <p style="margin-top:16px;font-size:14px;color:#444;">
          You’ve joined us as a <strong>${role}</strong>. We're excited to have you on board!
        </p>
  
        <p style="margin-top:16px;font-size:14px;">
          You can now explore your dashboard, place orders, and enjoy delicious meals with just a few taps!
        </p>
  
        <div style="margin:30px 0;">
          <a href="https://foodrush.app/login" style="padding:10px 20px;background:#1b5e20;color:white;border-radius:6px;text-decoration:none;font-size:14px;">Sign In Now</a>
        </div>
  
        <p style="font-size:12px;color:#999;">
          ${createdAt ? `Account created on: ${createdAt}` : ''}
        </p>
  
        <hr style="margin:40px 0;border:none;border-top:1px solid #ddd;" />
  
        <p style="font-size:12px;color:#888;">
          If you didn’t create this account, please ignore this email or <a href="https://foodrush.app/support" style="color:#1b5e20;">contact support</a>.
        </p>
  
        <p style="text-align:center;margin-top:30px;font-size:12px;color:#aaa;">
          &copy; ${new Date().getFullYear()} FoodRush. We’re happy to have you 🍽️
        </p>
      </div>
    `;
  }
  