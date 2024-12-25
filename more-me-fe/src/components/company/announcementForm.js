// import * as React from "react";
// import Avatar from "@mui/material/Avatar";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import BusinessIcon from "@mui/icons-material/Business";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { useState } from "react";
// import { createCompanyAnnouncement } from "src/api";
// import { toast } from "react-toastify";
// import { uploadFileToS3 } from "src/utils/uploadFileToS3";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

// function validateForm(name, description, reward) {
//   const errors = {};

//   if (!name.trim()) {
//     errors.name = "Name is required";
//   }

//   if (!description.trim()) {
//     errors.description = "Description is required";
//   }

//   if (isNaN(reward) || reward === "") {
//     errors.reward = "Reward must be a valid number";
//   }

//   if (reward < 1) {
//     errors.reward = "Reward must be a positive number";
//   }

//   return errors;
// }

// export default function AddAnnouncement({ fetchCompanyAnnouncements }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     reward: "",
//   });
//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const { name, description, reward } = formData;

//     // Validate the form data
//     const formErrors = validateForm(name, description, reward);
//     setErrors(formErrors);

//     // Check if there are any validation errors
//     if (Object.keys(formErrors).length === 0) {
//       // If no errors, upload file to S3
//       const uploadToastId = toast.info("Uploading file...", { autoClose: false, isLoading: true });

//       const progressCallback = (progressEvent) => {
//         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//         console.log("Progress", progress);
//         toast.update(uploadToastId, {
//           render: `Uploading file1... ${progress}%`,
//           autoClose: false,
//           isLoading: true,
//         });
//       };

//       try {
//         const docsUrl = await uploadFileToS3(selectedFile, progressCallback);
//         toast.dismiss(uploadToastId); // Dismiss the upload status toast
//         //toast.success("File uploaded successfully!");

//         // Make API call to create company policy
//         const data = {
//           name: formData.name,
//           description: formData.description,
//           rewardPoints: formData.reward,
//           companyId: storedUserData?.company.id,
//           documentUrl: docsUrl,
//         };

//         setSubmitting(true);
//         await createCompanyAnnouncement(data, storedUserData.token);
//         fetchCompanyAnnouncements();
//         setSubmitting(false);
//         toast.success("Announcement created successfully!");
//         // Add 3-second delay before resetting form and reloading
//         setTimeout(() => {
//           setFormData({
//             name: "",
//             description: "",
//             reward: "",
//           });
//           window.location.reload();
//         }, 3000);

//       } catch (error) {
//         toast.dismiss(uploadToastId);
//         toast.error("Error uploading file. Please try again.");
//       }
//     }
//   };

//   const handleFileInput = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const defaultTheme = createTheme();

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
//             Add new Announcement
//           </Typography>
//           <Box
//             component="form"
//             noValidate
//             onSubmit={handleSubmit}
//             sx={{ mt: 3 }}
//           >
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   id="name"
//                   label="Announcement Name"
//                   name="name"
//                   autoComplete="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   error={!!errors.name}
//                   helperText={errors.name}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   id="description"
//                   multiline
//                   rows={6}
//                   maxRows={8}
//                   label="Announcement Summary"
//                   name="description"
//                   autoComplete="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   error={!!errors.description}
//                   helperText={errors.description}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   type="number"
//                   id="reward"
//                   label="Reward Points"
//                   name="reward"
//                   autoComplete="reward"
//                   value={formData.reward}
//                   onChange={handleInputChange}
//                   error={!!errors.reward}
//                   helperText={errors.reward}
//                 />
//                 <span>Select announcement document file (.pdf/.docx)</span>
//                 <input
//                   type="file"
//                   accept=".pdf, .docx"
//                   onChange={handleFileInput}
//                 />
//               </Grid>
//             </Grid>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 1, mb: 1 }}
//               disabled={submitting}
//             >
//               {submitting ? "Submitting..." : "Create"}
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// }

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
import { useState } from "react";
import { createCompanyAnnouncement } from "src/api";
import { toast } from "react-toastify";
import { uploadFileToS3 } from "src/utils/uploadFileToS3";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addMinutes } from "date-fns";

// Validation function
function validateForm(name, description, reward) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!description.trim()) {
    errors.description = "Description is required";
  }

  if (isNaN(reward) || reward === "") {
    errors.reward = "Reward must be a valid number";
  }

  if (reward < 1) {
    errors.reward = "Reward must be a positive number";
  }

  return errors;
}

export default function AddAnnouncement({ fetchCompanyAnnouncements }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reward: "",
    announcementDate: null, // Initialize the date and time state
  });

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, reward, announcementDate } = formData;

    // Validate the form data
    const formErrors = validateForm(name, description, reward);
    setErrors(formErrors);

    // Check if there are any validation errors
    if (Object.keys(formErrors).length === 0) {
      // If no errors, upload file to S3
      const uploadToastId = toast.info("Uploading file...", { autoClose: false, isLoading: true });

      const progressCallback = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        toast.update(uploadToastId, {
          render: `Uploading file... ${progress}%`,
          autoClose: false,
          isLoading: true,
        });
      };

      try {
        const docsUrl = await uploadFileToS3(selectedFile, progressCallback);
        toast.dismiss(uploadToastId); // Dismiss the upload status toast

        // Make API call to create company announcement
        const data = {
          name: formData.name,
          description: formData.description,
          rewardPoints: formData.reward,
          companyId: storedUserData?.company.id,
          documentUrl: docsUrl,
          announcementDate: announcementDate, // Include the announcement date and time
        };
        console.log("data",data);

        setSubmitting(true);
        await createCompanyAnnouncement(data, storedUserData.token);
        fetchCompanyAnnouncements();
        setSubmitting(false);
        toast.success("Announcement created successfully!");
        // setTimeout(() => {
        //   setFormData({
        //     name: "",
        //     description: "",
        //     reward: "",
        //     announcementDate: null, // Reset date
        //   });
        //   window.location.reload();
        // }, 3000);

      } catch (error) {
        toast.dismiss(uploadToastId);
        toast.error("Error uploading file. Please try again.");
      }
    }
  };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (newValue) => {
    setFormData({
      ...formData,
      announcementDate: newValue,
    });
  };

  // Get current date and time to disable previous dates and times
  const currentDate = new Date();
  const minDateTime = addMinutes(currentDate, 1); // Minimum date and time is 1 minute ahead to prevent selecting the current time

  const defaultTheme = createTheme();

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
            Add new Announcement
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Announcement Name"
                  name="name"
                  autoComplete="name"
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
                  maxRows={8}
                  label="Announcement Summary"
                  name="description"
                  autoComplete="description"
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
                  autoComplete="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  error={!!errors.reward}
                  helperText={errors.reward}
                />
                <span>Select announcement document file (.pdf/.docx)</span>
                <input
                  type="file"
                  accept=".pdf, .docx"
                  onChange={handleFileInput}
                />
              </Grid>

              {/* Fancy DateTimePicker */}
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDateTimePicker
                    label="Announcement Date and Time"
                    value={formData.announcementDate}
                    onChange={handleDateChange}
                    minDateTime={minDateTime} // Disable previous dates and times
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="yyyy-MM-dd HH:mm" // 24-hour format
                    disablePast
                    ampm={false} // Disable AM/PM format
                    views={["year", "month", "day", "hours", "minutes"]} // Show only relevant views
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-root': {
                        fontSize: '1rem',
                        backgroundColor: '#f4f6f8',
                        borderRadius: '8px',
                        padding: '10px',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Create"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
