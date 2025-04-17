import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [page, setPage] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [role, setRole] = useState("customer");


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/u");
  }, [navigate]);

  const showMessage = (type, msg) => {
    setSnackbarType(type);
    setSnackbarMsg(msg);
    setOpenSnackbar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPhone = phone.startsWith("+94")
      ? phone
      : `+94${phone.replace(/^0/, "")}`; // remove starting 0 if exists

    const data = {
      name: `${firstName.trim()} ${lastName.trim()}`.replace(/\s+/g, " "),
      email,
      phone: formattedPhone,
      date_of_birth: dateOfBirth,
      gender,
      password,
      role,
    };
    console.log(data);
    
    try {
      const response = await SignupService(data);
      if (response.status === 200) {
        showMessage("success", response.data.message);
        navigate("/login");
      } else {
       
        showMessage("error", response.data.message);
      }
    } catch (err) {
      
      showMessage("error", "Signup failed.");
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-6 mb-2">
      <div className="w-full sm:w-3/4 lg:w-1/2 bg-white p-10 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {page === 0 && (
            <>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <div className="text-right mt-4">
                <Button variant="contained" onClick={() => setPage(page + 1)}
                    sx={{
                        borderRadius: "10px",
                        }}>
                  Next
                </Button>
              </div>
            </>
          )}

          {page === 1 && (
            <>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                placeholder="7XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <Button variant="outlined" onClick={() => setPage(page - 1)}
                    sx={{
                        borderRadius: "10px",
                        }}>
                  Back
                </Button>
                <Button variant="contained" onClick={() => setPage(page + 1)}
                    sx={{
                        borderRadius: "10px",
                        }}>
                  Next
                </Button>
              </div>
            </>
          )}

          {page === 2 && (
            <>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                margin="normal"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={gender}
                  label="Gender"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              <div className="flex justify-between mt-4">
                <Button variant="outlined" onClick={() => setPage(page - 1)}
                    sx={{
                        borderRadius: "10px",
                        }}>
                  Back
                </Button>
                <Button variant="contained" onClick={() => setPage(page + 1)}
                    sx={{
                        borderRadius: "10px",
                        }}>
                  Next
                </Button>
              </div>
            </>
          )}

          {page === 3 && (
            <>
              <TextField
                label="Password"
                type={passwordVisible ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setPasswordVisible(!passwordVisible)} edge="end">
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={passwordVisible ? "text" : "password"}
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordTouched(true);
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Select Role</InputLabel>
                <Select
                  labelId="role-label"
                  value={role}
                  label="Select Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="restaurant_admin">Restaurant Admin</MenuItem>
                  <MenuItem value="delivery_person">Delivery Person</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <div className="flex justify-between mt-4">
                <Button variant="outlined" onClick={() => setPage(page - 1)}
                    sx={{
                        borderRadius: "10px",
                        }}>
                  Back
                </Button>
                <Button variant="contained" type="submit"
                    sx={{
                    borderRadius: "10px",
                    }}
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </form>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarType} variant="filled">{snackbarMsg}</Alert>
      </Snackbar>
    </div>
  );
}
