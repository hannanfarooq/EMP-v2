// // import * as React from "react";
// // import Avatar from "@mui/material/Avatar";
// // import CssBaseline from "@mui/material/CssBaseline";
// // import TextField from "@mui/material/TextField";
// // import Button from "@mui/material/Button";
// // import Grid from "@mui/material/Grid";
// // import Box from "@mui/material/Box";
// // import BusinessIcon from "@mui/icons-material/Business";
// // import Typography from "@mui/material/Typography";
// // import Container from "@mui/material/Container";
// // import { useState } from "react";
// // import { createCompanyPolicy } from "src/api";
// // import { toast } from "react-toastify";
// // import { uploadFileToS3 } from "src/utils/uploadFileToS3";
// // import { createTheme, ThemeProvider } from "@mui/material/styles";
// // import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";

// // function validateForm(name, description, reward) {
// //   const errors = {};

// //   if (!name.trim()) {
// //     errors.name = "Name is required";
// //   }

// //   if (!description.trim()) {
// //     errors.description = "Description is required";
// //   }

// //   if (isNaN(reward) || reward === "") {
// //     errors.reward = "Reward must be a valid number";
// //   }

// //   if (reward < 1) {
// //     errors.reward = "Reward must be a positive number";
// //   }

// //   return errors;
// // }

// // export default function AddPolicy({ fetchCompanyPolicies }) {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     description: "",
// //     reward: "",
// //   });
// //   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
// //   const [errors, setErrors] = useState({});
// //   const [submitting, setSubmitting] = useState(false);
// //   const [selectedFile, setSelectedFile] = useState(null);

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     const { name, description, reward } = formData;

// //     // Validate the form data
// //     const formErrors = validateForm(name, description, reward);
// //     setErrors(formErrors);

// //     // Check if there are any validation errors
// //     if (Object.keys(formErrors).length === 0) {
// //       // If no errors, upload file to S3
// //       const uploadToastId = toast.info("Uploading file...", { autoClose: false, isLoading: true });

// //       const progressCallback = (progressEvent) => {
// //         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
// //         console.log("Progress", progress);
// //         toast.update(uploadToastId, {
// //           render: `Uploading file1... ${progress}%`,
// //           autoClose: false,
// //           isLoading: true,
// //         });
// //       };

// //       try {
// //         const docsUrl = await uploadPDFAndGetURL(selectedFile);
// //         toast.dismiss(uploadToastId); // Dismiss the upload status toast
// //         //toast.success("File uploaded successfully!");

// //         // Make API call to create company policy
// //         const data = {
// //           name: formData.name,
// //           description: formData.description,
// //           rewardPoints: formData.reward,
// //           companyId: storedUserData?.company.id,
// //           documentUrl: docsUrl,
// //         };

// //         setSubmitting(true);
// //         await createCompanyPolicy(data, storedUserData.token);
// //         fetchCompanyPolicies();
// //         setSubmitting(false);
// //         toast.success("Policy created successfully!");
// //         // Add 3-second delay before resetting form and reloading
// //         setTimeout(() => {
// //           setFormData({
// //             name: "",
// //             description: "",
// //             reward: "",
// //           });
// //           window.location.reload();
// //         }, 3000);

// //       } catch (error) {
// //         toast.dismiss(uploadToastId);
// //         toast.error("Error uploading file. Please try again.");
// //       }
// //     }
// //   };

// //   const handleFileInput = (e) => {
// //     setSelectedFile(e.target.files[0]);
// //   };

// //   const handleInputChange = (event) => {
// //     const { name, value } = event.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //   };

// //   const defaultTheme = createTheme();

