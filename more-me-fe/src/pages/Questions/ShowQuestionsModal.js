import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, Box, Card } from '@mui/material';
import { question_emojies } from 'src/utils/baseURL';
import { StyledQuestion } from './Question.styled';
import { deleteDynamicQuestion } from 'src/api';

const ShowQuestionsModal = ({ open, handleClose, questions, isLive }) => {
  const renderQuestionOptions = (question) => {
    switch (question.type) {
      case 'multiple-choice':
      case 'single-choice':
        return (
          <Box pl={2}>
            {question.options && question.options.map((option, index) => (
              <Typography key={index} variant="body2">- {option}</Typography>
            ))}
          </Box>
        );
      case 'emoji':
        return (
          <Box display="flex" pl={2}>
            {question_emojies.map((emoji, idx) => (
              <Card key={idx} className="flex justify-start px-1 py-1 m-2 cursor-default border-solid border-slate-400">
                <Typography className="m-0 text-3xl">{emoji.name}</Typography>
              </Card>
            ))}
          </Box>
        );
      case 'yes-no':
        return (
          <Box display="flex" pl={2}>
            {["✅ Yes", "❌ No"].map((option, idx) => (
              <Card key={idx} className="flex justify-start px-1 py-1 m-2 cursor-default border-solid border-slate-400">
                <Typography className="m-0 text-2xl">{option}</Typography>
              </Card>
            ))}
          </Box>
        );
      case 'multiple-img-choice':
        return (
          <Box pl={2}>
            {question.options && question.options.map((option, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <img width={'50px'} height='50px' className='rounded-full' src={JSON.parse(option)?.img} alt="option" />
                <Typography className='ml-4'>{JSON.parse(option)?.text}</Typography>
              </Box>
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
    try {
      console.log(`Delete question with ID: ${questionId}`);
      await deleteDynamicQuestion(questionId, storedUserData.company.id, storedUserData.token);
      // Optionally, refresh the questions list after deletion
    } catch (error) {
      console.error('Failed to delete question:', error);
      // Handle error (e.g., show a notification to the user)
    }
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Question List</DialogTitle>
      <DialogContent dividers>
        <List>
          {questions.map((question, index) => (
            <StyledQuestion key={question.id}>
              <Card variant="outlined" className='p-4 m-2' cardSize='60%' margin='10px auto' cursor='default'>
                <div className='container'>
                  <Typography variant='h4'>
                    <b>Q{index + 1}:</b> {question.text}
                  </Typography>

                  <div className='score-btn'>
                    {!isLive && (
                      <Button 
                        color='primary' 
                        onClick={() => handleDeleteQuestion(question.id)} 
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                <div className='m-0'>
                  <Typography variant="body" gutterBottom className='m-0 p-0'>Options:</Typography>
                  {renderQuestionOptions(question)}
                </div>
              </Card>
            </StyledQuestion>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowQuestionsModal;
