import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Stack, Container, Typography, Card, CardContent, Grid, Button, Box, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

import TransitionsModal from "src/components/modal";
import CreateNewDailyQuestion from "./Questions/CreateNewDailyQuestions";
import EditDailyQuestionForCompany from "./Questions/EditDailyQuestionsForCompany";  // Import the new component
import { fetchDailyQuestionsForCompany, deleteDailyQuestionForCompany } from "src/api"; // Assuming you have an API function for updating and deleting questions
import { toast } from "react-toastify";

export default function AllQuestionnairePage() {
  const [openTransition, setOpenTransiton] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null); // Store the current question for view or edit

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetchDailyQuestionsForCompany(storedUserData.token);
      if (response.code === 200) {
        setQuestions(response.data);
      } else {
        console.error("Error fetching questions");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpenTransiton(true);
  const handleClose = () => {
    fetchQuestions();
    setOpenTransiton(false);
  }

  const handleViewOpen = (question) => {
    setCurrentQuestion(question);
    setOpenViewModal(true);
  };

  const handleViewClose = () => {
    setOpenViewModal(false);
    setCurrentQuestion(null);
  };

  const handleEditOpen = (question) => {
    console.log("question", question);
    setCurrentQuestion(question);
    setOpenEditModal(true);
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
    fetchQuestions();
  }

  const handleDeleteOpen = (question) => {
    setCurrentQuestion(question);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    fetchQuestions();
    setOpenDeleteDialog(false);
  }

  const handleDeleteSubmit = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
      const response = await deleteDailyQuestionForCompany(storedUserData.token, currentQuestion.id);
      toast.success("Question deleted sucessfully");
      handleDeleteClose();
      if (response.code === 200) {
        // Remove the deleted question from the state
        setQuestions(questions.filter(q => q.id !== currentQuestion.id));
        handleDeleteClose();
      } else {
        //console.error("Error deleting question");
      }
    } catch (error) {
      //console.error("Error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Questions | More.Me</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Daily Questionnaires
          </Typography>
          <div className="flex">
            <TransitionsModal
              open={openTransition}
              handleClose={handleClose}
              handleOpen={handleOpen}
              title={"Add New Questionnaire"}
              component={<CreateNewDailyQuestion handleClose={handleClose} />}
            />
          </div>
        </Stack>

        {/* Loading state */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {questions.length > 0 ? (
              questions.map((question) => (
                <Grid item xs={12} sm={6} md={4} key={question.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Question: {question.questionText}</Typography>
                      <Box>
                        {/* Render options as a list */}
                        {question.options && question.options.length > 0 ? (
                          <ul>
                            {question.options.map((option, idx) => (
                              <li key={idx}>{option}</li>
                            ))}
                          </ul>
                        ) : (
                          <Typography variant="body2">No options available</Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button startIcon={<VisibilityIcon />} onClick={() => handleViewOpen(question)}>View</Button>
                      <Button startIcon={<EditIcon />} onClick={() => handleEditOpen(question)}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteOpen(question)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ marginLeft: "25px" }} variant="h6">No questions available</Typography>
            )}
          </Grid>
        )}
      </Container>

      {/* View Modal */}
      <Dialog open={openViewModal} onClose={handleViewClose}>
        <DialogTitle>Question Details</DialogTitle>
        <DialogContent>
          {currentQuestion && (
            <>
              <Typography variant="h6">Question: {currentQuestion.questionText}</Typography>
              <Box>
                <Typography variant="body2">Options:</Typography>
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <ul>
                    {currentQuestion.options.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2">No options available</Typography>
                )}
              </Box>
              <Typography variant="body2">Qustion Type: {currentQuestion.type}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={handleEditClose}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          {/* Use the EditDailyQuestionForCompany component here */}
          <EditDailyQuestionForCompany 
            currentQuestion={currentQuestion}  // Pass the current question to the component
            handleClose={handleEditClose}  // Pass handleClose for closing the modal
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this question?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
