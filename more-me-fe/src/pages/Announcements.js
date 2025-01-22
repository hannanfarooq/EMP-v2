import * as React from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  Container,
  Modal,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  AccordionDetails,
  Switch,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  DialogActions,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AddAnnouncement from "src/components/company/announcementForm";

import Snackbar from "@mui/material/Snackbar";

import Iconify from "../components/iconify";
import TransitionsModal from "src/components/modal";
import UpdateCompanyAnnouncements from "src/components/company/UpdateCompanyAnnouncement";
import { getAllCompanyAnnouncements, getAnnouncementStats, handleDeleteCompanyAnnouncement, toggleVisibility } from "src/api";
import AnswerQuestionModal from "src/components/company/AnswerQuestion-piechart";

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

export default function AccouncmentsPage() {
  const [expanded, setExpanded] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editingCardOpen, setEditingCardOpen] = React.useState(false); // State to manage editing card
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);
  const [data, setData] = React.useState(null);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [showAddAnnouncement, setShowAddAnnouncement] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [stats,setStats]=React.useState([]);
// State for question visibility toggle
const [questionsVisibility, setQuestionsVisibility] = React.useState({});

  const handleDelete = async (id) => {
    await handleDeleteCompanyAnnouncement(id, storedUserData.token);
    fetchCompanyAnnouncements();

    // Implement your API call here to delete the policy with the given id
    // After successful deletion, you can update your data array or take any other necessary actions
  };

  const handleEdit = (announcement) => {
    // Open the editing card and set the selected policy
    setSelectedAnnouncement(announcement);
    setEditingCardOpen(true);
  };
  const handleToggleVisibility = async (announcementId) => {
    try {
      // Toggle the visibility on the backend first
      await toggleVisibility(storedUserData.token, announcementId, !questionsVisibility[announcementId]);
  
      // Then, update the local state for visibility
      setQuestionsVisibility((prevState) => ({
        ...prevState,
        [announcementId]: !prevState[announcementId], // Toggle visibility for the specific announcement
      }));
    await  fetchCompanyAnnouncements();
    } catch (error) {
      console.error("Error toggling visibility:", error);
      // Optionally, show some feedback to the user in case of an error
    }
  };
  const fetchCompanyAnnouncements = async () => {
    const companyData = await getAllCompanyAnnouncements(
      storedUserData.token,
      storedUserData.company.id
    );
    console.log("ANNOUNCEMENT: ",companyData.data);
    setData(companyData.data);
  };

  React.useEffect(() => {
    (async () => {
      if (storedUserData.company) {
        fetchCompanyAnnouncements();
      }
    })();
  }, []);

  const [openedAnnouncements, setOpenedAnnouncements] = React.useState({});

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const [openTransition, setOpenTransiton] = React.useState(false);
  const handleOpen = () => setOpenTransiton(true);
  const handleClose = () => setOpenTransiton(false);

  const handleAddAnnouncementClose = () => {
    setShowAddAnnouncement(false); // Close the AddAnnouncement component
  };

  const handleOpenModal = async(announcement) => {

    const res = await   getAnnouncementStats(announcement.id,storedUserData.token);
    console.log("Announcement Stats: ",res?.data);
    setStats(res?.data);
    setSelectedAnnouncement(announcement);
    setOpenModal(true);
    
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOption(""); // Reset the selected option
  };
  const handleAnswerSubmit = () => {
    // Handle the submission of the answer
    console.log(`Answered question for announcement: ${selectedAnnouncement.name}, selected option: ${selectedOption}`);
    handleCloseModal(); // Close modal after submitting
  };

  return (
    <>
    <Helmet>
        <title>Announcements | More.Me</title>
      </Helmet>
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
          You have read the Announcement! Rewards points increased!
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
            Accouncements
          </Typography>
          <TransitionsModal
            open={openTransition}
            handleClose={handleClose}
            handleOpen={handleOpen} 
            title={"Add New Announcement"}
            component={
              <AddAnnouncement fetchCompanyAnnouncements={fetchCompanyAnnouncements}
              onClose={handleAddAnnouncementClose} // Pass the onClose prop
              />
            }
          />
        </Stack>
        {data && (
  <Grid container spacing={0}>
    {data.map((announcement) => {
      // Parse documentUrls if it's a string
      let documentUrls = [];
      try {
        documentUrls = typeof announcement.documentUrls === "string" 
          ? JSON.parse(announcement.documentUrls) 
          : announcement.documentUrls;
      } catch (error) {
        console.error("Error parsing documentUrls:", error);
      }

      // Set the initial state for questions visibility based on `announcement.isVisible`
      const questionsVisible = announcement.isVisible;

      return (
        <Grid item xs={12} sm={6} key={announcement.id}>
          <Container maxWidth="md" sx={{ mt: 0 }}>
            <Accordion
              sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
              expanded={expanded === `panel${announcement.id}`}
              onChange={(event, newExpanded) => {
                setExpanded(newExpanded ? `panel${announcement.id}` : false);
              }}
            >
          <AccordionSummary
  aria-controls={`panel${announcement.id}-content`}
  id={`panel${announcement.id}-header`}
  sx={{
    backgroundColor:
      expanded === `panel${announcement.id}` ? "#CDFFCD" : "#F0F0F0",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Ensure the width takes up full space
  }}
>
  <Typography>{announcement.name}</Typography>

  {/* Toggle switch for questions visibility */}
  {announcement.questions && announcement.questions.length > 0 && (
    <FormControlLabel
      control={
        <Switch
          checked={questionsVisible}
          onChange={() => handleToggleVisibility(announcement.id)}
          color="primary"
        />
      }
      label="Show Questions"
      labelPlacement="end"
      sx={{ ml: 2, marginLeft: 'auto' }} // Align to the right
    />
  )}
</AccordionSummary>

              <AccordionDetails>
                {announcement.description && (
                  <Typography>{announcement.description}</Typography>
                )}

                {/* Display files */}
                {Array.isArray(documentUrls) && documentUrls.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Attached Documents:</Typography>
                    {documentUrls.map((url, index) => (
                      <Box key={index} sx={{ mt: 1 }}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          Document {index + 1}
                        </a>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Display images */}
                {Array.isArray(announcement.imageUrls) &&
                  announcement.imageUrls.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Attached Images:</Typography>
                      <Grid container spacing={1}>
                        {announcement.imageUrls.map((url, index) => (
                          <Grid item xs={4} key={index}>
                            <img
                              src={url}
                              alt={`Announcement Image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "5px",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                {/* Display questions if visible */}
                {announcement.questions && announcement.questions.length > 0 &&storedUserData.user.role=="company-super-admin"&& (
  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle1">Questions:</Typography>

    {/* Button to answer questions */}
    <Button
    onClick={() => handleOpenModal(announcement)}
      variant="outlined"
      color="primary"
      sx={{ mt: 2 }}
    >
      Show  Respones
    </Button>
  </Box>
)}



  <AnswerQuestionModal
  openModal={openModal}
  handleCloseModal={handleCloseModal}
  selectedAnnouncement={stats}
/>

              </AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              <Typography sx={{ ml: 2 }}>
                Rewards: {announcement.rewardPoints}
              </Typography>
              <Divider sx={{ mb: 5, marginTop: 2 }} />

              <Button
                onClick={() => {
                  // Open the editing card and pass the policy data
                  handleEdit(announcement);
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
                  handleDelete(announcement.id);
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
      );
    })}
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
          <UpdateCompanyAnnouncements
            announcementData={selectedAnnouncement}
            setEditingCardOpen={setEditingCardOpen}
            fetchCompanyAnnouncements={fetchCompanyAnnouncements}
          />
        </Box>
      </Modal>
    </Card>
    </>
  );
}
