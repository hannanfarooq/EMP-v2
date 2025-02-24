import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, InputLabel, Select, MenuItem, TextField, FormLabel, Button, Snackbar } from '@mui/material';
import { getDailyQuestionsForCompany } from "src/api"; // Assuming you have an API function for fetching questions
import MuiAlert from '@mui/material/Alert';
import processWithLLM from '../../api/llm/llm.js'; // Import the LLM API function
const axios = require('axios');

export default function QuestionnaireForm({ username, onResponse  }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index
  const [userAnswers, setUserAnswers] = useState([]); // To store the user's answers
  const [errorMessage, setErrorMessage] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [llmFeedback, setLlmFeedback] = useState(''); // Store LLM feedback

  const fetchQuestions = async (token, parsedUserData) => {
    try {
      const response = await getDailyQuestionsForCompany(token, parsedUserData);
      console.log("Response:", response);
      if (response.code === 200) {
        setQuestions(response.data);
      } else {
        console.error("Error fetching questions", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("currentUser");

    if (!storedUserData) {
      console.error("No currentUser found in localStorage");
      setLoading(false); // Stop loading if no user data is found
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      console.log("Parsed User Data:", parsedUserData); // Debug log
      fetchQuestions(parsedUserData.token, parsedUserData); // Fetch questions using the token
    } catch (error) {
      console.error("Error parsing storedUserData:", error);
    }
  }, []);

  // Function to handle the answer change (for radio, select, or text field)
  const handleAnswerChange = (value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = value;
    setUserAnswers(updatedAnswers);
  };

  // Function to go to the next question or submit if on the last question
  const handleNextQuestion = () => {
    if (!userAnswers[currentQuestionIndex]) {
      setErrorMessage('Please answer this question before proceeding.');
      return;
    }

    setErrorMessage(''); // Clear error message

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Increment the index to show the next question
    } else {
      handleSubmit(); // Submit the form if it's the last question
    }
  };

  // Function to handle the form submission and send data to API
  const handleSubmit = async () => {
    // Create a JSON structure of questions and answers
    const feedbackData = questions.map((question, index) => ({
      questionText: question.questionText,
      answer: userAnswers[index] || 'No answer provided'
    }));

    console.log("Feedback Data:", JSON.stringify(feedbackData, null, 2));

    // Call the submitFeedback API to send feedback data
    try {
      const storedUserData = localStorage.getItem("currentUser");

      if (!storedUserData) {
        console.error("No currentUser found in localStorage");
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      const token = parsedUserData.token;
      const huggingFaceToken = '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';

      // Now, process feedback with LLM API
      const llmResponse = await processWithLLM(huggingFaceToken, feedbackData); // Call the processWithLLM function
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false); // Hide the toast after 3 seconds
      }, 8000);
      console.log("llm response data", llmResponse.data.summary);
      onResponse(llmResponse.data.summary);

      if (llmResponse.code === 200) {
        setLlmFeedback(llmResponse.data.feedback); // Assuming LLM returns feedback in a field called "feedback"
        // Show success toast
      
      } else {
        console.error("Error processing feedback with LLM", llmResponse);
        setErrorMessage('There was an error processing your feedback. Please try again later.');
      }

      
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage('There was an error submitting your feedback. Please try again later.');
    }
  };

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h2" gutterBottom style={{ textAlign: 'center' }}>
        Welcome, {username}!
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          {questions.length > 0 && currentQuestionIndex < questions.length ? (
            <Card sx={{ mb: 3, boxShadow: 3 }}>
              <CardHeader title={`Question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].questionText}`} />
              <CardContent>
                {questions[currentQuestionIndex].type === 'single-choice' && (
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Select an option</FormLabel>
                    <RadioGroup
                      name={`question-${currentQuestionIndex}`}
                      value={userAnswers[currentQuestionIndex] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                    >
                      {questions[currentQuestionIndex].options?.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}

                {questions[currentQuestionIndex].type === 'dropdown' && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Choose an option</InputLabel>
                    <Select
                      value={userAnswers[currentQuestionIndex] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                    >
                      {questions[currentQuestionIndex].options?.map((option, optionIndex) => (
                        <MenuItem key={optionIndex} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {questions[currentQuestionIndex].type === 'textfield' && (
                  <TextField
                    fullWidth
                    label={questions[currentQuestionIndex].placeholder || 'Enter your answer'}
                    variant="outlined"
                    sx={{ mt: 2 }}
                    value={userAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                )}

                {errorMessage && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {errorMessage}
                  </Typography>
                )}

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNextQuestion}
                    fullWidth
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="h6" color="textSecondary" style={{ textAlign: 'center' }}>
              No questions available.
            </Typography>
          )}
        </Box>
      )}

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

      {llmFeedback && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            LLM Feedback:
          </Typography>
          <Typography variant="body1">{llmFeedback}</Typography>
        </Box>
      )}
    </Box>
  );
}
