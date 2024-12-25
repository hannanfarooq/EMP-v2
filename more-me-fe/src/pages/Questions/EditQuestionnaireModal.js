import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { handleUpdateQuestionnaireTitleAndDescription } from "src/api";
import UpdateIcon from '@mui/icons-material/Update';
import CreateNewQuestion from './createNewQuestion'; // Adjust the import path as needed

const EditQuestionnaireModal = ({ open, handleClose, selectedCategory, categoryId }) => {
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setEditTitle(selectedCategory.questionnaireTitle);
      setEditDescription(selectedCategory.questionnaireDescription);
    }
  }, [selectedCategory]);

  const handleUpdate = async () => {
    if (selectedCategory) {
      try {
        await handleUpdateQuestionnaireTitleAndDescription(selectedCategory.id, editTitle, editDescription);
        window.location.reload();
      } catch (error) {
        console.error('Failed to update category:', error);
      }
    }
  };

  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
  };

  const handleBackToEdit = () => {
    setIsAddingQuestion(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{isAddingQuestion ? "Add New Question" : "Edit Questionnaire"}</DialogTitle>
      <DialogContent>
        {isAddingQuestion ? (
          <CreateNewQuestion categoryId={categoryId} /> // Pass categoryId to CreateNewQuestion
        ) : (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions style={{ marginRight: "auto" }}>
        {isAddingQuestion ? (
          <Button onClick={handleBackToEdit} color="secondary">
            Back to Edit
          </Button>
        ) : (
          <>
            <Button
              onClick={handleAddQuestion}
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Question
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              startIcon={<UpdateIcon />}
              >
              Update
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionnaireModal;
