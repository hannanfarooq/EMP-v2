// import * as React from "react";
// import { styled } from "@mui/material/styles";
// import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
// import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
// import MuiAccordionSummary, {
//   AccordionSummaryProps,
// } from "@mui/material/AccordionSummary";
// import Alert from "@mui/material/Alert";
// import MuiAccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import { Container } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import AlertTitle from "@mui/material/AlertTitle";

// import Iconify from "../components/iconify";
// import CardContent from "@mui/material/CardContent";
// import TransitionsModal from "src/components/modal";
// import AddPolicy from "src/components/company/policyForm";
// import Snackbar from "@mui/material/Snackbar";
// import {
//   getUserCompanyPolicy,
//   getUserProfile,
//   markPolicyAsRead,
//   updateUserPoints,
// } from "src/api"; // Import your API functions

// const Accordion = styled((props) => (
//   <MuiAccordion disableGutters elevation={0} square {...props} />
// ))(({ theme }) => ({
//   border: `1px solid ${theme.palette.divider}`,
//   "&:not(:last-child)": {
//     borderBottom: 0,
//   },
//   "&:before": {
//     display: "none",
//   },
// }));

// const AccordionSummary = styled((props) => (
//   <MuiAccordionSummary
//     expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
//     {...props}
//   />
// ))(({ theme }) => ({
//   backgroundColor:
//     theme.palette.mode === "dark"
//       ? "rgba(255, 255, 255, .05)"
//       : "rgba(0, 0, 0, .03)",
//   flexDirection: "row-reverse",
//   "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
//     transform: "rotate(90deg)",
//   },
//   "& .MuiAccordionSummary-content": {
//     marginLeft: theme.spacing(1),
//   },
// }));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderTop: "1px solid rgba(0, 0, 0, .125)",
// }));

// export default function UserPolicyPage() {
//   const [expanded, setExpanded] = React.useState("");
//   const [open, setOpen] = React.useState(false);
//   const [data, setData] = React.useState([]);
//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

//   // Use an array to store the IDs of policies that the user has opened
//   const [userOpenedPolicies, setUserOpenedPolicies] = React.useState([]);

//   const fetchUserData = async () => {
//     const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

//     const UserData = await getUserProfile(
//       storedUserData?.user?.id,
//       storedUserData.token
//     );

//     const policies = UserData?.data?.user?.readPolicies
//       ? UserData?.data?.user?.readPolicies
//       : [];
//     setUserOpenedPolicies(policies);
//   };
//   const handleChange = (panel) => (event, newExpanded) => {
//     setExpanded(newExpanded ? panel : false);
//   };

//   const fetchCompanyPolicies = async (company, token) => {
//     const companyData = await getUserCompanyPolicy(token, company.id);
//     setData(companyData.data);
//   };

//   React.useEffect(() => {
//     (async () => {
//       if (storedUserData.company && storedUserData.token) {
//         fetchUserData();
//         fetchCompanyPolicies(storedUserData.company, storedUserData.token);
//       }
//     })();
//   }, []);

//   // Function to handle marking a policy as read
//   const handlePolicyRead = async (policyId, rewardPoints) => {
//     // Make an API call here to mark the policy as read
//     // You need to implement this API call
//     const isPolicyExists = userOpenedPolicies.includes(policyId);
//     if (!isPolicyExists) {
//       // Example:
//       try {
//         // Replace 'markPolicyAsRead' with your API call function
//         // await markPolicyAsRead(policyId);
//         await updateUserPoints(
//           rewardPoints,
//           storedUserData.user.id,
//           policyId,
//           storedUserData.token
//         );
//         // Add the policyId to the userOpenedPolicies array

//         setUserOpenedPolicies([...userOpenedPolicies, policyId]);

//         setOpen(true);
//       } catch (error) {
//         // Handle the error here
//       }
//     }
//   };

