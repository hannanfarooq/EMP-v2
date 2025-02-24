// import React, { useState } from 'react';
// import { Button, TextField, Box, Chip, Autocomplete } from '@mui/material';
// import { keyframes } from '@mui/system';

// const vibration = keyframes`
//   0%, 100% {
//     transform: translateX(0);
//   }
//   25% {
//     transform: translateX(-5px);
//   }
//   50% {
//     transform: translateX(5px);
//   }
//   75% {
//     transform: translateX(-5px);
//   }
// `;

// const Q8 = ({ handleNext, handleAnswerChange }) => {
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [error, setError] = useState(false);
//   const [maxError, setMaxError] = useState(false);

//   const topics = [
//     'Inspiration', 'Leadership', 'Human behaviour', 'Self-care', 'Physical wellbeing',
//     'Mental wellbeing', 'Finance', 'Nutrition', 'Mindfulness'
//   ];

//   const handleSubmit = () => {
//     if (selectedTopics.length === 0) {
//       setError(true);
//       return;
//     }
//     const answer = {
//       interestTopics: selectedTopics,
//     };
//     console.log("Submitting answer for topics of interest:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <Box display="flex" flexDirection="column" alignItems="center">
//         <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 8: What topics interest you most?</h2>
        
//         <Autocomplete
//           multiple
//           freeSolo
//           id="tags-outlined"
//           options={topics}
//           getOptionLabel={(option) => option}
//           filterSelectedOptions
//           value={selectedTopics}
//           onChange={(event, newValue) => {
//             if (newValue.length > 5) {
//               setMaxError(true);
//               return;
//             }
//             setMaxError(false);
//             const uniqueTopics = newValue.filter((topic, index) => newValue.indexOf(topic) === index);
//             setSelectedTopics(uniqueTopics);
//             setError(false);
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               label="Search topics"
//               placeholder="Topics"
//               error={error || maxError}
//               helperText={
//                 error ? 'Please select at least one topic' : 
//                 maxError ? 'You can select a maximum of 5 topics' : ''
//               }
//               sx={error || maxError ? { animation: `${vibration} 0.3s ease` } : {}}
//             />
//           )}
//           renderTags={(value, getTagProps) =>
//             value.map((option, index) => (
//               <Chip label={option} {...getTagProps({ index })} />
//             ))
//           }
//           style={{ width: '100%' }}
//         />
        
//         <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>
//           Next!
//         </Button>
//       </Box>
//     </>
//   );
// };

// export default Q8;

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

const Q8 = ({ handleNext, handleAnswerChange }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState(false);
  const [maxError, setMaxError] = useState(false);

  const topics = [
    'Inspiration', 'Leadership', 'Human behaviour', 'Self-care', 'Physical wellbeing',
    'Mental wellbeing', 'Finance', 'Nutrition', 'Mindfulness'
  ];

  const handleSubmit = () => {
    if (selectedTopics.length === 0) {
      setError(true);
      return;
    }
    const answer = {
      interestTopics: selectedTopics,
    };
    console.log("Submitting answer for topics of interest:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 8: What topics interest you most?</h2>
        
        <Autocomplete
          multiple
          freeSolo
          id="tags-outlined"
          options={topics}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          value={selectedTopics}
          onChange={(event, newValue) => {
            if (newValue.length > 7) {
              setMaxError(true);
              return;
            }
            setMaxError(false);
            const uniqueTopics = newValue.filter((topic, index) => newValue.indexOf(topic) === index);
            setSelectedTopics(uniqueTopics);
            setError(false);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search topics"
              placeholder="Topics"
              error={error || maxError}
              helperText={
                error ? 'Please select at least one topic' : 
                maxError ? 'You can select a maximum of 7 topics' : ''
              }
              sx={error || maxError ? { animation: `${vibration} 0.3s ease` } : {}}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} />
            ))
          }
          style={{ width: '100%' }}
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

export default Q8;
