import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // ✅ this is the correct import

const ProfileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const decoded = jwt_decode(token);
      const role = decoded.role;
      console.log(role);
      switch (role) {
        case 'customer':
          navigate('/my-orders');
          break;
        case 'delivery_person':
          navigate('/delivery-panel');
          break;
        case 'restaurant_admin':
          navigate('/manage-restaurants');
          break;
        case 'admin':
          navigate('/restaurant-status');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/auth');
    }
  }, [navigate]);

  return null;
};

export default ProfileRedirect;