//   return (
//     <Card>
//       <Snackbar
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         open={open}
//         autoHideDuration={6000}
//         onClose={() => setOpen(false)}
//       >
//         <Alert
//           onClose={() => setOpen(false)}
//           severity="success"
//           sx={{ width: "100%" }}
//         >
//           You have read the policy! Rewards points increased!
//         </Alert>
//       </Snackbar>
//       <CardContent>
//         <Stack
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           mb={5}
//         >
//           <Typography variant="h4" gutterBottom>
//             Policies2 <Iconify icon="iconoir:privacy-policy" />
//           </Typography>
//         </Stack>
//         <Grid container spacing={0}>
//           <Grid item xs={12} sm={6}>
//             <Container maxWidth="md" sx={{ mt: 0 }}>
//               {data &&
//                 data.map((policy, index) => (
//                   <>
//                     {index % 2 == 0 && (
//                       <Accordion
//                         key={policy.id}
//                         sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
//                         expanded={expanded === `panel${policy.id}`}
//                         onChange={handleChange(`panel${policy.id}`)}
//                       >
//                         <AccordionSummary
//                           aria-controls={`panel${policy.id}-content`}
//                           id={`panel${policy.id}-header`}
//                           sx={{
//                             backgroundColor: userOpenedPolicies.includes(
//                               policy.id
//                             )
//                               ? "#CDFFCD"
//                               : "#F0F0F0",
//                           }}
//                         >
//                           <Typography>{policy.name}</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                           <Typography>{policy.description}</Typography>
//                           {policy.documentUrl && (
//                         <a href={policy.documentUrl} target="_blank">
//                           Policy Document
//                         </a>
//                       )}
//                           <div className="flex w-100 justify-center mt-5">
//                             {userOpenedPolicies.includes(policy.id) ? (
//                               <>
//                                 <div>You read this policy</div>
//                               </>
//                             ) : (
//                               <FormControlLabel
//                                 control={<Checkbox />}
//                                 label=" I have read the policy!"
//                                 value={userOpenedPolicies.includes(policy.id)}
//                                 onChange={() =>
//                                   handlePolicyRead(
//                                     policy.id,
//                                     policy.rewardPoints
//                                   )
//                                 }
//                               />
//                             )}
//                           </div>
//                         </AccordionDetails>
//                       </Accordion>
//                     )}
//                   </>
//                 ))}
//             </Container>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Container maxWidth="md" sx={{ mt: 0 }}>
//               {data &&
//                 data.map((policy, index) => (
//                   <>
//                     {index % 2 !== 0 && (
//                       <Accordion
//                         key={policy.id}
//                         sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
//                         expanded={expanded === `panel${policy.id}`}
//                         onChange={handleChange(`panel${policy.id}`)}
//                       >
//                         <AccordionSummary
//                           aria-controls={`panel${policy.id}-content`}
//                           id={`panel${policy.id}-header`}
//                           sx={{
//                             backgroundColor: userOpenedPolicies.includes(
//                               policy.id
//                             )
//                               ? "#CDFFCD"
//                               : "#F0F0F0",
//                           }}
//                         >
//                           <Typography>{policy.name}</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                           <Typography>{policy.description}</Typography>
//                           {policy.documentUrl && <a href={policy.documentUrl} target="_blank">View Policy Document</a>}
//                           <div className="flex w-100 justify-center mt-5">
//                             {userOpenedPolicies.includes(policy.id) ? (
//                               <>
//                                 <div>You read this policy</div>
//                               </>
//                             ) : (
//                               <FormControlLabel
//                                 control={<Checkbox />}
//                                 label=" I have read the policy!"
//                                 value={userOpenedPolicies.includes(policy.id)}
//                                 onChange={() =>
//                                   handlePolicyRead(
//                                     policy.id,
//                                     policy.rewardPoints
//                                   )
//                                 }
//                               />
//                             )}
//                           </div>
//                         </AccordionDetails>
//                       </Accordion>
//                     )}
//                   </>
//                 ))}
//             </Container>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// }






import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Container, TextField } from "@mui/material"; // Import TextField
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AlertTitle from "@mui/material/AlertTitle";

