import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

export default function SessionManager({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expired, setExpired] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");

      if (token && isAuthenticated) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            setExpired(true); // Show snackbar
            clearInterval(interval); // stop checking after expired

            setTimeout(() => {
              dispatch(logout());
              navigate("/auth");
            }, 2000);
          }
        } catch (error) {
          console.error("Invalid token", error);
          dispatch(logout());
          navigate("/auth");
        }
      }
    }, 15000); // check every 15 seconds

    return () => clearInterval(interval); // cleanup
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <>
      {children}

      <Snackbar
        open={expired}
        autoHideDuration={3000}
        onClose={() => setExpired(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setExpired(false)} severity="warning" variant="filled">
          Session expired. Please login again.
        </Alert>
      </Snackbar>
    </>
  );
}
