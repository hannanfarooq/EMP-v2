import { useEffect, useState } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Box,
  Grid,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Card,
  CardHeader,
  IconButton,
  Popover,
  MenuItem,
  Tooltip,
  Avatar,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Iconify from "../components/iconify";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Questionnaire from 'src/components/feedback/dailyQuestions';
import {
  getAllDailyQuestions, getUserStartUpQuestions, getArticlesFromTopicAndContentPref, getBooks,
  getVideos, getPodcasts, getWebinars, getCompanyAnnouncement, CreateThread
} from 'src/api';
import { toast } from 'react-toastify';
import Chip from '@mui/material/Chip';
import { margin, styled, width } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


// components
import {
  AppTasks,
  AppNewsUpdate,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppCurrentSubject,
} from '../sections/@dashboard/app';
import DashLeaderBoard from './DashLeaderBoard';
import ThreadPage from 'src/components/thread/ThreadPage';
import { QUESTIONS_ANSWERED, areas } from 'src/utils/baseURL';
import { useProfileSetUp } from '../App';
import "./Ticker.css"; // Import the CSS for styling


// Add the path to the uploaded image
const backgroundImagePath = '/mnt/data/image.png';

const ArticleCard = styled(Card)(({ theme, background }) => ({
  position: 'relative', // Ensure positioning context
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '1rem',
  color: '#fff',
  borderRadius: '8px',
  marginBottom: '1rem',
  height: '150px', // Set a fixed height for the cards
  '&:hover': {
    filter: 'brightness(0.8)', // Adjust the hover effect if necessary
  },
}));

const ArticleTitle = styled(Typography)({
  position: 'absolute',
  bottom: '0',
  left: '0',
  right: '0',
  color: '#fff',
  background: 'rgba(0, 0, 0, 0.5)',
  padding: '0.5rem',
  borderRadius: '4px',
});

const RewardIcon = styled('div')`
  display: inline-block;
  margin-right: 8px;
`;

const calculateRewards = (points) => {
  let stars = Math.floor(points / 10);
  let cups = Math.floor(stars / 5);
  stars = stars % 5; // Remaining stars after converting to cups
  let trophies = Math.floor(cups / 5);
  cups = cups % 5; // Remaining cups after converting to trophies
  return { stars, cups, trophies };
};


