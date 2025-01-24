import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { UpdateAnnouncement } from "src/api";
import { toast } from "react-toastify";
import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function validateForm(name, description, reward) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!description.trim()) errors.description = "Description is required";
  if (isNaN(reward) || reward === "") errors.reward = "Reward must be a valid number";
  return errors;
}

export default function UpdateCompanyAnnouncement({
  announcementData,
  setEditingCardOpen,
  fetchCompanyAnnouncements,
}) {
  const [formData, setFormData] = useState({
    name: announcementData.name || "",
    description: announcementData.description || "",
    reward: announcementData.rewardPoints || "",
    documents: announcementData.documentUrls
      ? Array.isArray(announcementData.documentUrls)
        ? announcementData.documentUrls.map((url) => ({ url, status: true }))  // Mark existing documents as true
        : [{ url: announcementData.documentUrls, status: true }]
      : [],
    images: announcementData.imageUrls
      ? Array.isArray(announcementData.imageUrls)
        ? announcementData.imageUrls.map((url) => ({ url, status: true }))  // Mark existing images as true
        : [{ url: announcementData.imageUrls, status: true }]
      : [],
  });
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log("formData.documents before update:", formData.documents);
  
    // Check if documentUrls exist in the announcementData
    if (announcementData?.documentUrls) {
      setFormData((prevState) => ({
        ...prevState,
        documents: Array.isArray(announcementData.documentUrls)
          ? announcementData.documentUrls.map((url) => ({
              url,
              status: true,  // Mark existing documents as uploaded (status: true)
            }))
          : [
              { url: announcementData.documentUrls, status: true },
            ],  // If it's a single string, mark it as uploaded
      }));
    }
  
    // Check if imageUrls exist in the announcementData
    if (announcementData?.imageUrls) {
      setFormData((prevState) => ({
        ...prevState,
        images: Array.isArray(announcementData.imageUrls)
          ? announcementData.imageUrls.map((url) => ({
              url,
              status: true,  // Mark existing images as uploaded (status: true)
            }))
          : [
              { url: announcementData.imageUrls, status: true },
            ],  // If it's a single string, mark it as uploaded
      }));
    }
  }, [announcementData]); 
  const handleFileInput = (e, type) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      status: false,  // Mark new files as false
    }));
    if (type === "documents") {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }));
    }else if (type === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const removeFile = (type, index) => {
    if (type === "documents") {
      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index),
      }));
    } else if (type === "images") {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, reward } = formData;
    const formErrors = validateForm(name, description, reward);
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      try {
        // Filter only new files (status: false)
        const newDocuments = formData.documents.filter((file) => !file.status);
        const newImages = formData.images.filter((file) => !file.status);
  
        // Upload new documents and images
        const documentUrls = await Promise.all(
          newDocuments.map((file) => uploadPDFAndGetURL(file.file))
        );
  
        const imageUrls = await Promise.all(
          newImages.map((file) => uploadImageAndGetURL(file.file))
        );
  
        // Extract URLs for old documents and images
        const existingDocumentUrls = formData.documents
          .filter((file) => file.status)
          .map((file) => file.url);
  
        const existingImageUrls = formData.images
          .filter((file) => file.status)
          .map((file) => file.url);
  
        // Combine old and new URLs (ensure no nested or malformed strings)
        const data = {
          id: announcementData.id,
          name: formData.name,
          description: formData.description,
          rewardPoints: formData.reward,
          companyId: storedUserData?.company.id,
          documentUrls: [...existingDocumentUrls, ...documentUrls], // Combine old and new URLs correctly
          imageUrls: [...existingImageUrls, ...imageUrls], // Combine old and new URLs correctly
        };
  
        console.log("data.documentUrls : ", data.documentUrls);
        setSubmitting(true);
        await UpdateAnnouncement(data, storedUserData.token);
        fetchCompanyAnnouncements();
        setSubmitting(false);
        toast.success("Announcement updated successfully!");
        setEditingCardOpen(false);
      } catch (error) {
        console.log("Error uploading files. Please try again.", error);
        toast.error("Error uploading files. Please try again.");
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

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md" sx={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <BusinessIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ marginBottom: "1rem", fontWeight: "bold" }}>
            Update Announcement
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Announcement Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  multiline
                  rows={6}
                  label="Announcement Summary"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="reward"
                  label="Reward Points"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  error={!!errors.reward}
                  helperText={errors.reward}
                />
              </Grid>
              <Grid item xs={12}>
                <span>Select announcement document files (.pdf/.docx)</span>
                <input
                  type="file"
                  accept=".pdf, .docx"
                  multiple
                  onChange={(e) => handleFileInput(e, "documents")}
                  style={{ marginBottom: "1rem" }}
                />
            <ul style={{ maxHeight: "150px", overflowY: "auto", padding: 0, listStyleType: "none" }}>
            <ul style={{ maxHeight: "150px", overflowY: "auto", padding: 0, listStyleType: "none" }}>
  {formData.documents.map((file, index) => {
    const fileName = file.file ? file.file.name : file.url; // Correct access
    const truncatedFileName = fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;
    return (
      <li key={index} style={{ marginBottom: "0.5rem" }}>
        {truncatedFileName} {file.status ? "(Uploaded)" : "(New)"}{" "}
        <Button size="small" onClick={() => removeFile("documents", index)} sx={{ marginLeft: "1rem" }}>
          Remove
        </Button>
      </li>
    );
  })}
</ul>

</ul>

              </Grid>
              <Grid item xs={12}>
                <span>Select announcement images (.png, .jpg, .jpeg)</span>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  multiple
                  onChange={(e) => handleFileInput(e, "images")}
                  style={{ marginBottom: "1rem" }}
                />
              <ul style={{ maxHeight: "150px", overflowY: "auto", padding: 0, listStyleType: "none" }}>
  {formData.images.map((file, index) => {
    const fileName = file.file ? file.file.name : file.url; // Correct access
    const truncatedFileName = fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;
    return (
      <li key={index} style={{ marginBottom: "0.5rem" }}>
       {truncatedFileName} {file.status ? "(Uploaded)" : "(New)"}{" "}
        <Button size="small" onClick={() => removeFile("images", index)} sx={{ marginLeft: "1rem" }}>
          Remove
        </Button>
      </li>
    );
  })}
</ul>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }} disabled={submitting}>
              {submitting ? "Submitting..." : "Update"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
