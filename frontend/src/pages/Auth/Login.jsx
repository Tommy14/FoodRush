import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/u");
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const credentials = { email, password };

      console.log("Login credentials:", credentials); // Debugging line
  
      const response = await LoginService(credentials); // ← Call your backend
  
      if (response.status === 200) {
        const { accessToken, user } = response.data;
  
        // Save token
        localStorage.setItem("token", accessToken);
  
        // Save user info if needed
        localStorage.setItem("user", JSON.stringify(user));
  
        // Optional: Redirect based on user role
        switch (user.role) {
          case "customer":
            navigate("/");
            break;
          case "restaurant_admin":
            navigate("/restaurant-dashboard");
            break;
          case "delivery_person":
            navigate("/driver-dashboard");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/u");
        }
  
        // Optional message
        setSnackbarType("success");
        setSnackbarMsg("Login successful");
        setOpenSnackbar(true);
      } else {
        setSnackbarType("error");
        setSnackbarMsg(response.data.message || "Login failed");
        setOpenSnackbar(true);
      }
  
    } catch (error) {
      setSnackbarType("error");
      setSnackbarMsg(error?.response?.data?.message || "Something went wrong");
      setOpenSnackbar(true);
    }
  };
  

  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center px-6 mb-4">
      <Paper elevation={4} className="w-full sm:w-[80%] md:w-2/3 p-10 rounded-3xl">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Welcome Back</h2>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: "999px", mt: 3, py: 1.5 }}
          onClick={handleLogin}
        >
          Sign In
        </Button>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbarType} variant="filled">{snackbarMsg}</Alert>
        </Snackbar>
      </Paper>
    </div>
  );
}
