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
import AddAnnouncement from "src/components/company/announcementForm";
import Snackbar from "@mui/material/Snackbar";
import {
  getCompanyAnnouncement,
  getUserProfile,
  markAnnouncementAsRead,
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

export default function UserAnnouncementPage() {
  const [expanded, setExpanded] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState(""); // Add search query state
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  // Use an array to store the IDs of policies that the user has opened
  const [userOpenedAnnouncements, setUserOpenedAnnouncements] = React.useState([]);

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

  const fetchCompanyAnnouncements = async (company, token) => {
    const companyData = await getCompanyAnnouncement(token, company.id);
    setData(companyData.data);
  };

  React.useEffect(() => {
    (async () => {
      if (storedUserData.company && storedUserData.token) {
        fetchUserData();
        fetchCompanyAnnouncements(storedUserData.company, storedUserData.token);
      }
    })();
  }, []);

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
                filteredAnnouncements.map((announcement, index) => (
                  <>
                    {index % 2 == 0 && (
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
                            backgroundColor: userOpenedAnnouncements.includes(
                                announcement.id
                            )
                              ? "#CDFFCD"
                              : "#F0F0F0",
                          }}
                        >
                          <Typography>{announcement.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{announcement.description}</Typography>
                          {announcement.documentUrl && (
                        <a href={announcement.documentUrl} target="_blank">
                          Announcement Document
                        </a>
                      )}
                          <div className="flex w-100 justify-center mt-5">
                            {userOpenedAnnouncements.includes(announcement.id) ? (
                              <>
                                <div>You read this announcement</div>
                              </>
                            ) : (
                              <FormControlLabel
                                control={<Checkbox />}
                                label=" I have read the announcement!"
                                value={userOpenedAnnouncements.includes(announcement.id)}
                                onChange={() =>
                                  handleAnnouncementRead(
                                    announcement.id,
                                    announcement.rewardPoints
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
              {filteredAnnouncements &&
                filteredAnnouncements.map((announcement, index) => (
                  <>
                    {index % 2 !== 0 && (
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
                            backgroundColor: userOpenedAnnouncements.includes(
                              announcement.id
                            )
                              ? "#CDFFCD"
                              : "#F0F0F0",
                          }}
                        >
                          <Typography>{announcement.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{announcement.description}</Typography>
                          {announcement.documentUrl && <a href={announcement.documentUrl} target="_blank">View announcement Document</a>}
                          <div className="flex w-100 justify-center mt-5">
                            {userOpenedAnnouncements.includes(announcement.id) ? (
                              <>
                                <div>You read this announcement</div>
                              </>
                            ) : (
                              <FormControlLabel
                                control={<Checkbox />}
                                label=" I have read the announcement!"
                                value={userOpenedAnnouncements.includes(announcement.id)}
                                onChange={() =>
                                  handleAnnouncementRead(
                                    announcement.id,
                                    announcement.rewardPoints
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