export default function DashboardAppPage() {
  const [user, setUser] = useState({});
  const [openQuestionare, setOpenQuestionare] = useState(false);
  const [troubleEmpData, setTroubleEmpData] = useState([]);
  const [troubledUsers, setTroubledUsers] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [interestTopics, setInterestTopics] = useState([]);
  const [contentPreferences, setContentPreferences] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [articles, setArticles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [books, setBooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [webinars, setWebinarss] = useState([]);

  const [courseStartIndex, setCourseStartIndex] = useState(1); // Added state for course start index
  const [booksStartIndex, setBookStartIndex] = useState(1);
  const [videosStartIndex, setVideosStartIndex] = useState(1);
  const [podcastsStartIndex, setPodcastsStartIndex] = useState(1);
  const { webinarsStartIndex, setWebinarSetUp } = useProfileSetUp(1);
  const { profileSetUp, setProfileSetUp } = useProfileSetUp(1);
  const [preferences, setPreferences] = useState([]);

  const [open, setOpen] = useState(null);  // State to manage popover open/close
  const [editingCardOpen, setEditingCardOpen] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for anchor element for the popover
  const [questionnaireResponse, setQuestionnaireResponse] = useState(''); // Store the response from Questionnaire
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false); // Manage the response dialog open/close
  const [openToast, setOpenToast] = useState(false);
  const [ responseString, updateResponseString ] = useState(''); // Using the custom hook
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const [isScrolling, setIsScrolling] = useState(false);
  const [anchorElMap, setAnchorElMap] = useState({});

  const AnimatedAvatar = styled(Avatar)`
  cursor: pointer;
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 999 !important;
  animation: glow 2s ease-in-out infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px 5px rgba(0, 255, 0, 0.4);
    }
    50% {
      box-shadow: 0 0 20px 20px rgba(0, 255, 0, 0.8);
    }
    100% {
      box-shadow: 0 0 5px 5px rgba(0, 255, 0, 0.4);
    }
  }
`;

  const lastShownTimestamp = localStorage.getItem('snackbarLastShown');
  let today = new Date().toLocaleDateString();

  // Dummy variable for reward points
  const rewardPoints = 1230;

  const { stars, cups, trophies } = calculateRewards(rewardPoints);

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    setUser(userObj.user);

  }, []);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userObj = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
      console.log("userObj", userObj);
      try {
        const companyAnnouncement = await getCompanyAnnouncement(userObj.token, userObj.company.id);
        console.log("announcement data::", companyAnnouncement.data[0]);
        
        // Set the announcement message to state
        setAnnouncementMessage(companyAnnouncement.data[0]);
      } catch (error) {
        console.error("Error fetching company announcement:", error);
      }

      if (userObj.user.role === 'admin') {
        const isCompanyAdmin = userObj.user.role === 'admin';
        try {
          let questionData = await getAllDailyQuestions(userObj?.token, userObj?.company.id, isCompanyAdmin).then(
            (res) => res.data
          );

          // Example data for testing
          questionData = [
            {
              createdAt: '2024-05-20T20:35:32.038Z',
              feeling: 'sad',
              userId: 1,
              companyId: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              anxietyLevel: 5,
              reason: 'work stress',
              symptom: 'headache',
              hobbies: ['Gardening', 'Reading'],
            },
            {
              createdAt: '2024-05-21T20:35:32.038Z',
              feeling: 'sad',
              userId: 1,
              companyId: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              anxietyLevel: 6,
              reason: 'work stress',
              symptom: 'insomnia',
              hobbies: 'Socializing',
            },
            {
              createdAt: '2024-05-22T20:35:32.038Z',
              feeling: 'sad',
              userId: 1,
              companyId: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              anxietyLevel: 7,
              reason: 'work stress',
              symptom: 'fatigue',
            },
            {
              createdAt: '2024-05-23T20:35:32.038Z',
              feeling: 'sad',
              userId: 1,
              companyId: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              anxietyLevel: 8,
              reason: 'work stress',
              symptom: 'lack of concentration',
            },
            {
              createdAt: '2024-05-24T20:35:32.038Z',
              feeling: 'sad',
              userId: 1,
              companyId: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              anxietyLevel: 9,
              reason: 'work stress',
              symptom: 'irritability',
            },
            {
              createdAt: '2024-05-20T20:35:32.038Z',
              feeling: 'happy',
              userId: 2,
              companyId: 1,
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
              anxietyLevel: 2,
              reason: 'good day at work',
              symptom: 'none',
            },
          ];
          setTroubleEmpData(questionData);

          // Function to check if dates are consecutive
          const areConsecutiveDates = (dates) => {
            for (let i = 0; i < dates.length - 1; i++) {
              const date1 = new Date(dates[i]);
              const date2 = new Date(dates[i + 1]);
              const diffInDays = (date2 - date1) / (1000 * 60 * 60 * 24);

              if (diffInDays !== 1) {
                return false;
              }
            }
            return true;
          };

          const groupedData = questionData.reduce((acc, curr) => {
            if (!acc[curr.userId]) {
              acc[curr.userId] = [];
            }
            acc[curr.userId].push(curr);
            return acc;
          }, {});

          const usersWithIssues = [];
          Object.keys(groupedData).forEach((userid) => {
            const userEntries = groupedData[userid];
            const sadEntries = userEntries.filter((entry) => entry.feeling === 'sad');
            sadEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            if (sadEntries.length >= 5) {
              for (let i = 0; i <= sadEntries.length - 5; i++) {
                const dateSlice = sadEntries.slice(i, i + 5).map((entry) => entry.createdAt);
                if (areConsecutiveDates(dateSlice)) {
                  usersWithIssues.push(userEntries[0]);
                  break;
                }
              }
            }
          });
          setTroubledUsers(usersWithIssues);
        } catch (error) {
          console.error(error);
        }
      } else {
        setTroubleEmpData([]);
        setTroubledUsers([]);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const userObj = JSON.parse(localStorage.getItem('currentUser') ?? '{}');

        // Check if user object and role are defined
        if (userObj?.user?.role === 'user') {
          const isCompanyUser = userObj.user.role === 'user';

          // Fetch user startup questions
          const questionData = await getUserStartUpQuestions(
            userObj?.token,
            userObj?.company?.id,
            userObj?.user?.id,
            isCompanyUser
          ).then((res) => res.data);

          // console.log("questionData:", questionData);

          // Ensure questionData is an array and has at least one element
          if (Array.isArray(questionData) && questionData.length > 0) {
            const contentPreferences = questionData[0]?.contentPreferences || [];
            // console.log("contentPreferences:", contentPreferences);

            // Set preferences state
            setPreferences(contentPreferences);

            if (contentPreferences.includes("Reading Articles")) {
              // console.log("User prefers Reading articles.");
              fetchCourses();
            }

            // Check and handle content preferences
            if (contentPreferences.includes("Reading Books")) {
              // console.log("User prefers Reading Books.");
              fetchBooks();
            }

            if (contentPreferences.includes("Watching video clips")) {
              // console.log("User prefers Watching video clips.");
              fetchVideos();
            }

            if (contentPreferences.includes("Listening to Podcast")) {
              // console.log("User prefers Listening to Podcast.");
              fetchPodcasts();
            }

            if (contentPreferences.includes("Webinars or conferences")) {
              // console.log("User prefers Webinars or conferences.");
              //fetchWebinars();
            }

            // If no preferences are selected
            if (contentPreferences.length === 0) {
              // console.log("No content preferences selected by the user.");
            }

            // Extract hobbies, interest topics, and content preferences
            const hobbiesData = questionData
              .map((q) => (Array.isArray(q.hobbies) ? q.hobbies : q.hobbies.split(',')))
              .flat()
              .filter(Boolean);
            const interestsData = questionData
              .map((q) => (Array.isArray(q.interestTopics) ? q.interestTopics : q.interestTopics.split(',')))
              .flat()
              .filter(Boolean);
            const contentPreferencesData = questionData
              .map((q) =>
                Array.isArray(q.contentPreferences) ? q.contentPreferences : q.contentPreferences.split(',')
              )
              .flat()
              .filter(Boolean);

            // Set state and save to localStorage
            setHobbies(hobbiesData);
            setInterestTopics(interestsData);
            setContentPreferences(contentPreferencesData);
            console.log("hobbies>>>>>>>>>>", hobbies);

            localStorage.setItem('userHobbies', JSON.stringify(hobbiesData));
            localStorage.setItem('userInterestTopics', JSON.stringify(interestsData));
            localStorage.setItem('userContentPreferences', JSON.stringify(contentPreferencesData));

            // Profile setup check
            if (questionData.length > 0) {
              setProfileSetUp(true);
              console.log("profileSetUp", true);

              // Show daily questionnaire if it hasn't been shown today
              const lastShownTimestamp = localStorage.getItem('snackbarLastShown');
              const today = new Date().toLocaleDateString();

              console.log("lastShownTimestamp", lastShownTimestamp);
              // if (lastShownTimestamp !== today || lastShownTimestamp === null) {
              if (true) {
                console.log("Daily Questions active");
                setOpenQuestionare(true);
                setProfileSetUp(true);
                localStorage.setItem('snackbarLastShown', today);
              } else {
                setOpenQuestionare(false);
              }
            } else {
              // Navigate to questionnaire if no data found
              setProfileSetUp(false);
              navigate('/questionnaire');
            }
          } else {
            // If questionData is empty, navigate to the questionnaire
            console.log("No data found, navigating to questionnaire.");
            setProfileSetUp(false);
            navigate('/questionnaire');
          }
        }
      } catch (error) {
        console.error("Error in fetchData2:", error);
        setProfileSetUp(false);
        navigate('/questionnaire');
      }
    };

    fetchData2();
  }, [navigate, setProfileSetUp, preferences]);

  const handleClose = () => {
    setOpenQuestionare(false);
  };

  const handleInterestExpand = async (topic) => {
    if (expandedTopic === topic) {
      setExpandedTopic(null);
      return;
    }
    try {
      console.log("hobbies>>>>>>>>>>>>>--------->>", hobbies)
      const result = await getArticlesFromTopicAndContentPref({ topic, contentPreferences, hobbies });
      if (result && result.items) {
        const filteredArticles = result.items.slice(0, 3);
        setArticles(filteredArticles);
        setExpandedTopic(topic);
      } else {
        toast.error('No articles found');
      }
    } catch (error) {
      toast.error('Error while fetching articles');
    }
  };

  const fetchCourses = async (startIndex = 1) => {
    // console.log("topic---", interestTopics);
    // console.log("contentPreferences", contentPreferences);
    if (interestTopics.length > 0 && contentPreferences.length > 0) {
      try {
        console.log("hoobies data->->->->->", hobbies);
        const result = await getArticlesFromTopicAndContentPref({ topic: interestTopics.join(' '), contentPreferences, hobbies, start: startIndex });
        console.log("getArticlesFromTopicAndContentPref: ", result);
        if (result && result.items) {
          if (startIndex === 1) {
            setCourses(result.items);
          } else {
            setCourses((prevCourses) => [...prevCourses, ...result.items]);
          }
        } else {
          toast.error('No courses found');
        }
      } catch (error) {
        // console.error('Error while fetching courses', error);
        toast.error('Error while fetching courses');
      }
    } else {
      // toast.error('No interest topics or content preferences provided');
    }
  };

  //fetch books
  const fetchBooks = async (startIndex = 1) => {
    console.log("Fetching books with topics:", interestTopics);

    if (interestTopics.length > 0) {
      try {
        // Combine the interest topics into a single search query
        const topicQuery = interestTopics.join(' ');

        // Call the getBooks function with the combined topic query
        const booksResult = await getBooks(topicQuery);
        // console.log("books results", booksResult);

        if (booksResult && booksResult.length > 0) {
          // If it's the first page of results, set the books directly
          if (startIndex === 1) {
            setBooks(booksResult);
          } else {
            // Append new results to the existing list of books
            setBooks((prevBooks) => [...prevBooks, ...booksResult]);
          }
        } else {
          toast.error('No books found for the given topics.');
        }
      } catch (error) {
        console.error('Error while fetching books:', error);
        toast.error('Error while fetching books.');
      }
    } else {
      // toast.error('No interest topics provided for book search.');
    }
  };
  const handleLoadMoreBooks = () => {
    setBookStartIndex((prevStartIndex) => {
      const newIndex = prevStartIndex + 10;
      fetchBooks(newIndex);
      return newIndex;
    });
  };
  //fetch videosResult
  const fetchVideos = async (startIndex = 1) => {
    console.log("videos fetcing..........");
    if (interestTopics.length > 0) {
      try {
        // Combine the interest topics into a single search query
        const topicQuery = interestTopics.join(' ');

        // Call the getBooks function with the combined topic query
        const videosResult = await getVideos(topicQuery);
        console.log("Videos results", videosResult);

        if (videosResult && videosResult.length > 0) {
          // If it's the first page of results, set the books directly
          if (startIndex === 1) {
            setVideos(videosResult);
          } else {
            // Append new results to the existing list of books
            setVideos((prevVideos) => [...prevVideos, ...videosResult]);
          }
        } else {
          toast.error('No Videos found for the given topics.');
        }
      } catch (error) {
        console.error('Error while fetching Videos:', error);
        toast.error('Error while fetching Videos.');
      }
    } else {
      // toast.error('No interest topics provided for video search.');
    }
  };
  const handleLoadMoreVideos = () => {
    setVideosStartIndex((prevStartIndex) => {
      const newIndex = prevStartIndex + 10;
      fetchVideos(newIndex);
      return newIndex;
    });
  };

  //fetch videosResult
  const fetchPodcasts = async (startIndex = 1) => {
    console.log("podcasts fetcing..........");
    if (interestTopics.length > 0) {
      try {
        // Combine the interest topics into a single search query
        const topicQuery = interestTopics.join(' ');

        // Call the getBooks function with the combined topic query
        const podcastsResult = await getPodcasts(topicQuery);
        console.log("podcasts results", podcastsResult);

        if (podcastsResult && podcastsResult.length > 0) {
          // If it's the first page of results, set the books directly
          if (startIndex === 1) {
            setPodcasts(podcastsResult);
          } else {
            // Append new results to the existing list of books
            setPodcasts((prevPodcasts) => [...prevPodcasts, ...podcastsResult]);
          }
        } else {
          toast.error('No podcasts found for the given topics.');
        }
      } catch (error) {
        console.error('Error while fetching podcasts:', error);
        toast.error('Error while fetching podcasts.');
      }
    } else {
      // toast.error('No interest topics provided for video search.');
    }
  };
  const handleLoadMorePodcasts = () => {
    setPodcastsStartIndex((prevStartIndex) => {
      const newIndex = prevStartIndex + 10;
      fetchPodcasts(newIndex);
      return newIndex;
    });
  };
  //fetch videosResult
  // const fetchWebinars = async (startIndex = 1) => {
  //   console.log("podcasts fetcing..........");
  //   if (interestTopics.length > 0) {
  //     try {
  //       // Combine the interest topics into a single search query
  //       const topicQuery = interestTopics.join(' ');

  //       // Call the getBooks function with the combined topic query
  //       const webinarsResult = await getWebinars(topicQuery);
  //       console.log("webinar results", webinarsResult);

  //       if (webinarsResult && webinarsResult.length > 0) {
  //         // If it's the first page of results, set the books directly
  //         if (startIndex === 1) {
  //           setPodcasts(webinarsResult);
  //         } else {
  //           // Append new results to the existing list of books
  //           setPodcasts((prevWebinars) => [...prevWebinars, ...webinarsResult]);
  //         }
  //       } else {
  //         toast.error('No webinars found for the given topics.');
  //       }
  //     } catch (error) {
  //       console.error('Error while fetching webinars:', error);
  //       toast.error('Error while fetching webinars.');
  //     }
  //   } else {
  //     // toast.error('No interest topics provided for video search.');
  //   }
  // };
  // const handleLoadMoreWebinars = () => {
  //   setPodcastsStartIndex((prevStartIndex) => {
  //     const newIndex = prevStartIndex + 10;
  //     fetchWebinars(newIndex);
  //     return newIndex;
  //   });
  // };

    // Function to handle opening the popover for a specific card
    const handleOpenMenu = (event, cardId) => {
      setAnchorElMap((prev) => ({ ...prev, [cardId]: event.currentTarget }));
    };
  
    // Function to handle closing the popover for a specific card
    const handleCloseMenu = (cardId) => {
      setAnchorElMap((prev) => ({ ...prev, [cardId]: null }));
    };
  
    // Function to handle the share action
  const handleShare = async (link, cardId) => {
    console.log(`Shared URL: ${link}`);
    toast.success('Content shared successfully!');

    const userObj = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    console.log(userObj);
    // Prepare data with only the link and other fields empty
    const data = {
      userId: userObj.user.id, // Assuming 'user' contains the user data
      companyId: userObj.company.id, // Adjust according to your user object structure
      message: "", // Empty message
      heading: "SHARE", // You can set a specific heading for shares
      images: [], // No images
      pdfs: [], // No PDFs
      links: [link], // Only the link
      parentId: null, // Assuming it's a top-level share. Adjust if necessary.
    };

    console.log("SHARE DATA", data);
    try {
      const resp = await CreateThread(data);
      // Handle response if needed
      // Optionally, you can refresh data or update state
    } catch (error) {
      console.error("Error sharing content:", error);
      toast.error('Failed to share content. Please try again.');
    }

    handleCloseMenu(cardId); // Close the popover after sharing
  };

  // Handle delete action
  const handleDeleteUser = () => {
    console.log("Delete action triggered");
    handleCloseMenu(); // Close popover after action
  };

  // Handle click on the ArticleCard link
  const handleLinkClick = (event) => {
    // If the click target is the IconButton, prevent the link navigation
    if (open) {
      event.preventDefault();
    }
  };

  const handleLoadMore = () => {
    setCourseStartIndex((prevStartIndex) => {
      const newIndex = prevStartIndex + 10;
      fetchCourses(newIndex);
      return newIndex;
    });
  };
  const handleResponse = (responseString) => {
    if (responseString) {
      updateResponseString(responseString);
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false); // Hide the toast after 3 seconds
      }, 3000);
    }
    setQuestionnaireResponse(responseString);  // Save the response string from Questionnaire
    console.log("responseString", responseString);
    setOpenQuestionare(false);  // Close the modal after receiving the response
  };

  const handleOpenAvatarDialog = () => {
    setOpenAvatarDialog(true);  // Open the dialog to show the full response
  };

  const handleCloseAvatarDialog = () => {
    setOpenAvatarDialog(false);  // Close the dialog
  };

  useEffect(() => {
    if (interestTopics.length > 0) {
      //fetchCourses();
    }
    // Trigger the scrolling effect when the component is mounted
    setIsScrolling(true);
  }, [interestTopics]);

  const handleTickerClick = () => {
    // Navigate to the dashboard/announcements route
    navigate("/dashboard/announcements");
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | More.Me </title>
      </Helmet>

      {/* Conditionally render the ticker only if there's announcement data */}
      {announcementMessage && user.role === 'user' && (
        <div className="ticker-container" style={{cursor:"pointer"}} onClick={handleTickerClick}>
          <div className="ticker-message scroll">
            <h2> 🚨Announcement🚨 Title: {announcementMessage.name} </h2>
            <h3>Description: {announcementMessage.description} You will get more announcements in Announcements tab</h3>
          </div>
        </div>
      )}

      <div>
        <Dialog open={openQuestionare} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogContent>
            <Questionnaire username={user.firstName} onResponse={handleResponse} />
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            {['admin', 'super-admin'].includes(user.role) ? (
              <AppWebsiteVisits
                title="Employees Onboarded by Companies"
                subheader="(+43%) than last year"
                chartLabels={[
                  '01/01/2003',
                  '02/01/2003',
                  '03/01/2003',
                  '04/01/2003',
                  '05/01/2003',
                  '06/01/2003',
                  '07/01/2003',
                  '08/01/2003',
                  '09/01/2003',
                  '10/01/2003',
                  '11/01/2003',
                ]}
                chartData={[
                  {
                    name: 'Alpha A',
                    type: 'column',
                    fill: 'solid',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: 'Beta B',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: 'Gamma C',
                    type: 'line',
                    fill: 'solid',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ]}
              />
            ) : (
              <></>
            )}
          </Grid>

          {/* New Section for Hobbies and Interest */}
          {user.role === 'user' && (
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <CardHeader title="Selected Areas" subheader="Your Hobbies and Interests" />
                <Grid container>
                  <Grid item xs={6}>
                    <Box sx={{ p: 4, pb: 4, flexWrap: 'wrap', alignItems: 'center' }} dir="ltr">
                      <Typography variant="h6">Hobbies</Typography>
                      {hobbies.length > 0 ? (
                        hobbies.map((hobby) => (
                          <Chip
                            key={hobby}
                            label={hobby}
                            component="a"
                            href="#basic-chip"
                            variant="outlined"
                            clickable
                            className="w-[100%] h-[100px] rounded-lg bg-sky-200 font-semibold mt-5"
                          />
                        ))
                      ) : (
                        <Typography>No hobbies available</Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 4, pb: 4, flexWrap: 'wrap', alignItems: 'center',}}
                     dir="ltr">
                      <Typography variant="h6">Interest Topics</Typography>
                      {interestTopics.length > 0 ? (
                        interestTopics.map((topic) => (
                          <div key={topic}>
                            <Chip
                              className="w-[100%] h-[100px] rounded-lg bg-sky-200 font-semibold mt-5"
                              variant="outlined"
                              label={topic}
                              clickable
                              onClick={() => handleInterestExpand(topic)}
                              icon={expandedTopic === topic ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              sx={{
                                transition: 'all 1.0s ease-in-out', // slower animation
                              }}
                            />
                            <Collapse in={expandedTopic === topic} timeout="auto" unmountOnExit>
                              <List>
                                {articles.length > 0 ? (
                                  articles.map((article, index) => (
                                    <ArticleCard
                                      key={index}
                                      component="a"
                                      href={article.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      background={article.pagemap?.cse_image?.[0]?.src || backgroundImagePath}
                                    >
                                      <ArticleTitle style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden", textOverflow: "ellipsis"
                                      }} variant="h6">{article.title}</ArticleTitle>
                                    </ArticleCard>
                                  ))
                                ) : (
                                  <Typography>No articles available</Typography>
                                )}
                              </List>
                            </Collapse>
                          </div>
                        ))
                      ) : (
                        <Typography>No interest topics available</Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )}

          {/* New Section for Courses You Might Be Interested In */}
          {courses.length > 0 && (
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <CardHeader title="Articles You Might Be Interested In" />
                <Box sx={{ p: 4, pb: 4, flexWrap: 'wrap', alignItems: 'center' }} dir="ltr">
                  <Grid container spacing={2}>
                    {courses.map((course, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        {/* Add ellipsis button here */}
                        <Card sx={{ textAlign: "end" }}>
                          <IconButton onClick={(event) => handleOpenMenu(event, course.id || index)}>
                            <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
                          </IconButton>

                          {/* Popover with options outside the ArticleCard */}
                          <Popover
                            // open={Boolean(open)}
                            // anchorEl={open}
                            // onClose={handleCloseMenu}
                            open={Boolean(anchorElMap[course.id || index])}
                            anchorEl={anchorElMap[course.id || index]}
                            onClose={() => handleCloseMenu(course.id || index)}
                            anchorOrigin={{ vertical: "top", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{
                              sx: {
                                boxShadow: "none",
                                p: 1,
                                // width: 140,
                                "& .MuiMenuItem-root": {
                                  typography: "body2",
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                            <MenuItem onClick={() => handleShare(course.link, course.id || index)}>
                              <Iconify icon={"eva:share-fill"} sx={{ mr: 2 }} />
                              Share
                            </MenuItem>
                          </Popover>
                          <ArticleCard
                            sx={{ borderRadius: "0", margin: "0" }}
                            component="a"
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            background={course.pagemap?.cse_image?.[0]?.src || backgroundImagePath}
                            onClick={handleLinkClick} // Prevent link navigation when clicking IconButton
                          >
                            <ArticleTitle
                              style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                              variant="h6"
                            >
                              {course.title}
                            </ArticleTitle>

                          </ArticleCard>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    type="button"
                    fullWidth
                    color="secondary"
                    onClick={handleLoadMore}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Load More
                  </Button>
                </Box>
              </Card>
            </Grid>
          )}
          {/* For books */}
          {preferences.includes("Reading Books") && books.length > 0 && (
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <CardHeader title="Books You Might Be Interested In" />
                <Box sx={{ p: 4, pb: 4, flexWrap: 'wrap', alignItems: 'center' }} dir="ltr">
                  <Grid container spacing={2}>
                    {books.map((book, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ textAlign: "end" }}>
                          <IconButton onClick={(event) => handleOpenMenu(event, book.id || index)}>
                            <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
                          </IconButton>

                          {/* Popover with options outside the ArticleCard */}
                          <Popover
                            // open={Boolean(open)}
                            // anchorEl={open}
                            // onClose={handleCloseMenu}
                            open={Boolean(anchorElMap[book.id || index])}
                            anchorEl={anchorElMap[book.id || index]}
                            onClose={() => handleCloseMenu(book.id || index)}
                            anchorOrigin={{ vertical: "top", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{
                              sx: {
                                boxShadow: "none",
                                p: 1,
                                // width: 140,
                                "& .MuiMenuItem-root": {
                                  typography: "body2",
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                          <MenuItem onClick={() => handleShare(book.link, book.id || index)}>
                              <Iconify icon={"eva:share-fill"} sx={{ mr: 2 }} />
                              Share
                            </MenuItem>
                          </Popover>
                          <ArticleCard
                            component="a"
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            background={book.image || backgroundImagePath}
                            onClick={handleLinkClick} // Prevent link navigation when clicking IconButton
                          >
                            <ArticleTitle style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden", textOverflow: "ellipsis"
                            }} variant="h6">{book.title}</ArticleTitle>
                          </ArticleCard>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    type="button"
                    fullWidth
                    color="secondary"
                    onClick={handleLoadMoreBooks}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Load More
                  </Button>

                </Box>
              </Card>
            </Grid>
          )}
          {/* For videos */}
          {preferences.includes("Watching video clips") && videos.length > 0 && (
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <CardHeader title="Videos You Might Be Interested In" />
                <Box sx={{ p: 4, pb: 4, flexWrap: 'wrap', alignItems: 'center' }} dir="ltr">
                  <Grid container spacing={2}>
                    {videos.map((video, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ textAlign: "end" }}>
                          <IconButton onClick={(event) => handleOpenMenu(event, video.id || index)}>
                            <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
                          </IconButton>

                          {/* Popover with options outside the ArticleCard */}
                          <Popover
                            // open={Boolean(open)}
                            // anchorEl={open}
                            // onClose={handleCloseMenu}
                            open={Boolean(anchorElMap[video.id || index])}
                            anchorEl={anchorElMap[video.id || index]}
                            onClose={() => handleCloseMenu(video.id || index)}
                            anchorOrigin={{ vertical: "top", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{
                              sx: {
                                boxShadow: "none",
                                p: 1,
                                // width: 140,
                                "& .MuiMenuItem-root": {
                                  typography: "body2",
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                           <MenuItem onClick={() => handleShare(video.link, video.id || index)}>
                              <Iconify icon={"eva:share-fill"} sx={{ mr: 2 }} />
                              Share
                            </MenuItem>
                          </Popover>
                          <ArticleCard
                            component="a"
                            href={video.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            background={video.image || backgroundImagePath}
                            onClick={handleLinkClick} // Prevent link navigation when clicking IconButton
                          >
                            <ArticleTitle style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden", textOverflow: "ellipsis"
                            }} variant="h6">{video.title}</ArticleTitle>
                          </ArticleCard>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    type="button"
                    fullWidth
                    color="secondary"
                    onClick={handleLoadMoreVideos}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Load More
                  </Button>

                </Box>
              </Card>
            </Grid>
          )}

          {/* For Podcast */}
          {preferences.includes("Listening to Podcast") && podcasts.length > 0 && (
            <Grid item xs={12} md={12} lg={6}>
              <Card>
                <CardHeader title="Podcasts You Might Be Interested In" />
                <Box sx={{ p: 4, pb: 4, flexWrap: 'wrap', alignItems: 'center' }} dir="ltr">
                  <Grid container spacing={2}>
                    {podcasts.map((podcast, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ textAlign: "end" }}>
                          <IconButton onClick={(event) => handleOpenMenu(event, podcast.id || index)}>
                            <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
                          </IconButton>

                          {/* Popover with options outside the ArticleCard */}
                          <Popover
                            // open={Boolean(open)}
                            // anchorEl={open}
                            // onClose={handleCloseMenu}
                            open={Boolean(anchorElMap[podcast.id || index])}
                            anchorEl={anchorElMap[podcast.id || index]}
                            onClose={() => handleCloseMenu(podcast.id || index)}
                            anchorOrigin={{ vertical: "top", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{
                              sx: {
                                boxShadow: "none",
                                p: 1,
                                // width: 140,
                                "& .MuiMenuItem-root": {
                                  typography: "body2",
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                         <MenuItem onClick={() => handleShare(podcast.link, podcast.id || index)}>
                              <Iconify icon={"eva:share-fill"} sx={{ mr: 2 }} />
                              Share
                            </MenuItem>
                          </Popover>
                          <ArticleCard
                            component="a"
                            href={podcast.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            background={podcast.image || backgroundImagePath}
                            onClick={handleLinkClick} // Prevent link navigation when clicking IconButton
                          >
                            <ArticleTitle variant="h6">{podcast.title}</ArticleTitle>
                          </ArticleCard>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    type="button"
                    fullWidth
                    color="secondary"
                    onClick={handleLoadMorePodcasts}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Load More
                  </Button>

                </Box>
              </Card>
            </Grid>
          )}

          {/* <Grid item xs={12} md={6} lg={6}>
            <AppNewsUpdate
              title="Company Suggested Courses"
              list={[...Array(3)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* Reward Points Section */}
          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <CardHeader title="Reward Points" subheader="Here it will show the rewards achieved." />
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <RewardIcon>
                    <StarIcon sx={{ color: '#FFD700', fontSize: '2rem' }} />
                  </RewardIcon>
                  <Typography variant="h6">{stars} Stars</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <RewardIcon>
                    <LocalDrinkIcon sx={{ color: '#8B4513', fontSize: '3rem' }} />
                  </RewardIcon>
                  <Typography variant="h5">{cups} Cups</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <RewardIcon>
                    <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: '4rem' }} />
                  </RewardIcon>
                  <Typography variant="h4">{trophies} Trophies</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentSubject
              title="Your Activity Breakdown"
              chartLabels={['Connects', 'Policies', 'Tasks', 'Announcements', 'Courses', 'Buy n Sell']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppTasks
              title="Task Master: Your assigned tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '6', label: 'Sprint Planning' },
                { id: '7', label: 'Line Up' },
                { id: '8', label: 'Retrospective Meeting' },
                { id: '9', label: 'Stakeholder Meeting' },
                { id: '10', label: 'Scoping & Estimations' },
              ]}
            />
          </Grid>

          {/* New Announcement Section */}
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardHeader title="Announcements" subheader="Latest updates and news" />
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Employee Management System Update:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                  Dear team, we are excited to announce the upcoming launch of our new Employee Management System. This system will streamline our HR processes, making it easier to manage employee records, track performance, and handle payroll.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Key Features:</strong>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>Automated attendance tracking</li>
                    <li>Performance evaluation tools</li>
                    <li>Seamless integration with payroll</li>
                    <li>Employee self-service portal</li>
                  </ul>
                </Typography>
                <Typography variant="body2" paragraph>
                  We will be conducting training sessions over the next few weeks to ensure everyone is comfortable using the new system. Please stay tuned for more information on the training schedule.
                </Typography>
                <Typography variant="body2">
                  Thank you for your cooperation and support as we transition to this new platform.
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* dynamic content for user side */}
          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Rewards based Leader Board"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <DashLeaderBoard />
          </Grid>

          {user.role === 'user' && (
            <Grid item xs={12} md={6} lg={12}>
              <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                <ThreadPage />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/dashboard/thread')}
                  sx={{ mt: 2, mb: 1, width: 200, display: 'flex', alignSelf: 'center' }}
                >
                  See all threads
                </Button>
              </Card>
            </Grid>
          )}

          {user.role === 'admin' && troubledUsers.length > 0 && (
            <Grid item xs={12} md={6} lg={12}>
              <Card>
                <CardHeader title="List of Troubled Employees" />
                <List>
                  {troubledUsers.map((employee) => (
                    <ListItem key={employee.userId}>
                      <ListItemText
                        primary={`${employee.firstName} ${employee.lastName}`}
                        secondary={`Email: ${employee.email}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          )}
        </Grid>
        {/* Display Tooltip and Avatar only if responseString has data */}
        {questionnaireResponse && (
          <>
            <Tooltip title="Click to view details" arrow>
              <Avatar
                sx={{
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  width: 50,
                  height: 50,
                  position: 'fixed',
                  right: "10px",
                  bottom: "10px"
                }}
                onClick={handleOpenAvatarDialog}
              >
                {/* <span style={{ fontSize: '1.5rem', color: 'white' }}>?</span> */}
                <AnimatedAvatar  
                  // onClick={handleAvatarClick} 
                  alt="Tips" 
                  src={`${process.env.PUBLIC_URL}/assets/images/avatars/avatar_14.jpg`} 
                />
              </Avatar>
            </Tooltip>
            {/* Dialog to show the responseString when Avatar is clicked */}
            <Dialog open={openAvatarDialog} onClose={handleCloseAvatarDialog}>
              <DialogTitle>Response</DialogTitle>
              <DialogContent>
                <Typography variant="body1">{responseString}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAvatarDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={openToast}
              autoHideDuration={3000}
              onClose={() => setOpenToast(false)}
            >
              <MuiAlert
                severity="success"
                sx={{ width: '100%' }}
              >
                Feedback submitted successfully!
              </MuiAlert>
            </Snackbar>

          </>
        )}
      </Container>

    </>
  );
}
