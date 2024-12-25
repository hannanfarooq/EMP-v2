// import React, { useRef, useState } from "react";
// import Avatar from "@mui/material/Avatar";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Link from "@mui/material/Link";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import BusinessIcon from "@mui/icons-material/Business";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { FileUpload } from "src/pages/FileUpload";
// import { toast } from "react-toastify";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { storage } from "src/utils/firebase";
// import { baseURL } from "src/utils/baseURL";

// import { ReactMultiEmail, isEmail } from "react-multi-email";
// import "react-multi-email/dist/style.css";

// function Copyright(props) {
//   return (
//     <Typography
//       variant="body2"
//       color="text.secondary"
//       align="center"
//       {...props}
//     >
//       {"Copyright © "}
//       <Link color="inherit" href="#">
//         More.Me
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// const defaultTheme = createTheme();

// export default function AddCompany({ refetchCompanies, handleClose }) {
//   const [coverPhoto, setCoverPhoto] = useState(null);
//   const [cLogo, setCLogo] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const [emails, setEmails] = useState([]);

//   const [files, setFiles] = useState({
//     logo: "",
//     photo: "",
//   });
//   const formRef = useRef(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     const companyData = {
//       name: data.get("companyName"),
//       companyNTN: data.get("companyNTN"),
//       postalAddress: data.get("postalAddress"),
//       adminEmails: emails,
//       telNumber: data.get("telNumber"),
//       city: data.get("city"),
//       country: data.get("country"),
//       adminName: data.get("adminName"),
//       description: data.get("description"),
//       userLimit: data.get("userLimit"),
//     };
//     const id = toast.loading("Adding...");
//     //getallusers
//     const resUsers = await fetch(baseURL + "/api/admin/getAllUsers", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-token": JSON.parse(localStorage.getItem("currentUser")).token,
//       },
//       // body: JSON.stringify({ ...companyData, ...files }),
//     });
//     const resUsersData = await resUsers.json();
//     console.log("get all users", resUsersData);
//     try {
//       const res = await fetch(baseURL + "/api/admin/createCompany", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-token": JSON.parse(localStorage.getItem("currentUser")).token,
//         },
//         body: JSON.stringify({ ...companyData, ...files }),
//       });
//       const data = await res.json();
//       if (data.code === 400) {
//         return toast.update(id, {
//           render: data.errorMessage,
//           type: "error",
//           isLoading: false,
//           closeButton: true,
//         });
//       }
//       if (data.code === 500) {
//         return toast.update(id, {
//           render: "Somthing went wrong!",
//           type: "error",
//           isLoading: false,
//           closeButton: true,
//         });
//       }
//       setFiles({ logo: "", photo: "" });
//       if (formRef.current) {
//         formRef.current.reset();
//       }
//       refetchCompanies();
//       toast.update(id, {
//         render: "Added!",
//         type: "success",
//         isLoading: false,
//         closeButton: true,
//       });
//       handleClose();
//     } catch (error) {
//       toast.update(id, {
//         render: "Somthing went wrong!",
//         type: "error",
//         isLoading: false,
//         closeButton: true,
//       });
//     }
//   };

//   const handleUploads = () => {
//     if (!(coverPhoto && cLogo)) return;
//     const files = [
//       {
//         file: coverPhoto,
//         name: "photo",
//         filename: new Date().getTime().toString() + coverPhoto.name,
//       },
//       {
//         file: cLogo,
//         name: "logo",
//         filename: new Date().getTime().toString() + cLogo.name,
//       },
//     ];
//     for (let file of files) {
//       const storageRef = ref(storage, "media/" + file.filename);

//       const uploadTask = uploadBytesResumable(storageRef, file.file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const fprogress = parseInt(
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//           );
//           setProgress(fprogress);
//         },
//         (error) => {
//           setProgress(null);
//           toast.error("Something went wrong while uploading files!");
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//             setFiles((prev) => ({
//               ...prev,
//               [file.name]: downloadURL,
//             }));
//           });
//           if (file.name === "logo") {
//             toast.success("Uploaded!");
//           }
//           setProgress(null);
//         }
//       );
//     }
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 0,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//             <BusinessIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Register a Company
//           </Typography>
//           <Box
//             component="form"
//             noValidate
//             onSubmit={handleSubmit}
//             sx={{ mt: 3 }}
//             ref={formRef}
//           >
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   autoComplete="off"
//                   name="companyName"
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="companyName"
//                   label="Company Name"
//                   autoFocus
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="companyNTN"
//                   label="Company NTN"
//                   name="companyNTN"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="postalAddress"
//                   label="Postal Address"
//                   name="postalAddress"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="description"
//                   label="Description"
//                   name="description"
//                   autoComplete="off"
//                   multiline
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <ReactMultiEmail
//                   placeholder="Input your email"
//                   emails={emails}
//                   onChange={(_emails) => {
//                     setEmails(_emails);
//                   }}
//                   // autoFocus={true}
//                   getLabel={(email, index, removeEmail) => {
//                     return (
//                       <div data-tag key={index}>
//                         <div data-tag-item>{email}</div>
//                         <span
//                           data-tag-handle
//                           onClick={() => removeEmail(index)}
//                         >
//                           ×
//                         </span>
//                       </div>
//                     );
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="telNumber"
//                   label="TEL #"
//                   name="telNumber"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="city"
//                   label="City"
//                   name="city"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="country"
//                   label="Country"
//                   name="country"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="adminName"
//                   label="Admin Name"
//                   name="adminName"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   size={"small"}
//                   id="userLimit"
//                   label="Company User Limit"
//                   name="userLimit"
//                   type="text"
//                   autoComplete="off"
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <span>Cover Photo</span>
//                 <input
//                   type="file"
//                   onChange={(e) => setCoverPhoto(e.target.files[0])}
//                 />
//                 {coverPhoto && (
//                   <img
//                     src={URL.createObjectURL(coverPhoto)}
//                     style={{ width: "50px", height: "50px" }}
//                   />
//                 )}
//               </Grid>
//               <Grid item xs={6}>
//                 <span>Logo</span>
//                 <input
//                   type="file"
//                   onChange={(e) => setCLogo(e.target.files[0])}
//                 />
//                 {cLogo && (
//                   <img
//                     src={URL.createObjectURL(cLogo)}
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 )}
//               </Grid>
//             </Grid>

