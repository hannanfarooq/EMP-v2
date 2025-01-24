// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Container, Button, List, ListItem, ListItemText } from '@mui/material';
// import { styled } from '@mui/system'; // Correct import for Material-UI v5
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { toast } from 'react-toastify';
// import { useTheme } from '@mui/material/styles';
// import SendIcon from '@mui/icons-material/Send';
// import Papa from 'papaparse';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
// import { useAuth } from 'src/context/AuthContext';
// import { inviteBulkUsers } from 'src/api';
// import { FileUpload } from './FileUpload';
// import { getAllCompanyUser } from "src/api";

// // Define the styles
// const Root = styled('div')(({ theme }) => ({
//   cursor: 'pointer',
//   textAlign: 'center',
//   display: 'flex',
//   '&:hover p,&:hover svg,& img': {
//     opacity: 1,
//   },
//   '& p, svg': {
//     opacity: 0.4,
//   },
//   '&:hover img': {
//     opacity: 0.3,
//   },
// }));

// const NoMouseEvent = styled('div')({
//   pointerEvents: 'none',
//   display: 'none',
// });

// const IconText = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   flexDirection: 'column',
//   alignItems: 'center',
//   position: 'absolute',
// });

// const HiddenInput = styled('input')({
//   display: 'none',
// });

// const DuplicateItem = styled(ListItem)({
//   backgroundColor: '#ffdddd', // Light red background for duplicates
// });

// const UniqueItem = styled(ListItem)({
//   backgroundColor: '#ddffdd', // Light green background for unique
// });

// export default function InvitePage() {
//   const { userData } = useAuth();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [fetchedUsers, setFetchedUsers] = useState([]);
//   const [duplicates, setDuplicates] = useState([]);
//   const [uniqueUsers, setUniqueUsers] = useState([]);

//   const fileUploadProp = {
//     accept: '.csv',
//     onChange: (event) => {
//       if (event.target.files !== null && event.target.files.length > 0) {
//         Papa.parse(event.target.files[0], {
//           header: true,
//           complete: (result) => {
//             const users = result.data
//               .map((user) => ({
//                 email: user.email?.trim() || '',
//                 role: user.role?.trim() || '',
//                 firstName: user.firstName?.trim() || '',
//                 lastName: user.lastName?.trim() || '',
//               }))
//               .filter(
//                 (user) =>
//                   user.email &&
//                   user.role &&
//                   user.firstName &&
//                   user.lastName
//               );

//             setFetchedUsers(users);
//           },
//         });
//       }
//     },
//     onDrop: (event) => {
//       console.log(`Drop ${event.dataTransfer.files[0].name}`);
//     },
//   };

//   const handleInviteUsers = async () => {
//     console.log("Fetched Users:", fetchedUsers);

