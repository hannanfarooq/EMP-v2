import React, { useState } from 'react';
import { Button, TextField, Box, Chip, Autocomplete } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const vibration = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
`;

const Q6 = ({ handleNext, handleAnswerChange }) => {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [error, setError] = useState(false);
  const [maxError, setMaxError] = useState(false);

  const hobbies = [
    'Cooking', 'Baking', 'Reading', 'Outdoor activities', 'Tech/Computers', 
    'Traveling', 'Socializing', 'Gaming', 'Gardening', 'DIY', 'Arts', 
    'Writing', 'Photography'
  ];

  const handleSubmit = () => {
    if (selectedHobbies.length === 0) {
      setError(true);
      return;
    }
    const answer = {
      hobbies: selectedHobbies,
    };
    console.log("Submitting answer for hobbies:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 6: What are your hobbies?</h2>
        
        <Autocomplete
          style={{ width: '100%', textAlign:"center" }}
          multiple
          freeSolo
          id="tags-outlined"
          options={hobbies}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          value={selectedHobbies}
          onChange={(event, newValue) => {
            if (newValue.length > 7) {
              setMaxError(true);
              return;
            }
            setMaxError(false);
            const uniqueHobbies = newValue.filter((hobby, index) => newValue.indexOf(hobby) === index);
            setSelectedHobbies(uniqueHobbies);
            setError(false);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search hobbies"
              placeholder="Hobbies"
              error={error || maxError}
              helperText={
                error ? 'Please select at least one hobby' : 
                maxError ? 'You can select a maximum of 7 hobbies' : ''
              }
              sx={error || maxError ? { animation: `${vibration} 0.3s ease` } : {}}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} />
            ))
          }
        />
        
        <Button
        className="mt-10 w-60"
        variant="outlined"
        onClick={handleSubmit}
        endIcon={<ArrowForwardIcon />}
      >
        Next!
      </Button>
      </Box>
    </>
  );
};

export default Q6;
