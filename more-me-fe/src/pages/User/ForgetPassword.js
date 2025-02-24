// ForgetPassword.js
import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { forgotPassword, resetPassword, verifyOTP } from "src/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input, 3: New Password input
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (email.length === 0) return null;

    forgotPassword({ email })
      .then((result) => {
        console.log("result ", result);
        if (result && result.data !== null) {
          toast.success("Password Change Requested");
          setStep(2);
        } else {
          toast.error("Invalid Email");
        }

        // setStep(2);
      })
      .catch(() => toast.error("Some Error Occured!"));
  };

  const handleVerifyOtp = async () => {
    verifyOTP({ email, token: otp })
      .then((result) => {
        console.log("result ", result);
        if (result && result.data !== null) {
          toast.success("OTP matched");
          setStep(3);
        } else {
          toast.error("Invalid OTP");
        }

        // setStep(2);
      })
      .catch(() => toast.error("Some Error Occured!"));
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      return toast.error("Password mismatch");
    }

    resetPassword({ email, token: otp, newPassword })
      .then((result) => {
        if (result && result.data !== null) {
          toast.success("Password Successfully updated");
          navigate("/login");
        } else {
          toast.error("Some error has occured");
        }

        // setStep(2);
      })
      .catch(() => toast.error("Some Error Occured!"));
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxWidth: "600px",
        width: "100%",
        margin: "50px auto",
      }}
    >
      {step === 1 && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            flexDirection: "column",
            maxWidth: "600px",
            width: "100%",
            margin: "0px auto",
            gap: "50px",
          }}
        >
          <Typography variant="h5">
            Enter your email to reset the password
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSendOtp}>
            Send OTP
          </Button>
        </div>
      )}

      {step === 2 && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            flexDirection: "column",
            maxWidth: "600px",
            width: "100%",
            margin: "0px auto",
            gap: "50px",
          }}
        >
          <Typography variant="h5">Enter the OTP sent to your email</Typography>
          <TextField
            label="OTP"
            variant="outlined"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </div>
      )}

      {step === 3 && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            flexDirection: "column",
            maxWidth: "600px",
            width: "100%",
            margin: "0px auto",
            gap: "50px",
          }}
        >
          <Typography variant="h5">Enter your new password</Typography>
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
