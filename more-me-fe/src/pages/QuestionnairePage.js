// import React, { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import { Stack, Container, Typography, Card, CardContent, CardActions, Grid, Switch, Box, Button } from "@mui/material";
// import EditIcon from '@mui/icons-material/Edit';
// import PublicIcon from '@mui/icons-material/Public';
// import TransitionsModal from "src/components/modal";
// import AddQuestionCategory from "./Questions/CreateQuestionCategory";
// import EditQuestionnaireModal from "./Questions/EditQuestionnaireModal";
// import ShowQuestionsModal from "./Questions/ShowQuestionsModal";
// import ShowResponsesModal from "./Questions/ShowResponsesModal";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { getQuestionCategories, deleteQuestionCategory, updateQuestionCategory, getQuestionnaire, updateQuestionnaireIsReady, getDynamicQuestions, updateQuestionnaireIsLive, getUserAttemptedQuestionnaireToAdmin } from 'src/api';

// export default function QuestionnairePage() {
//   const [open, setOpen] = useState(null);
//   const [openTransition, setOpenTransiton] = useState(false);
//   const [openTransition2, setOpenTransiton2] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [dynamicQuestions, setDynamicQuestions] = useState({});
//   const [isShowQuestionsModalOpen, setIsShowQuestionsModalOpen] = useState(false);
//   const [isShowResponsesModalOpen, setIsShowResponsesModalOpen] = useState(false);
//   const [questionsToShow, setQuestionsToShow] = useState([]);
//   const [buttonVisibility, setButtonVisibility] = useState({});
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
//   const [userResponses, setUserResponses] = useState({});
//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

//   useEffect(() => {
//     fetchQuentionnaires();
//   }, []);

//   const fetchQuentionnaires = async () => {
//     try {
//       const questionnaireList = await getQuestionnaire();
//       const fetchedCategories = questionnaireList?.data || [];
//       setCategories(fetchedCategories);

//       const initialButtonVisibility = fetchedCategories.reduce((acc, category) => {
//         acc[category.id] = {
//           showResponses: category.isLive,
//           goLive: !category.isLive,
//           edit: !category.isLive,
//         };
//         return acc;
//       }, {});
//       setButtonVisibility(initialButtonVisibility);

//       fetchedCategories.forEach(category => {
//         fetchDynamicQuestions(category.id);
//         fetchUserResponses(category.id);  
//       });
//     } catch (error) {
//       console.error('Failed to fetch question categories:', error);
//     }
//   };

//   const fetchDynamicQuestions = async (questionnaireId) => {
//     try {
//       const response = await getDynamicQuestions(questionnaireId, storedUserData.company.id);
//       const questions = response.data || [];
//       setDynamicQuestions(prevState => ({
//         ...prevState,
//         [questionnaireId]: questions.questions || []
//       }));
//     } catch (error) {
//       console.error('Failed to fetch dynamic questions:', error);
//     }
//   };

//   const fetchUserResponses = async (categoryId) => {
//     try {
//       const response = await getUserAttemptedQuestionnaireToAdmin(categoryId, storedUserData.company.id);
//       console.log("getUserAttemptedQuestionnaireToAdmin", response.data);
//       console.log(`Fetched user attempted by questionnaire ID ${categoryId}:`, storedUserData.company.id);
//       setUserResponses(prevState => ({
//         ...prevState,
//         [categoryId]: response.data || []
//       }));
//     } catch (error) {
//       console.error('Failed to fetch user responses:', error);
//       setUserResponses(prevState => ({
//         ...prevState,
//         [categoryId]: []
//       }));
//     }
//   };  