// //   return (
// //     <ThemeProvider theme={defaultTheme}>
// //       <Container component="main" maxWidth="xs">
// //         <CssBaseline />
// //         <Box
// //           sx={{
// //             marginTop: 0,
// //             display: "flex",
// //             flexDirection: "column",
// //             alignItems: "center",
// //           }}
// //         >
// //           <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
// //             <BusinessIcon />
// //           </Avatar>
// //           <Typography component="h1" variant="h5">
// //             Add new policy
// //           </Typography>
// //           <Box
// //             component="form"
// //             noValidate
// //             onSubmit={handleSubmit}
// //             sx={{ mt: 3 }}
// //           >
// //             <Grid container spacing={2}>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   required
// //                   fullWidth
// //                   id="name"
// //                   label="Policy Name"
// //                   name="name"
// //                   autoComplete="name"
// //                   value={formData.name}
// //                   onChange={handleInputChange}
// //                   error={!!errors.name}
// //                   helperText={errors.name}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   required
// //                   fullWidth
// //                   id="description"
// //                   multiline
// //                   rows={6}
// //                   maxRows={8}
// //                   label="Policy Summary"
// //                   name="description"
// //                   autoComplete="description"
// //                   value={formData.description}
// //                   onChange={handleInputChange}
// //                   error={!!errors.description}
// //                   helperText={errors.description}
// //                 />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <TextField
// //                   required
// //                   fullWidth
// //                   type="number"
// //                   id="reward"
// //                   label="Reward Points"
// //                   name="reward"
// //                   autoComplete="reward"
// //                   value={formData.reward}
// //                   onChange={handleInputChange}
// //                   error={!!errors.reward}
// //                   helperText={errors.reward}
// //                 />
// //                 <span>Select policy document file (.pdf/.docx)</span>
// //                 <input
// //                   type="file"
// //                   accept=".pdf, .docx"
// //                   onChange={handleFileInput}
// //                 />
// //               </Grid>
// //             </Grid>
// //             <Button
// //               type="submit"
// //               fullWidth
// //               variant="contained"
// //               sx={{ mt: 1, mb: 1 }}
// //               disabled={submitting}
// //             >
// //               {submitting ? "Submitting..." : "Create"}
// //             </Button>
// //           </Box>
// //         </Box>
// //       </Container>
// //     </ThemeProvider>
// //   );
// // }


// ///////////////////////////////////////////
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
// import { createCompanyPolicy } from "src/api";
// import { toast } from "react-toastify";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
// import { getDocument } from "pdfjs-dist/legacy/build/pdf";

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

// export default function AddPolicy({ fetchCompanyPolicies }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     reward: "",
//   });
//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const extractTextFromPDF = async (file) => {
//     try {
//       console.log("Starting PDF extraction...");
//       const pdfData = await file.arrayBuffer();
//       console.log("PDF data loaded successfully.");
//       const pdf = await getDocument({ data: pdfData }).promise;
//       console.log("PDF loaded successfully:", pdf);

//       let extractedText = "";
//       for (let i = 1; i <= pdf.numPages; i++) {
//         console.log(`Processing page ${i}`);
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items.map((item) => item.str).join(" ");
//         extractedText += pageText + "\n";
//       }
//       console.log("PDF text extraction completed.");
//       return extractedText.trim();
//     } catch (error) {
//       console.error("Error extracting text from PDF:", error);
//       throw error;
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const { name, description, reward } = formData;

//     // Validate the form data
//     const formErrors = validateForm(name, description, reward);
//     setErrors(formErrors);

//     if (Object.keys(formErrors).length === 0) {
//       if (!selectedFile) {
//         toast.error("Please upload a policy document.");
//         return;
//       }

//       const uploadToastId = toast.info("Uploading file...", { autoClose: false, isLoading: true });

//       try {
//         console.log("Extracting text from PDF...");
//         let extractedText = await extractTextFromPDF(selectedFile);
//         console.log("Extracted Text:", extractedText);

//         // Upload the file to S3
//         console.log("Uploading file to S3...");
//         const docsUrl = await uploadPDFAndGetURL(selectedFile);
//         console.log("File uploaded successfully. Document URL:", docsUrl);

//         toast.dismiss(uploadToastId);