//     // Retrieve the current user's data from local storage
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     const companyData = await getAllCompanyUser(
//       currentUser.token,
//       currentUser.company.id
//     );
//     console.log("Company Data:", companyData);

//     const companyEmails = companyData.data.map((user) => user.email);
//     const duplicatesList = [];
//     const uniqueList = [];

//     fetchedUsers.forEach((user) => {
//       if (companyEmails.includes(user.email)) {
//         duplicatesList.push(user);
//       } else {
//         uniqueList.push(user);
//       }
//     });

//     setDuplicates(duplicatesList);
//     setUniqueUsers(uniqueList);

//     console.log("Duplicates:", duplicatesList);
//     console.log("Unique Users:", uniqueList);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Invite | More.Me</title>
//       </Helmet>

//       <Container maxWidth="xl">
//         <Typography variant="h4" sx={{ mb: 5 }}>
//           Send Invites by CSV
//         </Typography>

//         {fetchedUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 5 }}>
//               Fetched {fetchedUsers.length} users from the uploaded CSV
//             </Typography>

//             <Button
//               onClick={handleInviteUsers}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Compare Emails
//             </Button>
//           </>
//         )}

//         {fetchedUsers.length === 0 && <FileUpload width="100%" {...fileUploadProp} />}

//         {duplicates.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'red' }}>
//               Duplicate Emails Found:
//             </Typography>
//             <List>
//               {duplicates.map((user, index) => (
//                 <DuplicateItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </DuplicateItem>
//               ))}
//             </List>
//           </>
//         )}

//         {uniqueUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
//               Unique Emails to be Invited:
//             </Typography>
//             <List>
//               {uniqueUsers.map((user, index) => (
//                 <UniqueItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </UniqueItem>
//               ))}
//             </List>
//             <Button
//               onClick={async () => {
//                 try {
//                   const data = await inviteBulkUsers(userData.token, uniqueUsers);
//                   if (data) {
//                     toast.success('🦄 Invites sent successfully!');
//                     navigate('/dashboard/app');
//                   }
//                 } catch (error) {
//                   console.error('Error sending invites:', error);
//                 }
//               }}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Send Invites
//             </Button>
//           </>
//         )}
//       </Container>
//     </>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Container, Button, List, ListItem, ListItemText } from '@mui/material';
// import { styled } from '@mui/system'; // Correct import for Material-UI v5
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { toast } from 'react-toastify';
// import { useTheme } from '@mui/material/styles';
// import SendIcon from '@mui/icons-material/Send';
// import Papa from 'papaparse';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
// import { useAuth } from 'src/context/AuthContext';
// import { inviteBulkUsers } from 'src/api';
// import { FileUpload } from './FileUpload';
// import { getAllCompanyUser } from "src/api";

// // Define the styles
// const Root = styled('div')(({ theme }) => ({
//   cursor: 'pointer',
//   textAlign: 'center',
//   display: 'flex',
//   '&:hover p,&:hover svg,& img': {
//     opacity: 1,
//   },
//   '& p, svg': {
//     opacity: 0.4,
//   },
//   '&:hover img': {
//     opacity: 0.3,
//   },
// }));

// const NoMouseEvent = styled('div')({
//   pointerEvents: 'none',
//   display: 'none',
// });

// const IconText = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   flexDirection: 'column',
//   alignItems: 'center',
//   position: 'absolute',
// });

// const HiddenInput = styled('input')({
//   display: 'none',
// });

// const DuplicateItem = styled(ListItem)({
//   backgroundColor: '#ffdddd', // Light red background for duplicates
// });

// const UniqueItem = styled(ListItem)({
//   backgroundColor: '#ddffdd', // Light green background for unique
// });

// export default function InvitePage() {
//   const { userData } = useAuth();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [fetchedUsers, setFetchedUsers] = useState([]);
//   const [duplicates, setDuplicates] = useState([]);
//   const [uniqueUsers, setUniqueUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: 'user', // Default role
//   });

//   const fileUploadProp = {
//     accept: '.csv',
//     onChange: (event) => {
//       if (event.target.files !== null && event.target.files.length > 0) {
//         Papa.parse(event.target.files[0], {
//           header: true,
//           complete: (result) => {
//             const users = result.data
//               .map((user) => ({
//                 email: user.email?.trim() || '',
//                 role: user.role?.trim() || '',
//                 firstName: user.firstName?.trim() || '',
//                 lastName: user.lastName?.trim() || '',
//               }))
//               .filter(
//                 (user) =>
//                   user.email &&
//                   user.role &&
//                   user.firstName &&
//                   user.lastName
//               );

//             setFetchedUsers(users);
//           },
//         });
//       }
//     },
//     onDrop: (event) => {
//       console.log(`Drop ${event.dataTransfer.files[0].name}`);
//     },
//   };

//   const handleInviteUsers = async () => {
//     console.log("Fetched Users:", fetchedUsers);

//     // Retrieve the current user's data from local storage
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     const companyData = await getAllCompanyUser(
//       currentUser.token,
//       currentUser.company.id
//     );
//     console.log("Company Data:", companyData);

//     const companyEmails = companyData.data.map((user) => user.email);
//     const duplicatesList = [];
//     const uniqueList = [];

//     fetchedUsers.forEach((user) => {
//       if (companyEmails.includes(user.email)) {
//         duplicatesList.push(user);
//       } else {
//         uniqueList.push(user);
//       }
//     });

//     setDuplicates(duplicatesList);
//     setUniqueUsers(uniqueList);

//     console.log("Duplicates:", duplicatesList);
//     console.log("Unique Users:", uniqueList);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Invite | Hr.System</title>
//       </Helmet>

//       <Container maxWidth="xl">
//         <Typography variant="h4" sx={{ mb: 5 }}>
//           Send Invites by CSV
//         </Typography>

//         {fetchedUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 5 }}>
//               Fetched {fetchedUsers.length} users from the uploaded CSV
//             </Typography>

//             <Button
//               onClick={handleInviteUsers}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Compare Emails
//             </Button>
//           </>
//         )}

//         {fetchedUsers.length === 0 && <FileUpload width="100%" {...fileUploadProp} />}

//         {duplicates.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'red' }}>
//               Duplicate Emails Found:
//             </Typography>
//             <List>
//               {duplicates.map((user, index) => (
//                 <DuplicateItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </DuplicateItem>
//               ))}
//             </List>
//           </>
//         )}

//         {uniqueUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
//               Unique Emails to be Invited:
//             </Typography>
//             <List>
//               {uniqueUsers.map((user, index) => (
//                 <UniqueItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </UniqueItem>
//               ))}
//             </List>
//             <Button
//               onClick={async () => {
//                 try {
//                   const data = await inviteBulkUsers(userData.token, uniqueUsers);
//                   if (data) {
//                     toast.success('🦄 Invites sent successfully!');
//                     navigate('/dashboard/app');
//                   }
//                 } catch (error) {
//                   console.error('Error sending invites:', error);
//                 }
//               }}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Send Invites
//             </Button>
//           </>
//         )}
//       </Container>
//     </>
//   );
// }

// import React, { useState } from 'react';
// import {
//   Typography,
//   Container,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   MenuItem,
// } from '@mui/material';
// import { styled } from '@mui/system';
// import AddIcon from '@mui/icons-material/Add';
// import SendIcon from '@mui/icons-material/Send';
// import { toast } from 'react-toastify';
// import Papa from 'papaparse';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
// import { useAuth } from 'src/context/AuthContext';
// import { inviteBulkUsers, getAllCompanyUser } from 'src/api';
// import { FileUpload } from './FileUpload';
// import { Grid } from "@mui/material";

// // Define the styles
// // const Root = styled('div')(({ theme }) => ({
// //   cursor: 'pointer',
// //   textAlign: 'center',
// //   display: 'flex',
// //   '&:hover p,&:hover svg,& img': {
// //     opacity: 1,
// //   },
// //   '& p, svg': {
// //     opacity: 0.4,
// //   },
// //   '&:hover img': {
// //     opacity: 0.3,
// //   },
// // }));

// const DuplicateItem = styled(ListItem)({
//   backgroundColor: '#ffdddd',
// });

// const UniqueItem = styled(ListItem)({
//   backgroundColor: '#ddffdd',
// });

// export default function InvitePage() {
//   const { userData } = useAuth();
//   const navigate = useNavigate();
//   const [fetchedUsers, setFetchedUsers] = useState([]);
//   const [duplicates, setDuplicates] = useState([]);
//   const [uniqueUsers, setUniqueUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: 'user',
//   });

//   // File upload properties
//   const fileUploadProp = {
//     accept: '.csv',
//     onChange: (event) => {
//       if (event.target.files && event.target.files.length > 0) {
//         Papa.parse(event.target.files[0], {
//           header: true,
//           complete: (result) => {
//             const users = result.data
//               .map((user) => ({
//                 email: user.email?.trim() || '',
//                 role: user.role?.trim() || '',
//                 firstName: user.firstName?.trim() || '',
//                 lastName: user.lastName?.trim() || '',
//               }))
//               .filter((user) => user.email && user.role && user.firstName && user.lastName);

//             setFetchedUsers(users);
//           },
//         });
//       }
//     },
//     onDrop: (event) => {
//       console.log(`Drop ${event.dataTransfer.files[0].name}`);
//     },
//   };

//   // Modal functions
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // const handleAddUser = async () => {
//   //   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//   //   const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
//   //   const companyEmails = companyData.data.map((user) => user.email);
  
//   //   // Check if the email already exists in the fetchedUsers list or company data
//   //   const isDuplicate = fetchedUsers.some((user) => user.email === formData.email) || companyEmails.includes(formData.email);
  
//   //   if (isDuplicate) {
//   //     toast.error('This email already exists. Please enter a unique email.');
//   //     return;
//   //   }
  
//   //   if (formData.email && formData.firstName && formData.lastName && formData.role) {
//   //     // Add the user to fetchedUsers state if it's not a duplicate
//   //     setFetchedUsers((prevUsers) => [...prevUsers, formData]);
//   //     setFormData({
//   //       firstName: '',
//   //       lastName: '',
//   //       email: '',
//   //       role: 'user',
//   //     });
//   //     // handleClose();
//   //     try {
//   //       const data = await inviteBulkUsers(userData.token, uniqueUsers);
//   //       if (data) {
//   //         console.log("data", data);
//   //         toast.success('🦄 Invite sent successfully!');
//   //         navigate('/dashboard/app');
//   //       }
//   //     } catch (error) {
//   //       console.error('Error sending invites:', error);
//   //     }
//   //   } else {
//   //     toast.error('Please fill in all fields.');
//   //   }
//   // };
//   const handleAddUser = async () => {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
//     const companyEmails = companyData.data.map((user) => user.email);
  
//     // Check if the email already exists in the fetchedUsers list or company data
//     const isDuplicate = fetchedUsers.some((user) => user.email === formData.email) || companyEmails.includes(formData.email);
  
//     if (isDuplicate) {
//       toast.error('This email already exists. Please enter a unique email.');
//       return;
//     }
  
//     if (formData.email && formData.firstName && formData.lastName && formData.role) {
//       // Add the user to fetchedUsers state if it's not a duplicate
//       setFetchedUsers((prevUsers) => [...prevUsers, formData]);
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         role: 'user',
//       });
  
//       try {
//         // Send the formData directly instead of uniqueUsers
//         const response = await inviteBulkUsers(userData.token, [formData]);
//         console.log("Response Data:", response);
  
//         if (response && response.success) {
//           toast.success('🦄 Invite sent successfully!');
//           navigate('/dashboard/app');
//         } else {
//           toast.error('Failed to send invite. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error sending invites:', error);
//         toast.error('An error occurred while sending the invite.');
//       }
//     } else {
//       toast.error('Please fill in all fields.');
//     }
//   };
  
//   const handleInviteUsers = async () => {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
//     const companyEmails = companyData.data.map((user) => user.email);
//     const duplicatesList = [];
//     const uniqueList = [];

//     fetchedUsers.forEach((user) => {
//       if (companyEmails.includes(user.email)) {
//         duplicatesList.push(user);
//       } else {
//         uniqueList.push(user);
//       }
//     });

//     setDuplicates(duplicatesList);
//     setUniqueUsers(uniqueList);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Invite | Hr.System</title>
//       </Helmet>

//       <Container maxWidth="xl">
//       <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
//         <Typography variant="h4">Send Invites by CSV</Typography>
//         <Button
//           onClick={handleClickOpen}
//           size="large"
//           variant="contained"
//           startIcon={<AddIcon />}
//           sx={{ marginLeft: '20px' }}
//         >
//           Add User
//         </Button>
//       </Grid>
//         {fetchedUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 5 }}>
//               Fetched {fetchedUsers.length} users from the uploaded CSV
//             </Typography>

//             <Button
//               onClick={handleInviteUsers}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Compare Emails
//             </Button>
//           </>
//         )}

//         {fetchedUsers.length === 0 && <FileUpload width="100%" {...fileUploadProp} />}

//         {duplicates.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'red' }}>
//               Duplicate Emails Found:
//             </Typography>
//             <List>
//               {duplicates.map((user, index) => (
//                 <DuplicateItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </DuplicateItem>
//               ))}
//             </List>
//           </>
//         )}

//         {uniqueUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
//               Unique Emails to be Invited:
//             </Typography>
//             <List>
//               {uniqueUsers.map((user, index) => (
//                 <UniqueItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </UniqueItem>
//               ))}
//             </List>
//             <Button
//               onClick={async () => {
//                 try {
//                   const data = await inviteBulkUsers(userData.token, uniqueUsers);
//                   if (data) {
//                     toast.success('🦄 Invites sent successfully!');
//                     navigate('/dashboard/app');
//                   }
//                 } catch (error) {
//                   console.error('Error sending invites:', error);
//                 }
//               }}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Send Invites
//             </Button>
//           </>
//         )}

//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//           <DialogTitle>Add User</DialogTitle>
//           <DialogContent>
//             <TextField label="First Name" name="firstName" fullWidth margin="dense" value={formData.firstName} onChange={handleChange} />
//             <TextField label="Last Name" name="lastName" fullWidth margin="dense" value={formData.lastName} onChange={handleChange} />
//             <TextField label="Email" name="email" type="email" fullWidth margin="dense" value={formData.email} onChange={handleChange} />
//             <TextField label="Role" name="role" select fullWidth margin="dense" value={formData.role} onChange={handleChange}>
//               <MenuItem value="admin">Admin</MenuItem>
//               <MenuItem value="user">User</MenuItem>
//             </TextField>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={handleAddUser} variant="contained">Add</Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </>
//   );
// }


// import React, { useState } from 'react';
// import {
//   Typography,
//   Container,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   MenuItem,
// } from '@mui/material';
// import { styled } from '@mui/system';
// import AddIcon from '@mui/icons-material/Add';
// import SendIcon from '@mui/icons-material/Send';
// import { toast } from 'react-toastify';
// import Papa from 'papaparse';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
// import { useAuth } from 'src/context/AuthContext';
// import { inviteBulkUsers, getAllCompanyUser } from 'src/api';
// import { FileUpload } from './FileUpload';
// import { Grid } from "@mui/material";

// const DuplicateItem = styled(ListItem)({
//   backgroundColor: '#ffdddd',
// });

// const UniqueItem = styled(ListItem)({
//   backgroundColor: '#ddffdd',
// });

// export default function InvitePage() {
//   const { userData } = useAuth();
//   const navigate = useNavigate();
//   const [fetchedUsers, setFetchedUsers] = useState([]);
//   const [duplicates, setDuplicates] = useState([]);
//   const [uniqueUsers, setUniqueUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: 'user',
//   });

//   // File upload properties
//   const fileUploadProp = {
//     accept: '.csv',
//     onChange: (event) => {
//       if (event.target.files && event.target.files.length > 0) {
//         Papa.parse(event.target.files[0], {
//           header: true,
//           complete: (result) => {
//             const users = result.data
//               .map((user) => ({
//                 email: user.email?.trim() || '',
//                 role: user.role?.trim() || '',
//                 firstName: user.firstName?.trim() || '',
//                 lastName: user.lastName?.trim() || '',
//               }))
//               .filter((user) => user.email && user.role && user.firstName && user.lastName);

//             setFetchedUsers(users);
//           },
//         });
//       }
//     },
//     onDrop: (event) => {
//       console.log(`Drop ${event.dataTransfer.files[0].name}`);
//     },
//   };

//   // Modal functions
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleAddUser = async () => {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
//     const companyEmails = companyData.data.map((user) => user.email);
  
//     // Check if the email already exists in the fetchedUsers list or company data
//     const isDuplicate = fetchedUsers.some((user) => user.email === formData.email) || companyEmails.includes(formData.email);
  
//     if (isDuplicate) {
//       toast.error('This email already exists. Please enter a unique email.');
//       return;
//     }
  
//     if (formData.email && formData.firstName && formData.lastName && formData.role) {
//       // Add the user to fetchedUsers state if it's not a duplicate
//       setFetchedUsers((prevUsers) => [...prevUsers, formData]);
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         role: 'user',
//       });
  
//       try {
//         // Send the formData directly instead of uniqueUsers
//         const response = await inviteBulkUsers(userData.token, [formData]);
//         console.log("Response Data:", response);
  
//         if (response && response.success) {
//           toast.success('🦄 Invite sent successfully!');
//           navigate('/dashboard/app');
//         } else {
//           toast.error('Failed to send invite. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error sending invites:', error);
//         toast.error('An error occurred while sending the invite.');
//       }
//     } else {
//       toast.error('Please fill in all fields.');
//     }
//   };
  
//   const handleInviteUsers = async () => {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
//     const companyEmails = companyData.data.map((user) => user.email);
//     const duplicatesList = [];
//     const uniqueList = [];

//     fetchedUsers.forEach((user) => {
//       if (companyEmails.includes(user.email)) {
//         duplicatesList.push(user);
//       } else {
//         uniqueList.push(user);
//       }
//     });

//     setDuplicates(duplicatesList);
//     setUniqueUsers(uniqueList);
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Invite | Hr.System</title>
//       </Helmet>

//       <Container maxWidth="xl">
//       <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
//         <Typography variant="h4">Send Invites by CSV</Typography>
//         <Button
//           onClick={handleClickOpen}
//           size="large"
//           variant="contained"
//           startIcon={<AddIcon />}
//           sx={{ marginLeft: '20px' }}
//         >
//           Add User
//         </Button>
//       </Grid>
//         {fetchedUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 5 }}>
//               Fetched {fetchedUsers.length} users from the uploaded CSV
//             </Typography>

//             <Button
//               onClick={handleInviteUsers}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Compare Emails
//             </Button>
//           </>
//         )}

//         {fetchedUsers.length === 0 && <FileUpload width="100%" {...fileUploadProp} />}

//         {duplicates.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'red' }}>
//               Duplicate Emails Found:
//             </Typography>
//             <List>
//               {duplicates.map((user, index) => (
//                 <DuplicateItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </DuplicateItem>
//               ))}
//             </List>
//           </>
//         )}

//         {uniqueUsers.length > 0 && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
//               Unique Emails to be Invited:
//             </Typography>
//             <List>
//               {uniqueUsers.map((user, index) => (
//                 <UniqueItem key={index}>
//                   <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
//                 </UniqueItem>
//               ))}
//             </List>
//             <Button
//               onClick={async () => {
//                 try {
//                   const data = await inviteBulkUsers(userData.token, uniqueUsers);
//                   if (data) {
//                     toast.success('🦄 Invites sent successfully!');
//                     navigate('/dashboard/app');
//                   }
//                 } catch (error) {
//                   console.error('Error sending invites:', error);
//                 }
//               }}
//               size="large"
//               variant="contained"
//               endIcon={<SendIcon />}
//               sx={{ margin: '20px', float: 'right' }}
//             >
//               Send Invites
//             </Button>
//           </>
//         )}

//         <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//           <DialogTitle>Add User</DialogTitle>
//           <DialogContent>
//             <TextField label="First Name" name="firstName" fullWidth margin="dense" value={formData.firstName} onChange={handleChange} />
//             <TextField label="Last Name" name="lastName" fullWidth margin="dense" value={formData.lastName} onChange={handleChange} />
//             <TextField label="Email" name="email" type="email" fullWidth margin="dense" value={formData.email} onChange={handleChange} />
//             <TextField label="Role" name="role" select fullWidth margin="dense" value={formData.role} onChange={handleChange}>
//               <MenuItem value="admin">Admin</MenuItem>
//               <MenuItem value="user">User</MenuItem>
//             </TextField>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={handleAddUser} variant="contained">Add</Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </>
//   );
// }


import React, { useState } from 'react';
import {
  Typography,
  Container,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from 'src/context/AuthContext';
import { inviteBulkUsers, getAllCompanyUser, GetAllCompaniesForCompanyAdmin } from 'src/api';
import { FileUpload } from './FileUpload';
import { Grid } from "@mui/material";

const DuplicateItem = styled(ListItem)({
  backgroundColor: '#ffdddd',
});

const UniqueItem = styled(ListItem)({
  backgroundColor: '#ddffdd',
});

export default function InvitePage() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [showCompare, setShowCompare] = useState(true); // Toggles Compare and Close buttons
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
  });

  const fileUploadProp = {
    accept: '.csv',
    onChange: (event) => {
      if (event.target.files && event.target.files.length > 0) {
        Papa.parse(event.target.files[0], {
          header: true,
          complete: (result) => {
            const users = result.data
              .map((user) => ({
                email: user.email?.trim() || '',
                role: user.role?.trim() || '',
                firstName: user.firstName?.trim() || '',
                lastName: user.lastName?.trim() || '',
              }))
              .filter((user) => user.email && user.role && user.firstName && user.lastName);

            setFetchedUsers(users);
          },
        });
      }
    },
    onDrop: (event) => {
      console.log(`Drop ${event.dataTransfer.files[0].name}`);
    },
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
    const companyEmails = companyData.data.map((user) => user.email);

    const data = await GetAllCompaniesForCompanyAdmin(userData.token);
    // Access the `data` array from `companyAllData`
    const companies = data.data; // Extract the array from the response
    var count;
    // Check if data exists and is an array
    if (Array.isArray(companyData.data)) {
      count = companyData.data.length;
      console.log("Count of companyData:", count);
    } else {
      console.log("companyData.data is not an array or doesn't exist.");
    }
  // Use `.find()` to find the matching company
      const matchingCompany = companies.find(
          (company) => company.id === currentUser.company.id
      );

    // Check if a matching company is found
    if (matchingCompany) {
        console.log("Matching Company:", matchingCompany);
        console.log(matchingCompany.userLimit);
    } else {
        console.log("No matching company found.");
    }
  
    const isDuplicate = fetchedUsers.some((user) => user.email === formData.email) || companyEmails.includes(formData.email);
    if (count > matchingCompany.userLimit){
      toast.error('User limit exceed.');
      return;
    }
    if (isDuplicate) {
      toast.error('This email already exists. Please enter a unique email.');
      return;
    }
  
    if (formData.email && formData.firstName && formData.lastName && formData.role) {
      setFetchedUsers((prevUsers) => [...prevUsers, formData]);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
      });
  
      try {
        const response = await inviteBulkUsers(userData.token, [formData]);
        console.log("Response Data:", response);
  
        if (response && response.success) {
          toast.success('🦄 Invite sent successfully!');
          //window.location.href()
          navigate("/dashboard/user");

        } else {
          toast.error('Failed to send invite. Please try again.');
        }
      } catch (error) {
        console.error('Error sending invites:', error);
        toast.error('An error occurred while sending the invite.');
      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };
  
  const handleInviteUsers = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
    const companyEmails = companyData.data.map((user) => user.email);
    const duplicatesList = [];
    const uniqueList = [];

    fetchedUsers.forEach((user) => {
      if (companyEmails.includes(user.email)) {
        duplicatesList.push(user);
      } else {
        uniqueList.push(user);
      }
    });

    setDuplicates(duplicatesList);
    setUniqueUsers(uniqueList);
    setShowCompare(false); // Switch to Close button
  };

  const handleReset = () => {
    setFetchedUsers([]);
    setDuplicates([]);
    setUniqueUsers([]);
    setShowCompare(true); // Reset to Compare button
  };

  return (
    <>
      <Helmet>
        <title>Invite | Hr.System</title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <Typography variant="h4">Send Invites by CSV</Typography>
          <Button
            onClick={handleClickOpen}
            size="large"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ marginLeft: '20px' }}
          >
            Add User
          </Button>
          {fetchedUsers.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 5 }}>
              Fetched {fetchedUsers.length} users from the uploaded CSV
            </Typography>

            {showCompare ? (
              <Button
                onClick={handleInviteUsers}
                size="large"
                variant="contained"
                endIcon={<SendIcon />}
                sx={{ margin: '20px', float: 'right' }}
              >
                Compare Emails
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                size="large"
                variant="outlined"
                sx={{ margin: '20px', float: 'right' }}
              >
                Close
              </Button>
            )}
          </>
        )}
        </Grid>

        {fetchedUsers.length === 0 && <FileUpload width="100%" {...fileUploadProp} />}

        {duplicates.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: 'red' }}>
              Duplicate Emails Found:
            </Typography>
            <List>
              {duplicates.map((user, index) => (
                <DuplicateItem key={index}>
                  <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
                </DuplicateItem>
              ))}
            </List>
          </>
        )}

        {uniqueUsers.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
              Unique Emails to be Invited:
            </Typography>
            <List>
              {uniqueUsers.map((user, index) => (
                <UniqueItem key={index}>
                  <ListItemText primary={`Email: ${user.email}, First Name: ${user.firstName}, Last Name: ${user.lastName}`} />
                </UniqueItem>
              ))}
            </List>
            <Button
  onClick={async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const companyData = await getAllCompanyUser(currentUser.token, currentUser.company.id);
      const data1 = await GetAllCompaniesForCompanyAdmin(userData.token);

      // Correct this line to use data1 instead of data
      const companies = data1.data; // Extract the array from the response

      var count;
      if (Array.isArray(companyData.data)) {
        count = companyData.data.length;
        console.log("Count of companyData:", count);
      } else {
        console.log("companyData.data is not an array or doesn't exist.");
      }

      const matchingCompany = companies.find(
        (company) => company.id === currentUser.company.id
      );

      if (matchingCompany) {
        console.log("Matching Company:", matchingCompany);
        console.log(matchingCompany.userLimit);
      } else {
        console.log("No matching company found.");
      }

      if (count > matchingCompany.userLimit) {
        toast.error('User limit exceed.');
        return;
      }

      const response = await inviteBulkUsers(userData.token, uniqueUsers); // Ensure 'data' is replaced with 'response'
      if (response) {
        toast.success('🦄 Invites sent successfully!');
        navigate('/dashboard/user');
      }
    } catch (error) {
      console.error('Error sending invites:', error);
    }
  }}
  size="large"
  variant="contained"
  endIcon={<SendIcon />}
  sx={{ margin: '20px', float: 'right' }}
>
  Send Invites
</Button>

          </>
        )}

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <TextField label="First Name" name="firstName" fullWidth margin="dense" value={formData.firstName} onChange={handleChange} />
            <TextField label="Last Name" name="lastName" fullWidth margin="dense" value={formData.lastName} onChange={handleChange} />
            <TextField label="Email" name="email" type="email" fullWidth margin="dense" value={formData.email} onChange={handleChange} />
            <TextField label="Role" name="role" select fullWidth margin="dense" value={formData.role} onChange={handleChange}>
              {/* <MenuItem value="admin">Admin</MenuItem> */}
              <MenuItem value="user">User</MenuItem>
              {/* <MenuItem value="hr">Hr</MenuItem>  */}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddUser} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
