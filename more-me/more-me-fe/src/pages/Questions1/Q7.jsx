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

// const Q7 = ({ handleNext, handleAnswerChange }) => {
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [error, setError] = useState(false);
//   const [maxError, setMaxError] = useState(false);

//   const activities = [
//     'Reading', 'Meditate', 'Hiking', 'Listen to music', 'Yoga', 
//     'Exercise', 'Cycling', 'Running', 'Sleeping', 'Spa treatment'
//   ];

//   const handleSubmit = () => {
//     if (selectedActivities.length === 0) {
//       setError(true);
//       return;
//     }
//     const answer = {
//       relaxationActivities: selectedActivities,
//     };
//     console.log("Submitting answer for relaxation activities:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <Box display="flex" flexDirection="column" alignItems="center">
//         <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 7: What do you do to relax on your off time?</h2>
        
//         <Autocomplete
//           multiple
//           freeSolo
//           id="tags-outlined"
//           options={activities}
//           getOptionLabel={(option) => option}
//           filterSelectedOptions
//           value={selectedActivities}
//           onChange={(event, newValue) => {
//             if (newValue.length > 5) {
//               setMaxError(true);
//               return;
//             }
//             setMaxError(false);
//             const uniqueActivities = newValue.filter((activity, index) => newValue.indexOf(activity) === index);
//             setSelectedActivities(uniqueActivities);
//             setError(false);
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               label="Search activities"
//               placeholder="Activities"
//               error={error || maxError}
//               helperText={
//                 error ? 'Please select at least one activity' : 
//                 maxError ? 'You can select a maximum of 5 activities' : ''
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

// export default Q7;

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

const Q7 = ({ handleNext, handleAnswerChange }) => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [error, setError] = useState(false);
  const [maxError, setMaxError] = useState(false);

  const activities = [
    'Reading', 'Meditate', 'Hiking', 'Listen to music', 'Yoga', 
    'Exercise', 'Cycling', 'Running', 'Sleeping', 'Spa treatment'
  ];

  const handleSubmit = () => {
    if (selectedActivities.length === 0) {
      setError(true);
      return;
    }
    const answer = {
      relaxationActivities: selectedActivities,
    };
    console.log("Submitting answer for relaxation activities:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 7: What do you do to relax on your off time?</h2>
        
        <Autocomplete
          style={{ width: '100%', textAlign:"center" }}
          multiple
          freeSolo
          id="tags-outlined"
          options={activities}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          value={selectedActivities}
          onChange={(event, newValue) => {
            if (newValue.length > 7) {
              setMaxError(true);
              return;
            }
            setMaxError(false);
            const uniqueActivities = newValue.filter((activity, index) => newValue.indexOf(activity) === index);
            setSelectedActivities(uniqueActivities);
            setError(false);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search activities"
              placeholder="Activities"
              error={error || maxError}
              helperText={
                error ? 'Please select at least one activity' : 
                maxError ? 'You can select a maximum of 7 activities' : ''
              }
              sx={error || maxError ? { animation: `${vibration} 0.3s ease` } : {}}
              style={{width:"100%"}}
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

export default Q7;

