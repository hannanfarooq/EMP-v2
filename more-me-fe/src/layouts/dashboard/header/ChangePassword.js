import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { baseURL } from "src/utils/baseURL";
import { toast } from "react-toastify";
import { useAuth } from "src/context/AuthContext";

const ChangePassword = ({ handleClose }) => {
    const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    setIsConfirmDisabled(event.target.value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setIsConfirmDisabled(event.target.value !== newPassword);
  };

  const handleSave = async () => {
    if (isLoading) return; // Prevent multiple clicks while loading

    setIsLoading(true); // Set loading state to true
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const response = await fetch(baseURL + "/api/changeUserPassword2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": currentUser.token,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setIsError(true);
        setErrorMessage(errorData.message || "An error occurred.");
        // Handle the error, you can show a message or take appropriate action
      } else {
        const data = await response.json();
        console.log("Success:", data);
        toast.success("Password has been changed successfully");
        handleClose(true); // Close modal on success
        localStorage.removeItem("currentUser");
        logout();
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      setErrorMessage(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleCancel = () => {
    // Add any additional cancel logic here
    console.log("Cancel button clicked");
    handleClose(true);
  };

  return (
    <div style={{ padding: "20px 20px" }}>
      <h2>Change Password</h2>
      <form>
        <TextField
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          fullWidth
          margin="normal"
          error={confirmPassword !== newPassword}
          helperText={
            confirmPassword !== newPassword ? "Passwords do not match" : ""
          }
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isConfirmDisabled || isLoading} // Disable while loading or if passwords don't match
          >
            {isLoading ? "Saving..." : "Save"} {/* Show loading text while saving */}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
      {error && <div>{errorMessage}</div>}
    </div>
  );
};

export default ChangePassword;
