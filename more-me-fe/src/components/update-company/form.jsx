import React, { useRef, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FileUpload } from "src/pages/FileUpload";
import { toast } from "react-toastify";

import { storage } from "src/utils/firebase";
import { baseURL } from "src/utils/baseURL";

import "react-multi-email/dist/style.css";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        More.Me
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function UpdateCompany({
  refetchCompanies,
  companyData,
  isEditing,
  setIsModalOpen,
}) {
  const [coverPhoto, setCoverPhoto] = useState(
    companyData?.photo ? companyData?.photo : null
  );
  const [cLogo, setCLogo] = useState(
    companyData?.logo ? companyData?.logo : null
  );
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: companyData.name || "",
    companyNTN: companyData.ntn || "",
    postalAddress: companyData.postalAddress || "",
    description: companyData.description || "",
    telNumber: companyData.telephone || "",
    city: companyData.city || "",
    country: companyData.country || "",
    userLimit: companyData.userLimit || "",
    // Add other form fields here with their corresponding values from companyData
  });

  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const companyValues = {
      id: companyData.id,
      name: data.get("companyName"),
      companyNTN: data.get("companyNTN"),
      postalAddress: data.get("postalAddress"),
      telNumber: data.get("telNumber"),
      city: data.get("city"),
      country: data.get("country"),
      description: data.get("description"),
      userLimit: data.get("userLimit"),
      logo: cLogo,
      photo: coverPhoto,
    };
    const id = toast.loading("Adding...");
    try {
      const res = await fetch(baseURL + "/api/admin/updateCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": JSON.parse(localStorage.getItem("currentUser")).token,
        },
        body: JSON.stringify({ companyValues }),
      });
      const responseData = await res.json();

      if (responseData.code == 400) {
        return toast.update(id, {
          render: responseData.errorMessage,
          type: "error",
          isLoading: false,
          closeButton: true,
        });
      }
      if (responseData.code === 200) {
        await refetchCompanies();
        toast.update(id, {
          render: "Updated successfully!",
          type: "success",
          isLoading: false,
          closeButton: true,
        });
        setIsModalOpen(false);
      }
      if (responseData.code == 500) {
        return toast.update(id, {
          render: "Something went wrong!",
          type: "error",
          isLoading: false,
          closeButton: true,
        });
      }
    } catch (error) {
      toast.update(id, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        closeButton: true,
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <BusinessIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update a Company
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
            ref={formRef}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  name="companyName"
                  required
                  fullWidth
                  size={"small"}
                  id="companyName"
                  label="Company Name"
                  autoFocus
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="companyNTN"
                  label="Company NTN"
                  name="companyNTN"
                  autoComplete="off"
                  value={formData.companyNTN}
                  onChange={(e) =>
                    setFormData({ ...formData, companyNTN: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="postalAddress"
                  label="Postal Address"
                  name="postalAddress"
                  autoComplete="off"
                  value={formData.postalAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, postalAddress: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="off"
                  multiline
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="telNumber"
                  label="TEL #"
                  name="telNumber"
                  autoComplete="off"
                  value={formData.telNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, telNumber: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="off"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="country"
                  label="Country"
                  name="country"
                  autoComplete="off"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="userLimit"
                  label="Company User Limit"
                  name="userLimit"
                  type="text"
                  autoComplete="off"
                  value={formData.userLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, userLimit: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                {/* Add a file input for cover photo similar to the logo */}
                <span>Cover Photo</span>
                <input
                  type="file"
                  onChange={async (e) => {
                    const uploaded = await uploadImageAndGetURL(
                      e.target.files[0]
                    );
                    setCoverPhoto(uploaded);
                  }}
                />
                {coverPhoto && (
                  <img
                    src={coverPhoto}
                    style={{ width: "50px", height: "50px" }}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                {/* Add a file input for the logo similar to the cover photo */}
                <span>Logo</span>
                <input
                  type="file"
                  onChange={async (e) => {
                    const uploaded = await uploadImageAndGetURL(
                      e.target.files[0]
                    );
                    setCLogo(uploaded);
                  }}
                />
                {cLogo && (
                  <img
                    src={cLogo}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Grid>
            </Grid>

            {cLogo && coverPhoto && (
              <Button
                type="submit"
                fullWidth
                size={"small"}
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
              >
                Update
              </Button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 2 }} />
      </Container>
    </ThemeProvider>
  );
}
