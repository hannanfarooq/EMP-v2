import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { sendEmail } from "src/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    const id = toast.loading("sending ...");
    event.preventDefault();
    const res = await sendEmail(formData);
    toast.update(id, {
      render: "You will be contacted shortly",
      type: "success",
      isLoading: false,
      closeButton: true,
    });
    navigate("/");
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        width: 400,
        margin: "50px auto",
        padding: 3,
        boxShadow: 2,
        borderRadius: 1,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          multiline
          rows={4}
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default ContactUs;
