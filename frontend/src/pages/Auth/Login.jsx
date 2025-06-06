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
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { LoginService } from "../../services/authService";
import { initializeCartForUser } from "../../store/slices/cartSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const credentials = { email, password };
  
      const response = await LoginService(credentials);
      console.log(response.status, response.data);
  
      if (response.status === 200) {
        const { token, user } = response.data;
        // Show success message
        setSnackbarType("success");
        setSnackbarMsg("Login successful, redirecting...");
        setOpenSnackbar(true);
  
        // Delay before navigation
        setTimeout(() => {
          switch (user.role) {
            case "customer":
              navigate("/");
              break;
            default:
              navigate("/profile");
          }
        }, 1500); // 1.5 seconds delay

        // Save in Redux
        dispatch(setCredentials({ token, user }));
        dispatch(initializeCartForUser(user._id)); //initialize user-specific cart
  
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
    <div className="flex items-center justify-center">
      <Paper elevation={4} className="w-full sm:w-[80%] md:w-3/4 pt-10 pb-10 pl-8 pr-8 rounded-3xl"
      sx={{ borderRadius: "10px"}}>
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
          sx={{ borderRadius: "10px", mt: 3, py: 1.5 }}
          onClick={handleLogin}
        >
          Log In
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