//   const handleToggleChange = async (categoryId, event) => {
//     const isReady = event.target.checked;
//     const updatedCategories = categories.map(category => 
//       category.id === categoryId ? { ...category, isReady } : category
//     );
//     setCategories(updatedCategories);
//     try {
//       await updateQuestionnaireIsReady(categoryId, isReady);
//     } catch (error) {
//       console.error('Failed to update questionnaire state:', error);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (window.confirm('Are you sure you want to delete this category?')) {
//       try {
//         await deleteQuestionCategory(categoryId);
//         fetchQuentionnaires();
//       } catch (error) {
//         console.error('Failed to delete category:', error);
//       }
//     }
//   };

//   const handleEditCategory = (category) => {
//     setSelectedCategory(category);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateCategory = async (id, title, description) => {
//     try {
//       await updateQuestionCategory(id, { title, description });
//       fetchQuentionnaires();
//     } catch (error) {
//       console.error('Failed to update category:', error);
//     }
//   };

//   const handleOpenMenu = (event) => {
//     setOpen(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setOpen(null);
//   };

//   const handleOpen = () => setOpenTransiton(true);
//   const handleClose = () => setOpenTransiton(false);

//   const handleOpen2 = () => setOpenTransiton2(true);
//   const handleClose2 = () => setOpenTransiton2(false);

//   const handleShowQuestions = (questions) => {
//     setQuestionsToShow(questions);
//     setIsShowQuestionsModalOpen(true);
//   };

//   const handleCloseShowQuestions = () => {
//     setIsShowQuestionsModalOpen(false);
//     setQuestionsToShow([]);
//   };

//   const handleShowResponses = (categoryId) => {
//     const category = categories.find(cat => cat.id === categoryId);
//     setSelectedCategoryId(categoryId);
//     setSelectedCategoryTitle(category?.questionnaireTitle || '');
//     setIsShowResponsesModalOpen(true);
//   };

//   const handleCloseShowResponses = () => {
//     setIsShowResponsesModalOpen(false);
//     setSelectedCategoryId(null);
//     setSelectedCategoryTitle('');
//   };

//   const handleGoLive = async (categoryId) => {
//     try {
//       await updateQuestionnaireIsLive(categoryId, true);
//       setButtonVisibility(prevState => ({
//         ...prevState,
//         [categoryId]: { showResponses: true, goLive: false, edit: false }
//       }));
//     } catch (error) {
//       console.error('Failed to update isLive state:', error);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title> Questions | More.Me </title>
//       </Helmet>

