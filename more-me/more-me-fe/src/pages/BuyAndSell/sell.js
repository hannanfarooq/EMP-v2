import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import { baseURL, buyAndSellCategories } from "src/utils/baseURL";
import { FormControl, MenuItem, Select, TextareaAutosize } from "@mui/material";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import ProductSort from "./ProductSort";

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

export default function AddCompany({}) {
  const [coverPhotos, setCoverPhotos] = useState([]);
  const [cLogo, setCLogo] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(buyAndSellCategories[1].value);

  const formRef = useRef(null);

  const uploadImagesAndGetURLs = async (files) => {
    const imageUrls = [];

    for (const file of files) {
      const imageUrl = await uploadImageAndGetURL(file);
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProgress(true);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const data = new FormData(event.currentTarget);
    const productImgs = await uploadImagesAndGetURLs(coverPhotos);

    const productData = {
      name: data.get("productName"),
      sellerPhone: data.get("telNumber"),
      price: data.get("price"),
      description: data.get("description"),
      sellerId: currentUser.user.id,
      companyId: currentUser.company.id,
      photo: productImgs,
      category: category,
    };

    const id = toast.loading("Adding...");

    try {
      const res = await fetch(baseURL + "/api/addSellItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": currentUser.token,
        },
        body: JSON.stringify({ ...productData }),
      });

      const responseData = await res.json();

      setProgress(false);

      if (responseData.code === 400) {
        return toast.update(id, {
          render: responseData.errorMessage,
          type: "error",
          isLoading: false,
          closeButton: true,
        });
      }

      if (responseData.code === 500) {
        return toast.update(id, {
          render: "Something went wrong!",
          type: "error",
          isLoading: false,
          closeButton: true,
        });
      }

      if (formRef.current) {
        formRef.current.reset();
      }

      toast.update(id, {
        render: "Product posted for buying!",
        type: "success",
        isLoading: false,
        closeButton: true,
      });
    } catch (error) {
      toast.update(id, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        closeButton: true,
      });
      setProgress(false);
    }
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
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
            Add Product to Sell
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
            ref={formRef}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  name="productName"
                  required={true}
                  fullWidth
                  size={"small"}
                  id="productName"
                  label="Product Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  required
                  fullWidth
                  size={"small"}
                  id="description"
                  placeholder="Enter Product Description"
                  name="description"
                  autoComplete="off"
                  multiline
                  minRows={5}
                  style={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size={"small"}
                  id="telNumber"
                  label="Your TEL #"
                  name="telNumber"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="price"
                  label="Price"
                  type="number"
                  name="price"
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={6}>
                <Typography component="h4" variant="body1">
                  Select Category
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    onChange={handleChangeCategory}
                    required
                  >
                    {buyAndSellCategories.slice(1).map((item) => (
                      <MenuItem value={item.value}>{item.value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <span>Product Images: </span>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      setCoverPhotos([...coverPhotos, selectedFile]);
                    }
                  }}
                />
                {coverPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "5px",
                    }}
                  />
                ))}
              </Grid>
            </Grid>

            {coverPhotos.length > 0 && (
              <Button
                type="submit"
                fullWidth
                size={"small"}
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
                disabled={progress}
              >
                Post Product
              </Button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 2 }} />
      </Container>
    </ThemeProvider>
  );
}
