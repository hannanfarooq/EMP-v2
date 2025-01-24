import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Container, TextField,Box,Dialog,
  DialogTitle, 
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  DialogActions,
 } from "@mui/material"; // Import TextField
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
import AddAnnouncement from "src/components/company/announcementForm";
import Snackbar from "@mui/material/Snackbar";
import {
  getCompanyAnnouncement,
  getResponsesByUserId,
  getUserProfile,
  markAnnouncementAsRead,
  saveAnswers,
  updateUserPoints,
} from "src/api"; // Import your API functions
import { toast } from "react-toastify";

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

export default function UserAnnouncementPage() {
  const [expanded, setExpanded] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState(""); // Add search query state
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);
   const [openModal, setOpenModal] = React.useState(false);
   const [selectedAnswers, setSelectedAnswers] = React.useState({});
  // Use an array to store the IDs of policies that the user has opened
  const [userOpenedAnnouncements, setUserOpenedAnnouncements] = React.useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const[selectedOption,setSelectedOption]=React.useState("");
  const [alreadyanswer,setAlreadyAnswer]=React.useState(null);

  const fetchUserData = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

    const UserData = await getUserProfile(
      storedUserData?.user?.id,
      storedUserData.token
    );

    const announcements = UserData?.data?.user?.readAnnouncements
      ? UserData?.data?.user?.readAnnouncements
      : [];
    setUserOpenedAnnouncements(announcements);
  };
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  const handleOptionChange = (e, questionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: e.target.value, // Save the selected option for this question
    });
  };

  const fetchCompanyAnnouncements = async (company, token) => {
    const companyData = await getCompanyAnnouncement(token, company.id);
    console.log("ANNOUCEMENT : ",companyData.data);
    setData(companyData.data);
  };

  React.useEffect(()=>
  {

  },[]);

  const fetchAnswers = async () => {
    try {
      const res = await getResponsesByUserId(storedUserData.user.id, storedUserData.token);
      console.log("ALREADY SUBMIT:", res);
  
      if (res?.code === 200) {
        setAlreadyAnswer(res.data);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };
  React.useEffect(() => {
    (async () => {
      if (storedUserData.company && storedUserData.token) {
        fetchUserData();
        fetchCompanyAnnouncements(storedUserData.company, storedUserData.token);
      }
     
      
    }
   
  )();
    
  }, []);


  React.useEffect(()=>
  {
    fetchAnswers();
  },[])
  // Function to handle marking a announcement as read
  const handleAnnouncementRead = async (announcementId, rewardPoints) => {
    // Make an API call here to mark the announcement as read
    // You need to implement this API call
    const isAnnouncementExists = userOpenedAnnouncements.includes(announcementId);
    if (!isAnnouncementExists) {
      // Example:
      try {
        // Replace 'markannouncementAsRead' with your API call function
        // await markannouncementAsRead(announcementId);
        await updateUserPoints(
          rewardPoints,
          storedUserData.user.id,
          announcementId,
          storedUserData.token
        );
        // Add the announcementId to the userOpenedPolicies array

        setUserOpenedAnnouncements([...userOpenedAnnouncements, announcementId]);

        setOpen(true);
      } catch (error) {
        // Handle the error here
      }
    }
  };

  // Filter policies based on the search query
  const filteredAnnouncements = data.filter((announcement) =>
    announcement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  announcement.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = async(announcement, alreadyAnswer) => {
    if (!Array.isArray(announcement?.questions)) {
      toast.error("Error: Announcement questions are not available.");
      return;
    }
    let awnse=[];
    const res = await getResponsesByUserId(storedUserData.user.id, storedUserData.token);
if(res?.code==200)
{
  awnse=res.data;
}
    const announcementQuestionIds = announcement.questions.map((question) => question.id);
  
    // Check if all questions are answered
    const allAnswered = announcementQuestionIds.every((questionId) =>
      awnse.some((answer) => answer.questionId == questionId)
    );
  
    if (allAnswered) {
      toast.error("All questions for this announcement are already answered.");
      return;
    }
  
    setSelectedAnnouncement(announcement);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOption(""); // Reset the selected option
  };
  const handleAnswerSubmit = async() => {
    // Log the answers in a more readable format
    console.log(`Answered questions for announcement: ${selectedAnnouncement.name}`);
  const res= await saveAnswers(selectedAnswers,storedUserData.user.id,storedUserData.token)
  if(res?.code==200)
  {
    toast.success("Awnser Submit Succesfully");
    handleCloseModal();
  }
   
  
 
    // Close the modal after submitting the answers
   
  };
  const handleNextQuestion = () => {
    if (selectedAnswers[selectedAnnouncement.questions[currentQuestionIndex].id]) {
      if (currentQuestionIndex < selectedAnnouncement.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleAnswerSubmit(selectedAnswers); // Submit all answers when done
      }
    } else {
      alert("Please answer the question before moving to the next one.");
    }
  };

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
          You have read the announcement! Rewards points increased!
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
          Announcement <Iconify icon="iconoir:privacy-announcement" />
          </Typography>
        </Stack>
        {/* Add the search bar */}
        <TextField
          label="Search Announcements"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
     <Grid container spacing={0}>
  <Grid item xs={12} sm={6}>
    <Container maxWidth="md" sx={{ mt: 0 }}>
      {filteredAnnouncements &&
        filteredAnnouncements.length > 0 &&
        filteredAnnouncements.map((announcement, index) => {
          let documentUrls = [];
          try {
            // Check if documentUrls is a string or array
            documentUrls = typeof announcement.documentUrls === "string"
              ? JSON.parse(announcement.documentUrls)
              : announcement.documentUrls;
          } catch (error) {
            console.error("Error parsing documentUrls:", error);
          }

          // Debugging log
          console.log("documentUrls:", documentUrls);

          return (
            <Accordion
              key={announcement.id}
              sx={{ mt: 2, mb: 2, borderRadius: "5px" }}
              expanded={expanded === `panel${announcement.id}`}
              onChange={handleChange(`panel${announcement.id}`)}
            >
              <AccordionSummary
                aria-controls={`panel${announcement.id}-content`}
                id={`panel${announcement.id}-header`}
                sx={{
                  backgroundColor: userOpenedAnnouncements.includes(announcement.id)
                    ? "#CDFFCD"
                    : "#F0F0F0",
                }}
              >
                <Typography>{announcement.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{announcement.description}</Typography>

                {/* Check if documentUrls is an array and has documents */}
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
                {announcement.isVisible && announcement.questions && announcement.questions.length > 0 &&storedUserData.user.role!="company-super-admin"&& (
  <Box sx={{ mt: 2 }}>
  

    {/* Button to answer questions */}
    <Button
    onClick={() => handleOpenModal(announcement)}
      variant="outlined"
      color="primary"
      sx={{ mt: 2 }}
    >
      Answer Question
    </Button>
  </Box>
)}

<Dialog open={openModal} onClose={handleCloseModal}>
      <DialogTitle>Answer Question</DialogTitle>
      <DialogContent>
        {selectedAnnouncement && selectedAnnouncement.questions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              {selectedAnnouncement.questions[currentQuestionIndex].question}
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Options</FormLabel>
              <RadioGroup
                value={selectedAnswers[selectedAnnouncement.questions[currentQuestionIndex].id] || ""}
                onChange={(e) =>
                  handleOptionChange(e, selectedAnnouncement.questions[currentQuestionIndex].id)
                }
              >
                {selectedAnnouncement.questions[currentQuestionIndex].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Cancel
        </Button>
        <Button onClick={handleNextQuestion} color="primary">
          {currentQuestionIndex < selectedAnnouncement?.questions.length - 1
            ? "Next"
            : "Submit Answer"}
        </Button>
      </DialogActions>
    </Dialog>

                <div className="flex w-100 justify-center mt-5">
                  {userOpenedAnnouncements.includes(announcement.id) ? (
                    <div>You read this announcement</div>
                  ) : (
                    <FormControlLabel
                      control={<Checkbox />}
                      label="I have read the announcement!"
                      value={userOpenedAnnouncements.includes(announcement.id)}
                      onChange={() =>
                        handleAnnouncementRead(announcement.id, announcement.rewardPoints)
                      }
                    />
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Container>
  </Grid>
</Grid>

      </CardContent>
    </Card>
  );
}