//       <Container>
//         <Stack
//           direction="row"
//           alignItems="center"
//           justifyContent="space-between"
//           mb={5}
//         >
//           <Typography variant="h4" gutterBottom>
//             Questionnaires
//           </Typography>
//           <div className="flex">
//             <TransitionsModal
//               open={openTransition2}
//               handleClose={handleClose2}
//               handleOpen={handleOpen2}
//               title={"Add New Questionnaire"}
//               component={<AddQuestionCategory />}
//             />
//           </div>
//         </Stack>
//         <Typography variant="h5" gutterBottom>
//           Questionnaire List
//         </Typography>
//         <Grid container spacing={3}>
//           {categories.map((category) => (
//             <Grid item xs={12} sm={6} md={6} key={category.id}>
//               <Card 
//                 style={{ cursor: "pointer", position: 'relative' }}
//               >
//                 <CardContent>
//                   <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
//                     <Typography variant="body2" color="textSecondary" style={{ marginRight: '8px' }}>
//                       Form visible to users?
//                     </Typography>
//                     <Switch
//                       checked={category.isReady}
//                       onChange={(event) => handleToggleChange(category.id, event)}
//                       color="primary"
//                       sx={{
//                         '& .MuiSwitch-switchBase.Mui-checked': {
//                           color: '#1976d2',
//                         },
//                         '& .MuiSwitch-switchBase': {
//                           color: category.isReady ? '#1976d2' : '#d3d3d3',
//                         },
//                         '& .MuiSwitch-track': {
//                           backgroundColor: category.isReady ? '#1976d2' : '#d3d3d3',
//                         }
//                       }}
//                       onClick={(event) => event.stopPropagation()} // Prevents click event from triggering card click
//                     />
//                   </Box>
//                   <Typography variant="h5" component="div">
//                     Title: {category.questionnaireTitle}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary" component="p" sx={{
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     display: '-webkit-box',
//                     WebkitLineClamp: 3, // Adjust number of lines as needed
//                     WebkitBoxOrient: 'vertical'
//                   }}>
//                     {category.questionnaireDescription}
//                   </Typography>
//                   {dynamicQuestions[category.id] && Array.isArray(dynamicQuestions[category.id]) && dynamicQuestions[category.id].length > 0 ? (
//                     <p></p>
//                   ) : (
//                     <Typography variant="body2" color="textSecondary">
//                       No questions available for this questionnaire.
//                     </Typography>
//                   )}
//                 </CardContent>
//                 <CardActions>
//                   {buttonVisibility[category.id]?.edit !== false && (
//                     <Button 
//                       onClick={(event) => { event.stopPropagation(); handleEditCategory(category); }} 
//                       color="primary"
//                       startIcon={<EditIcon />}
//                     >
//                         Edit Questionnaire
//                     </Button>
//                   )}
//                   {dynamicQuestions[category.id] && Array.isArray(dynamicQuestions[category.id]) && dynamicQuestions[category.id].length > 0 && (
//                     <Button
//                       color="primary"
//                       onClick={() => handleShowQuestions(dynamicQuestions[category.id])}
//                       startIcon={<VisibilityIcon />}
//                     >
//                       Show Questions
//                     </Button>
//                   )}
//                   {buttonVisibility[category.id]?.goLive !== false && (
//                     <Button
//                       color="primary"
//                       onClick={() => handleGoLive(category.id)}
//                       startIcon={<PublicIcon />}
//                     >
//                       Go Live
//                     </Button>
//                   )}
//                   {buttonVisibility[category.id]?.showResponses && (
//                     <Button
//                       color="primary"
//                       onClick={() => handleShowResponses(category.id)}
//                       startIcon={<VisibilityIcon />}
//                     >
//                       Show Responses
//                     </Button>
//                   )}
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       <EditQuestionnaireModal
//         open={isEditModalOpen}
//         handleClose={() => setIsEditModalOpen(false)}
//         selectedCategory={selectedCategory}
//         handleUpdateCategory={handleUpdateCategory}
//         categoryId={selectedCategory?.id} // Pass categoryId to the modal
//       />

//       <ShowQuestionsModal
//         open={isShowQuestionsModalOpen}
//         handleClose={handleCloseShowQuestions}
//         questions={questionsToShow}
//       />

//       <ShowResponsesModal
//         open={isShowResponsesModalOpen}
//         handleClose={handleCloseShowResponses}
//         userResponses={userResponses[selectedCategoryId] || []} // Pass specific user responses to the modal
//         questionnaireTitle={selectedCategoryTitle} // Pass questionnaire title to the modal
//         dynamicQuestions={dynamicQuestions[selectedCategoryId] || []} // Pass dynamic questions to the modal
//       />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Stack, Container, Typography, Card, CardContent, CardActions, Grid, Switch, Box, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import TransitionsModal from "src/components/modal";
import AddQuestionCategory from "./Questions/CreateQuestionCategory";
import EditQuestionnaireModal from "./Questions/EditQuestionnaireModal";
import ShowQuestionsModal from "./Questions/ShowQuestionsModal";
import ShowResponsesModal from "./Questions/ShowResponsesModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getQuestionCategories, deleteQuestionCategory, updateQuestionCategory, getQuestionnaire, updateQuestionnaireIsReady, getDynamicQuestions, updateQuestionnaireIsLive, getUserAttemptedQuestionnaireToAdmin } from 'src/api';