//             <Button
//               fullWidth
//               size={"small"}
//               variant="contained"
//               sx={{ mt: 1, mb: 1 }}
//               onClick={handleUploads}
//             >
//               {progress ? progress + "% Uploaded" : "Upload"}
//             </Button>
//             {files.logo && files.photo && (
//               <Button
//                 type="submit"
//                 fullWidth
//                 size={"small"}
//                 variant="contained"
//                 sx={{ mt: 1, mb: 1 }}
//               >
//                 Register
//               </Button>
//             )}
//           </Box>
//         </Box>
//         <Copyright sx={{ mt: 2 }} />
//       </Container>
//     </ThemeProvider>
//   );
// }


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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "src/utils/firebase";
import { baseURL } from "src/utils/baseURL";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

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

export default function AddCompany({ refetchCompanies, handleClose }) {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [cLogo, setCLogo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [files, setFiles] = useState({
    logo: "",
    photo: "",
  });
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("company registration data", data);
    const companyData = {
      name: data.get("companyName"),
      companyNTN: data.get("companyNTN"),
      postalAddress: data.get("postalAddress"),
      adminEmails: emails,
      telNumber: data.get("telNumber"),
      city: data.get("city"),
      country: data.get("country"),
      adminName: data.get("adminName"),
      description: data.get("description"),
      userLimit: data.get("userLimit"),
    };

    const id = toast.loading("Adding...");

    try {
      // Fetch all users
      const resUsers = await fetch(baseURL + "/api/admin/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-token": JSON.parse(localStorage.getItem("currentUser")).token,
        },
      });

      const resUsersData = await resUsers.json();
      const existingEmails = resUsersData.data.map(user => user.email);

      // Check if any of the input emails already exist
      const duplicateEmails = emails.filter(email => existingEmails.includes(email));
      if (duplicateEmails.length > 0) {
        return toast.update(id, {
          render: `Email already exists: ${duplicateEmails.join(", ")}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }

      // Proceed with creating the company
      const res = await fetch(baseURL + "/api/admin/createCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": JSON.parse(localStorage.getItem("currentUser")).token,
        },
        body: JSON.stringify({ ...companyData, ...files }),
      });

      const data = await res.json();
      if (data.code === 400) {
        return toast.update(id, {
          render: data.errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
      if (data.code === 500) {
        return toast.update(id, {
          render: "Something went wrong!",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }

      setFiles({ logo: "", photo: "" });
      if (formRef.current) {
        formRef.current.reset();
      }
      refetchCompanies();
      toast.update(id, {
        render: "Added!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      handleClose();
    } catch (error) {
      toast.update(id, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  const handleUploads = () => {
    if (!(coverPhoto && cLogo)) return;
    const files = [
      {
        file: coverPhoto,
        name: "photo",
        filename: new Date().getTime().toString() + coverPhoto.name,
      },
      {
        file: cLogo,
        name: "logo",
        filename: new Date().getTime().toString() + cLogo.name,
      },
    ];
    for (let file of files) {
      const storageRef = ref(storage, "media/" + file.filename);

      const uploadTask = uploadBytesResumable(storageRef, file.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const fprogress = parseInt(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(fprogress);
        },
        (error) => {
          setProgress(null);
          toast.error("Something went wrong while uploading files!", {
            autoClose: 5000,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setFiles((prev) => ({
              ...prev,
              [file.name]: downloadURL,
            }));
          });
          if (file.name === "logo") {
            toast.success("Uploaded!", {
              autoClose: 5000,
            });
          }
          setProgress(null);
        }
      );
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
            Register a Company
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
                />
              </Grid>
              <Grid item xs={6}>
                <ReactMultiEmail
                  placeholder="Input your email"
                  emails={emails}
                  onChange={(_emails) => {
                    setEmails(_emails);
                  }}
                  // autoFocus={true}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        <div data-tag-item>{email}</div>
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    );
                  }}
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size={"small"}
                  id="adminName"
                  label="Admin Name"
                  name="adminName"
                  autoComplete="off"
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
                />
              </Grid>
              <Grid item xs={6}>
                <span>Cover Photo</span>
                <input
                  type="file"
                  onChange={(e) => setCoverPhoto(e.target.files[0])}
                />
                {coverPhoto && (
                  <img
                    src={URL.createObjectURL(coverPhoto)}
                    style={{ width: "50px", height: "50px" }}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <span>Logo</span>
                <input
                  type="file"
                  onChange={(e) => setCLogo(e.target.files[0])}
                />
                {cLogo && (
                  <img
                    src={URL.createObjectURL(cLogo)}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Grid>
            </Grid>

            <Button
              fullWidth
              size={"small"}
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              onClick={handleUploads}
            >
              {progress ? progress + "% Uploaded" : "Upload"}
            </Button>
            {files.logo && files.photo && (
              <Button
                type="submit"
                fullWidth
                size={"small"}
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
              >
                Register
              </Button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 2 }} />
      </Container>
    </ThemeProvider>
  );
}

