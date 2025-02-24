import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  Container,
  Modal,
  Button,
  Box,
  AccordionDetails,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AddPolicy from "src/components/company/policyForm";
import Snackbar from "@mui/material/Snackbar";

import Iconify from "../components/iconify";
import TransitionsModal from "src/components/modal";
import UpdateCompanyPolicy from "src/components/company/UpdateCompanyPolicy";
import { getAllCompanyPolicies, handleDeleteCompanyPolicy } from "src/api";

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

export default function PolicyPage() {
  const [expanded, setExpanded] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editingCardOpen, setEditingCardOpen] = React.useState(false); // State to manage editing card
  const [selectedPolicy, setSelectedPolicy] = React.useState(null);
  const [data, setData] = React.useState(null);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  const handleDelete = async (id) => {
    await handleDeleteCompanyPolicy(id, storedUserData.token);
    fetchCompanyPolicies();

    // Implement your API call here to delete the policy with the given id
    // After successful deletion, you can update your data array or take any other necessary actions
  };

  const handleEdit = (policy) => {
    // Open the editing card and set the selected policy
    setSelectedPolicy(policy);
    setEditingCardOpen(true);
  };

  const fetchCompanyPolicies = async () => {
    const companyData = await getAllCompanyPolicies(
      storedUserData.token,
      storedUserData.company.id
    );
    setData(companyData.data);
  };

  React.useEffect(() => {
    (async () => {
      if (storedUserData.company) {
        fetchCompanyPolicies();
      }
    })();
  }, []);

  const [openedPolicies, setOpenedPolicies] = React.useState({});

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const [openTransition, setOpenTransiton] = React.useState(false);
  const handleOpen = () => setOpenTransiton(true);
  const handleClose = () => setOpenTransiton(false);

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
            Policies <Iconify icon="iconoir:privacy-policy" />
          </Typography>
          <TransitionsModal
            open={openTransition}
            handleClose={handleClose}
            handleOpen={handleOpen}
            title={"Add New policy"}
            component={
              <AddPolicy fetchCompanyPolicies={fetchCompanyPolicies} />
            }
          />
        </Stack>
        {data && (
          <Grid container spacing={0}>
            {data.map((policy) => (
              <Grid item xs={12} sm={6} key={policy.id}>
                <Container maxWidth="md" sx={{ mt: 0 }}>
                  <Accordion
                    sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
                    expanded={expanded === `panel${policy.id}`}
                    onChange={(event, newExpanded) => {
                      setExpanded(newExpanded ? `panel${policy.id}` : false);
                    }}
                  >
                    <AccordionSummary
                      aria-controls={`panel${policy.id}-content`}
                      id={`panel${policy.id}-header`}
                      sx={{
                        backgroundColor:
                          expanded === `panel${policy.id}`
                            ? "#CDFFCD"
                            : "#F0F0F0",
                      }}
                    >
                      <Typography>{policy.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {policy.documentUrl && (
                        <a href={policy.documentUrl} target="_blank">
                          Policy Document
                        </a>
                      )}
                      <Typography>{policy.description}</Typography>
                    </AccordionDetails>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ ml: 2 }}>
                      {" "}
                      Rewards : {policy.rewardPoints}
                    </Typography>
                    <Divider sx={{ mb: 5, marginTop: 2 }} />

                    <Button
                      onClick={() => {
                        // Open the editing card and pass the policy data
                        handleEdit(policy);
                      }}
                      variant="outlined"
                      color="primary"
                      sx={{ ml: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        // Handle delete
                        handleDelete(policy.id);
                      }}
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </Accordion>
                </Container>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>

      {/* Editing Card */}
      <Modal open={editingCardOpen} onClose={() => setEditingCardOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            minWidth: 400,
          }}
        >
          <UpdateCompanyPolicy
            policyData={selectedPolicy}
            setEditingCardOpen={setEditingCardOpen}
            fetchCompanyPolicies={fetchCompanyPolicies}
          />
        </Box>
      </Modal>
    </Card>
  );
}
