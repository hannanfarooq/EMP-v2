import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../../../components/iconify";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useAuth } from "src/context/AuthContext";
import { forgotPassword } from "src/api";
import { toast } from "react-toastify";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleContactClick = () => {
    // Navigate to the Contact Us page
    navigate("/contact");
  };

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleClick = async () => {
    try {
      // Call your login function from the AuthContext
      login(email, password);
    } catch (error) {
      // Handle login error here
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgetPassword')
    // if (email.length === 0) return
    
    // forgotPassword({ email })
    //   .then(() => toast.success('Password Change Requested'))
    //   .catch(() => toast.error('Some Error Occured!'))
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
        </FormGroup>
        <Link variant="subtitle2" underline="hover" onClick={handleForgotPassword}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="outlined"
        onClick={handleClick}
      >
        Login
      </LoadingButton>
      <Link
        onClick={handleContactClick}
        variant="subtitle2"
        underline="hover"
        style={{ marginTop: "10px", cursor: "pointer" }}
      >
        Contact Us
      </Link>
    </>
  );
}
