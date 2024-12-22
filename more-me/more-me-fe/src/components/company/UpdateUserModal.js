import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UpdateCompanyUser } from "src/api"; // Import your API function for updating user data

export default function UpdateUserDataForm({
  userData,
  onClose,
  setEditingCardOpen,
}) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email } = formData;

    // Validate the form data
    const formErrors = validateForm(firstName, lastName, email);
    setErrors(formErrors);

    // Check if there are any validation errors
    if (Object.keys(formErrors).length === 0) {
      // If no errors, make an API call to update user data
      setSubmitting(true);
      const updatedUserData = {
        id: userData.id,
        firstName,
        lastName,
        email,
        // Add any other fields you want to update here
      };

      try {

        const data = await UpdateCompanyUser(
          updatedUserData,
          storedUserData.token,
          storedUserData?.user?.role === "super-admin"
        );

        setSubmitting(false);
        onClose();
        setEditingCardOpen(false);
      } catch (error) {
        console.error("Error updating user data:", error);
        setSubmitting(false);
        setEditingCardOpen(false);
        // Handle error, e.g., display an error message
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (firstName, lastName, email) => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    // You can implement a regular expression or other validation logic for email
    // For simplicity, I'm using a basic format check here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Update User Data
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