import Iconify from "../components/iconify";
import CardContent from "@mui/material/CardContent";
import TransitionsModal from "src/components/modal";
import AddPolicy from "src/components/company/policyForm";
import Snackbar from "@mui/material/Snackbar";
import {
  getUserCompanyPolicy,
  getUserProfile,
  markPolicyAsRead,
  updateUserPoints,
} from "src/api"; // Import your API functions

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function UserPolicyPage() {
  const [expanded, setExpanded] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState(""); // Add search query state
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  // Use an array to store the IDs of policies that the user has opened
  const [userOpenedPolicies, setUserOpenedPolicies] = React.useState([]);

  const fetchUserData = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

    const UserData = await getUserProfile(
      storedUserData?.user?.id,
      storedUserData.token
    );

    const policies = UserData?.data?.user?.readPolicies
      ? UserData?.data?.user?.readPolicies
      : [];
    setUserOpenedPolicies(policies);
  };
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const fetchCompanyPolicies = async (company, token) => {
    const companyData = await getUserCompanyPolicy(token, company.id);
    setData(companyData.data);
  };

  React.useEffect(() => {
    (async () => {
      if (storedUserData.company && storedUserData.token) {
        fetchUserData();
        fetchCompanyPolicies(storedUserData.company, storedUserData.token);
      }
    })();
  }, []);

  // Function to handle marking a policy as read
  const handlePolicyRead = async (policyId, rewardPoints) => {
    // Make an API call here to mark the policy as read
    // You need to implement this API call
    const isPolicyExists = userOpenedPolicies.includes(policyId);
    if (!isPolicyExists) {
      // Example:
      try {
        // Replace 'markPolicyAsRead' with your API call function
        // await markPolicyAsRead(policyId);
        await updateUserPoints(
          rewardPoints,
          storedUserData.user.id,
          policyId,
          storedUserData.token
        );
        // Add the policyId to the userOpenedPolicies array

        setUserOpenedPolicies([...userOpenedPolicies, policyId]);

        setOpen(true);
      } catch (error) {
        // Handle the error here
      }
    }
  };

  // Filter policies based on the search query
  const filteredPolicies = data.filter((policy) =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          You have read the policy! Rewards points increased!
        </Alert>
      </Snackbar>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Policies2 <Iconify icon="iconoir:privacy-policy" />
          </Typography>
        </Stack>
        {/* Add the search bar */}
        <TextField
          label="Search Policies"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Container maxWidth="md" sx={{ mt: 0 }}>
              {filteredPolicies &&
                filteredPolicies.map((policy, index) => (
                  <>
                    {index % 2 == 0 && (
                      <Accordion
                        key={policy.id}
                        sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
                        expanded={expanded === `panel${policy.id}`}
                        onChange={handleChange(`panel${policy.id}`)}
                      >
                        <AccordionSummary
                          aria-controls={`panel${policy.id}-content`}
                          id={`panel${policy.id}-header`}
                          sx={{
                            backgroundColor: userOpenedPolicies.includes(
                              policy.id
                            )
                              ? "#CDFFCD"
                              : "#F0F0F0",
                          }}
                        >
                          <Typography>{policy.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{policy.description}</Typography>
                          {policy.documentUrl && (
                        <a href={policy.documentUrl} target="_blank">
                          Policy Document
                        </a>
                      )}
                          <div className="flex w-100 justify-center mt-5">
                            {userOpenedPolicies.includes(policy.id) ? (
                              <>
                                <div>You read this policy</div>
                              </>
                            ) : (
                              <FormControlLabel
                                control={<Checkbox />}
                                label=" I have read the policy!"
                                value={userOpenedPolicies.includes(policy.id)}
                                onChange={() =>
                                  handlePolicyRead(
                                    policy.id,
                                    policy.rewardPoints
                                  )
                                }
                              />
                            )}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </>
                ))}
            </Container>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Container maxWidth="md" sx={{ mt: 0 }}>
              {filteredPolicies &&
                filteredPolicies.map((policy, index) => (
                  <>
                    {index % 2 !== 0 && (
                      <Accordion
                        key={policy.id}
                        sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
                        expanded={expanded === `panel${policy.id}`}
                        onChange={handleChange(`panel${policy.id}`)}
                      >
                        <AccordionSummary
                          aria-controls={`panel${policy.id}-content`}
                          id={`panel${policy.id}-header`}
                          sx={{
                            backgroundColor: userOpenedPolicies.includes(
                              policy.id
                            )
                              ? "#CDFFCD"
                              : "#F0F0F0",
                          }}
                        >
                          <Typography>{policy.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{policy.description}</Typography>
                          {policy.documentUrl && <a href={policy.documentUrl} target="_blank">View Policy Document</a>}
                          <div className="flex w-100 justify-center mt-5">
                            {userOpenedPolicies.includes(policy.id) ? (
                              <>
                                <div>You read this policy</div>
                              </>
                            ) : (
                              <FormControlLabel
                                control={<Checkbox />}
                                label=" I have read the policy!"
                                value={userOpenedPolicies.includes(policy.id)}
                                onChange={() =>
                                  handlePolicyRead(
                                    policy.id,
                                    policy.rewardPoints
                                  )
                                }
                              />
                            )}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </>
                ))}
            </Container>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
