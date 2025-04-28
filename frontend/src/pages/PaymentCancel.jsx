import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cancel } from '@mui/icons-material';

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/restaurants');  // Redirect after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-white px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-sm">
        <Cancel className="text-red-500" sx={{ fontSize: 80 }} />
        <h2 className="text-2xl font-bold mt-4 text-gray-800">Payment Cancelled</h2>
        <p className="text-gray-600 mt-2">Your transaction was not completed.</p>

        {/* Loader dots */}
        <div className="flex justify-center mt-6">
          <span className="loader-dot animate-bounce delay-0"></span>
          <span className="loader-dot animate-bounce delay-150"></span>
          <span className="loader-dot animate-bounce delay-300"></span>
        </div>
        <p className="text-sm text-gray-400 mt-4">Redirecting to restaurants...</p>
      </div>

      {/* Tailwind Loader Animation */}
      <style>{`
        .loader-dot {
          width: 10px;
          height: 10px;
          margin: 0 5px;
          background-color: #f44336;
          border-radius: 50%;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
