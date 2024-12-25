import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createQuestionnaire } from 'src/api';

const AddQuestionCategory = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddQuestionnaire = async () => {
    if (description.length > 255) {
      setErrorMessage('Description cannot exceed 255 characters');
      return;
    }

    try {
      setLoading(true);
      const isReady = false;
      const newQuestionnaire = { title, description, isReady };
      setTitle('');
      setDescription('');
      setErrorMessage('');
      setLoading(false);
      console.log('New category object:', newQuestionnaire);
      // Proceed with the API call
      const response = await createQuestionnaire(title, description, isReady);
      console.log("response", response);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.error('Failed to add category:', error);
    }
  };

  return (
    <div>
      <h3 className="form-title">Add Questionnaire</h3>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={title}
        className='mt-4'
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        className='mt-4'
        onChange={(e) => setDescription(e.target.value)}
        error={description.length > 255}
        helperText={description.length > 255 ? 'Description cannot exceed 255 characters' : ''}
      />
      {errorMessage && (
        <Typography variant="body2" color="error" className="mt-4">
          {errorMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        className='mt-4'
        onClick={handleAddQuestionnaire}
        disabled={loading}
      >
        Add Questionnaire
      </Button>
    </div>
  );
};

export default AddQuestionCategory;
