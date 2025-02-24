import React, { useRef, useState, useEffect } from "react";
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

export default function AddCompany({ item, isEdit }) {
  const [coverPhotos, setCoverPhotos] = useState(
    isEdit ? item.photo || [] : []
  );
  const [cLogo, setCLogo] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [telNumber, setTelNumber] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(buyAndSellCategories[1].value);

  const formRef = useRef(null);

  useEffect(() => {
    if (isEdit && item) {
      setProductName(item.name || "");
      setDescription(item.description || "");
      setTelNumber(item.sellerPhone || "");
      setPrice(item.price || "");
      setCategory(item.category || buyAndSellCategories[1].value);
      setCoverPhotos(item.photo || []);
    }
  }, [isEdit, item]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProgress(true);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const data = new FormData(event.currentTarget);

    const productData = {
      name: productName,
      sellerPhone: telNumber,
      price: price,
      description: description,
      sellerId: currentUser.user.id,
      companyId: currentUser.company.id,
      photo: coverPhotos,
      category: category,
    };

    const id = toast.loading("Adding...");

    try {
      let responseData = "";
      if (isEdit) {
        productData.id = item.id;
        const res = await fetch(baseURL + `/api/updateSellItem/${item.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": currentUser.token,
          },
          body: JSON.stringify({ ...productData }),
        });
      } else {
        const res = await fetch(baseURL + "/api/addSellItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": currentUser.token,
          },
          body: JSON.stringify({ ...productData }),
        });

        responseData = await res.json();
      }

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
      window.location.reload();
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
            {isEdit ? "Edit Product" : "Add Product to Sell"}
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
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                      <MenuItem key={item.value} value={item.value}>
                        {item.value}
                      </MenuItem>
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
                  onChange={async (e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      const uploadImg = await uploadImageAndGetURL(
                        selectedFile
                      );
                      setCoverPhotos([...coverPhotos, uploadImg]);
                    }
                  }}
                />
                {coverPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Product Photo ${index + 1}`}
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
                {isEdit ? "Update Product" : "Post Product"}
              </Button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 2 }} />
      </Container>
    </ThemeProvider>
  );
}