export default function QuestionnairePage() {
  const [open, setOpen] = useState(null);
  const [openTransition, setOpenTransiton] = useState(false);
  const [openTransition2, setOpenTransiton2] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState({});
  const [isShowQuestionsModalOpen, setIsShowQuestionsModalOpen] = useState(false);
  const [isShowResponsesModalOpen, setIsShowResponsesModalOpen] = useState(false);
  const [questionsToShow, setQuestionsToShow] = useState([]);
  const [buttonVisibility, setButtonVisibility] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  const [userResponses, setUserResponses] = useState({});
  const [selectedCategoryIsLive, setSelectedCategoryIsLive] = useState(false);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchQuentionnaires();
  }, []);

  const fetchQuentionnaires = async () => {
    try {
      const questionnaireList = await getQuestionnaire();
      const fetchedCategories = questionnaireList?.data || [];
      setCategories(fetchedCategories);

      const initialButtonVisibility = fetchedCategories.reduce((acc, category) => {
        acc[category.id] = {
          showResponses: category.isLive,
          goLive: !category.isLive,
          edit: !category.isLive,
        };
        return acc;
      }, {});
      setButtonVisibility(initialButtonVisibility);

      fetchedCategories.forEach(category => {
        fetchDynamicQuestions(category.id);
        fetchUserResponses(category.id);  
      });
    } catch (error) {
      console.error('Failed to fetch question categories:', error);
    }
  };

  const fetchDynamicQuestions = async (questionnaireId) => {
    try {
      const response = await getDynamicQuestions(questionnaireId, storedUserData.company.id);
      const questions = response.data || [];
      setDynamicQuestions(prevState => ({
        ...prevState,
        [questionnaireId]: questions.questions || []
      }));
    } catch (error) {
      console.error('Failed to fetch dynamic questions:', error);
    }
  };

  const fetchUserResponses = async (categoryId) => {
    try {
      const response = await getUserAttemptedQuestionnaireToAdmin(categoryId, storedUserData.company.id);
      console.log("getUserAttemptedQuestionnaireToAdmin", response.data);
      console.log(`Fetched user attempted by questionnaire ID ${categoryId}:`, storedUserData.company.id);
      setUserResponses(prevState => ({
        ...prevState,
        [categoryId]: response.data || []
      }));
    } catch (error) {
      console.error('Failed to fetch user responses:', error);
      setUserResponses(prevState => ({
        ...prevState,
        [categoryId]: []
      }));
    }
  };  

  const handleToggleChange = async (categoryId, event) => {
    const isReady = event.target.checked;
    const updatedCategories = categories.map(category => 
      category.id === categoryId ? { ...category, isReady } : category
    );
    setCategories(updatedCategories);
    try {
      await updateQuestionnaireIsReady(categoryId, isReady);
    } catch (error) {
      console.error('Failed to update questionnaire state:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteQuestionCategory(categoryId);
        fetchQuentionnaires();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async (id, title, description) => {
    try {
      await updateQuestionCategory(id, { title, description });
      fetchQuentionnaires();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpen = () => setOpenTransiton(true);
  const handleClose = () => setOpenTransiton(false);

  const handleOpen2 = () => setOpenTransiton2(true);
  const handleClose2 = () => setOpenTransiton2(false);

  const handleShowQuestions = (questions, isLive) => {
    setQuestionsToShow(questions);
    setSelectedCategoryIsLive(isLive);
    setIsShowQuestionsModalOpen(true);
  };

  const handleCloseShowQuestions = () => {
    setIsShowQuestionsModalOpen(false);
    setQuestionsToShow([]);
    setSelectedCategoryIsLive(false);
  };

  const handleShowResponses = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategoryId(categoryId);
    setSelectedCategoryTitle(category?.questionnaireTitle || '');
    setIsShowResponsesModalOpen(true);
  };

  const handleCloseShowResponses = () => {
    setIsShowResponsesModalOpen(false);
    setSelectedCategoryId(null);
    setSelectedCategoryTitle('');
  };

  const handleGoLive = async (categoryId) => {
    try {
      await updateQuestionnaireIsLive(categoryId, true);
      setButtonVisibility(prevState => ({
        ...prevState,
        [categoryId]: { showResponses: true, goLive: false, edit: false }
      }));
    } catch (error) {
      console.error('Failed to update isLive state:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Questions | More.Me </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Questionnaires
          </Typography>
          <div className="flex">
            <TransitionsModal
              open={openTransition2}
              handleClose={handleClose2}
              handleOpen={handleOpen2}
              title={"Add New Questionnaire"}
              component={<AddQuestionCategory />}
            />
          </div>
        </Stack>
        <Typography variant="h5" gutterBottom>
          Questionnaire List
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={6} key={category.id}>
              <Card 
                style={{ cursor: "pointer", position: 'relative' }}
              >
                <CardContent>
                  <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary" style={{ marginRight: '8px' }}>
                      Form visible to users?
                    </Typography>
                    <Switch
                      checked={category.isReady}
                      onChange={(event) => handleToggleChange(category.id, event)}
                      color="primary"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#1976d2',
                        },
                        '& .MuiSwitch-switchBase': {
                          color: category.isReady ? '#1976d2' : '#d3d3d3',
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: category.isReady ? '#1976d2' : '#d3d3d3',
                        }
                      }}
                      onClick={(event) => event.stopPropagation()} // Prevents click event from triggering card click
                    />
                  </Box>
                  <Typography variant="h5" component="div">
                    Title: {category.questionnaireTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3, // Adjust number of lines as needed
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {category.questionnaireDescription}
                  </Typography>
                  {dynamicQuestions[category.id] && Array.isArray(dynamicQuestions[category.id]) && dynamicQuestions[category.id].length > 0 ? (
                    <p></p>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No questions available for this questionnaire.
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  {buttonVisibility[category.id]?.edit !== false && (
                    <Button 
                      onClick={(event) => { event.stopPropagation(); handleEditCategory(category); }} 
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                        Edit Questionnaire
                    </Button>
                  )}
                  {dynamicQuestions[category.id] && Array.isArray(dynamicQuestions[category.id]) && dynamicQuestions[category.id].length > 0 && (
                    <Button
                      color="primary"
                      onClick={() => handleShowQuestions(dynamicQuestions[category.id], category.isLive)}
                      startIcon={<VisibilityIcon />}
                    >
                      Show Questions
                    </Button>
                  )}
                  {buttonVisibility[category.id]?.goLive !== false && (
                    <Button
                      color="primary"
                      onClick={() => handleGoLive(category.id)}
                      startIcon={<PublicIcon />}
                    >
                      Go Live
                    </Button>
                  )}
                  {buttonVisibility[category.id]?.showResponses && (
                    <Button
                      color="primary"
                      onClick={() => handleShowResponses(category.id)}
                      startIcon={<VisibilityIcon />}
                    >
                      Show Responses
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <EditQuestionnaireModal
        open={isEditModalOpen}
        handleClose={() => setIsEditModalOpen(false)}
        selectedCategory={selectedCategory}
        handleUpdateCategory={handleUpdateCategory}
        categoryId={selectedCategory?.id} // Pass categoryId to the modal
      />

      <ShowQuestionsModal
        open={isShowQuestionsModalOpen}
        handleClose={handleCloseShowQuestions}
        questions={questionsToShow}
        isLive={selectedCategoryIsLive} // Pass isLive status to the modal
      />

      <ShowResponsesModal
        open={isShowResponsesModalOpen}
        handleClose={handleCloseShowResponses}
        userResponses={userResponses[selectedCategoryId] || []} // Pass specific user responses to the modal
        questionnaireTitle={selectedCategoryTitle} // Pass questionnaire title to the modal
        dynamicQuestions={dynamicQuestions[selectedCategoryId] || []} // Pass dynamic questions to the modal
      />
    </>
  );
}