//         // Make API call to create company policy
//         const data = {
//           name: formData.name,
//           description: formData.description,
//           rewardPoints: formData.reward,
//           companyId: storedUserData?.company.id,
//           documentUrl: docsUrl,
//           extractedText: extractedText, // Include extracted text
//         };
//         console.log("Submitting data to the backend:", data);

//         setSubmitting(true);
//         //await createCompanyPolicy(data, storedUserData.token);
//         fetchCompanyPolicies();
//         setSubmitting(false);
//         toast.success("Policy created successfully!");

//         // Reset the form
//         setTimeout(() => {
//           setFormData({
//             name: "",
//             description: "",
//             reward: "",
//           });
//           setSelectedFile(null);
//           window.location.reload();
//         }, 3000);
//       } catch (error) {
//         toast.dismiss(uploadToastId);
//         console.error("Error during file upload or API call:", error);
//         toast.error("Error uploading file or extracting text. Please try again.");
//       }
//     }
//   };

//   const handleFileInput = (e) => {
//     const file = e.target.files[0];
//     if (file.type !== "application/pdf") {
//       toast.error("Invalid file type. Please upload a PDF.");
//       setSelectedFile(null);
//       return;
//     }
//     console.log("File selected:", file);
//     setSelectedFile(file);
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
//             Add new policy
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
//                   label="Policy Name"
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
//                   label="Policy Summary"
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
//                 <span>Select policy document file (.pdf)</span>
//                 <input
//                   type="file"
//                   accept=".pdf"
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
import { createCompanyPolicy } from "src/api";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

// Set the worker source
GlobalWorkerOptions.workerSrc = pdfjsWorker;
console.log("WorkerSrc:", GlobalWorkerOptions.workerSrc);

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

export default function AddPolicy({ fetchCompanyPolicies }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reward: "",
  });
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const extractTextFromPDF = async (file) => {
    try {
      console.log("Starting PDF extraction...");
      const pdfData = await file.arrayBuffer();
      console.log("PDF data loaded successfully.");
      const pdf = await getDocument({ data: pdfData }).promise;
      console.log("PDF loaded successfully:", pdf);

      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        extractedText += pageText + "\n";
      }
      console.log("PDF text extraction completed.");
      return extractedText.trim();
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, reward } = formData;

    // Validate the form data
    const formErrors = validateForm(name, description, reward);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (!selectedFile) {
        toast.error("Please upload a policy document.");
        return;
      }

      const uploadToastId = toast.info("Uploading file...", { autoClose: false, isLoading: true });

      try {
        console.log("Extracting text from PDF...");
        let extractedText = await extractTextFromPDF(selectedFile);
        console.log("Extracted Text:", extractedText);

        // Upload the file to S3
        console.log("Uploading file to S3...");
        const docsUrl = await uploadPDFAndGetURL(selectedFile);
        console.log("File uploaded successfully. Document URL:", docsUrl);

        toast.dismiss(uploadToastId);

        // Make API call to create company policy
        const data = {
          name: formData.name,
          description: formData.description,
          rewardPoints: formData.reward,
          companyId: storedUserData?.company.id,
          documentUrl: docsUrl,
          extractedText: extractedText, // Include extracted text
        };
        console.log("Submitting data to the backend:", data);

        setSubmitting(true);
        await createCompanyPolicy(data, storedUserData.token);
        fetchCompanyPolicies();
        setSubmitting(false);
        toast.success("Policy created successfully!");

        // Reset the form
        setTimeout(() => {
          setFormData({
            name: "",
            description: "",
            reward: "",
          });
          setSelectedFile(null);
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.dismiss(uploadToastId);
        console.error("Error during file upload or API call:", error);
        toast.error("Error uploading file or extracting text. Please try again.");
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Please upload a PDF.");
      setSelectedFile(null);
      return;
    }
    console.log("File selected:", file);
    setSelectedFile(file);
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
            Add new policy
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
                  label="Policy Name"
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
                  label="Policy Summary"
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
                <span>Select policy document file (.pdf)</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                />
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
