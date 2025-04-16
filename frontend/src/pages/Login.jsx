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
import LoadingScreen from "../components/LoadingScreen";

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
    if (email === "demo@foodrush.lk" && password === "123456") {
      localStorage.setItem("token", "dummyToken");
      navigate("/u");
    } else {
      setSnackbarType("error");
      setSnackbarMsg("Invalid credentials");
      setOpenSnackbar(true);
    }
  };

  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-white flex items-center justify-center px-6">
      <Paper elevation={4} className="w-full sm:w-[90%] md:w-1/2 p-10 rounded-3xl">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Create Your Account</h2>

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
