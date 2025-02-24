import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";

import CardMedia from "@mui/material/CardMedia";
import Iconify from "../../../components/iconify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent,
} from "@mui/material";
import { UpdateCompany, handleDeleteCompany } from "src/api";
import { useAuth } from "src/context/AuthContext";
const CompanyModal = ({ open, handleClose, post, refetchCompanies }) => {
  const [companyName, setCompanyName] = useState(post.name ? post.name : "");
  const [companyNTN, setCompanyNTN] = useState(post.ntn ? post.ntn : "");
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [postalAddress, setPostalAddress] = useState(
    post.postalAddress ? post.postalAddress : ""
  );
  const [companyEmail, setCompanyEmail] = useState(
    post.companyEmail ? post.companyEmail : ""
  );
  const [telephone, setTelephone] = useState(
    post.telephone ? post.telephone : ""
  );
  const [city, setCity] = useState(post.city ? post.city : "");
  const [country, setCountry] = useState(post.country ? post.country : "");
  const { userData } = useAuth();

  const style = {
    height: "100%",
    overflow: "scroll",
    position: "absolute",

    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,

    p: 2,
  };

  const fShortenNumber = (number) => {
    // Implement your logic for shortening numbers here
    return number;
  };
  const handleChange = (setter, value) => {
    setShowUpdateButton(true);
    setter(value);
  };

  const handleUpdateClick = async () => {
    const updatedPost = {
      ...post,
      name: companyName,
      ntn: companyNTN,
      postalAddress: postalAddress,
      companyEmail: companyEmail,
      telephone: telephone,
      city: city,
      country: country,
    };
    const res = await UpdateCompany(updatedPost, userData.token);
    await refetchCompanies();
    handleClose();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Card>
            <CardMedia
              component="img"
              alt="green iguana"
              height="260"
              image={post.photo}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                display={"flex"}
                alignItems="center"
                justifyContent={"space-between"}
              >
                {post.name}
                <Box>
                  <Iconify
                    icon={"pepicons-print:people"}
                    sx={{ width: 16, height: 16, mr: 0.5 }}
                  />
                  <Typography variant="caption">
                    {fShortenNumber(150)}
                  </Typography>
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.description}
              </Typography>

              <Box
                // component="form"
                noValidate
                // onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="firstName"
                      value={companyName}
                      fullWidth
                      id="firstName"
                      label="Company Name"
                      onChange={(e) => {
                        handleChange(setCompanyName, e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={companyNTN}
                      fullWidth
                      id="ConpanyNTN"
                      label="Conpany NTN"
                      // autoFocus
                      name="Conpany NTN"
                      onChange={(e) => {
                        handleChange(setCompanyNTN, e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={postalAddress}
                      fullWidth
                      id="PostalAddress"
                      label="Postal Address"
                      name="Postal Address"
                      autoComplete="PostalAddress"
                      onChange={(e) => {
                        handleChange(setPostalAddress, e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      value={companyEmail}
                      fullWidth
                      id="email"
                      label="Email Address"
                      onChange={(e) => {
                        handleChange(setCompanyEmail, e.target.value);
                      }}
                      // autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={telephone}
                      fullWidth
                      id="lastName"
                      label="TEL #"
                      name="lastName"
                      autoComplete="family-name"
                      onChange={(e) => {
                        handleChange(setTelephone, e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      value={city}
                      fullWidth
                      id="firstName"
                      label="City"
                      onChange={(e) => {
                        handleChange(setCity, e.target.value);
                      }}
                      // autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={country}
                      fullWidth
                      id="lastName"
                      label="Country"
                      name="lastName"
                      onChange={(e) => {
                        handleChange(setCountry, e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, gap: "20px", display: "flex" }}>
                  {showUpdateButton && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateClick}
                    >
                      Update
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<DeleteIcon />}
                    onClick={async () => {
                      await handleDeleteCompany(post.id, userData.token);
                      await refetchCompanies();
                      handleClose();
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CompanyModal;
