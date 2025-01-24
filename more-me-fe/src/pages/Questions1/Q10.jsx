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

// const Q10 = ({ handleNext, handleAnswerChange }) => {
//   const [selectedInspirations, setSelectedInspirations] = useState([]);
//   const [error, setError] = useState(false);
//   const [maxError, setMaxError] = useState(false);

//   const inspirations = [
//     'Thought Leader: Simon Sinek', 
//     'Innovator: Elon Musk', 
//     'Peace Activist: Nelson Mandela'
//   ];

//   const handleSubmit = () => {
//     if (selectedInspirations.length === 0) {
//       setError(true);
//       return;
//     }
//     const answer = {
//       lifePrincipleInspirations: selectedInspirations,
//     };
//     console.log("Submitting answer for life principles and success inspiration:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <Box display="flex" flexDirection="column" alignItems="center">
//         <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 10: Whose life principles and success inspire you the most?</h2>
        
//         <Autocomplete
//           multiple
//           freeSolo
//           id="tags-outlined"
//           options={inspirations}
//           getOptionLabel={(option) => option}
//           filterSelectedOptions
//           value={selectedInspirations}
//           onChange={(event, newValue) => {
//             if (newValue.length > 3) {
//               setMaxError(true);
//               return;
//             }
//             setMaxError(false);
//             const uniqueInspirations = newValue.filter((inspiration, index) => newValue.indexOf(inspiration) === index);
//             setSelectedInspirations(uniqueInspirations);
//             setError(false);
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               label="Search inspirations"
//               placeholder="Inspirations"
//               error={error || maxError}
//               helperText={
//                 error ? 'Please select at least one inspiration' : 
//                 maxError ? 'You can select a maximum of 3 inspirations' : ''
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

// export default Q10;

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

const Q10 = ({ handleNext, handleAnswerChange }) => {
  const [selectedInspirations, setSelectedInspirations] = useState([]);
  const [error, setError] = useState(false);
  const [maxError, setMaxError] = useState(false);

  const inspirations = [
    'Thought Leader: Simon Sinek',
    'Innovator: Elon Musk',
    'Peace Activist: Nelson Mandela',
    'Visionary: Steve Jobs',
    'Philanthropist: Bill Gates',
    'Motivational Speaker: Tony Robbins',
    'Environmentalist: Greta Thunberg',
    'Human Rights Advocate: Malala Yousafzai',
    'Author: Brené Brown',
    'Entrepreneur: Richard Branson'
  ];

  const handleSubmit = () => {
    if (selectedInspirations.length === 0) {
      setError(true);
      return;
    }
    const answer = {
      lifePrincipleInspirations: selectedInspirations,
    };
    console.log("Submitting answer for life principles and success inspiration:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 10: Whose life principles and success inspire you the most?</h2>
        
        <Autocomplete
          multiple
          freeSolo
          id="tags-outlined"
          options={inspirations}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          value={selectedInspirations}
          onChange={(event, newValue) => {
            if (newValue.length > 3) {
              setMaxError(true);
              return;
            }
            setMaxError(false);
            const uniqueInspirations = newValue.filter((inspiration, index) => newValue.indexOf(inspiration) === index);
            setSelectedInspirations(uniqueInspirations);
            setError(false);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search inspirations and life principles"
              placeholder="Inspirations"
              error={error || maxError}
              helperText={
                error ? 'Please select at least one inspiration' : 
                maxError ? 'You can select a maximum of 3 inspirations' : ''
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

export default Q10;
