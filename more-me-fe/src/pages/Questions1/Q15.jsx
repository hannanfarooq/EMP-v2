// import React, { useState } from 'react';
// import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Box } from '@mui/material';
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

// const Q15 = ({ handleNext, handleAnswerChange }) => {
//   const contentPreferences = [
//     'Reading', 'Video', 'Podcast'
//   ];
  
//   const [selectedPreferences, setSelectedPreferences] = useState([]);
//   const [error, setError] = useState(false);

//   // Handles changes in the checkboxes
//   const handlePreferenceChange = (e) => {
//     const { value, checked } = e.target;
//     setSelectedPreferences((prev) => 
//       checked ? [...prev, value] : prev.filter((pref) => pref !== value)
//     );
//     setError(false);
//   };

//   // Handles form submission
//   const handleSubmit = () => {
//     if (selectedPreferences.length === 0) {
//       setError(true);
//       return;
//     }
//     const answer = { contentPreferences: selectedPreferences };
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 15: Do you prefer reading, video, or podcast?</h2>
//       <FormControl component="fieldset" error={error && selectedPreferences.length === 0} sx={error ? { animation: `${vibration} 0.3s ease` } : {}}>
//         <FormGroup>
//           {contentPreferences.map((preference, index) => (
//             <FormControlLabel 
//               key={index} 
//               control={
//                 <Checkbox 
//                   checked={selectedPreferences.includes(preference)} 
//                   onChange={handlePreferenceChange} 
//                   value={preference} 
//                 />
//               } 
//               label={preference} 
//             />
//           ))}
//         </FormGroup>
//         {error && selectedPreferences.length === 0 && <FormHelperText>Please select at least one option</FormHelperText>}
//       </FormControl>

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q15;

import React, { useState } from 'react';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { keyframes } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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

const Q15 = ({ handleNext, handleAnswerChange }) => {
  const contentPreferences = [
    'Reading Books', 'Reading Articles', 'Watching video clips', 'Listening to Podcast', 'Webinars or conferences'
  ];
  
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [error, setError] = useState(false);

  // Handles changes in the checkboxes
  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPreferences((prev) => 
      checked ? [...prev, value] : prev.filter((pref) => pref !== value)
    );
    setError(false);
  };

  // Handles form submission
  const handleSubmit = () => {
    if (selectedPreferences.length === 0) {
      setError(true);
      return;
    }
    const answer = { contentPreferences: selectedPreferences };
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 15: How to prefer to gather information through?</h2>
      <FormControl component="fieldset" error={error && selectedPreferences.length === 0} sx={error ? { animation: `${vibration} 0.3s ease` } : {}}>
        <FormGroup>
          {contentPreferences.map((preference, index) => (
            <FormControlLabel 
              key={index} 
              control={
                <Checkbox 
                  checked={selectedPreferences.includes(preference)} 
                  onChange={handlePreferenceChange} 
                  value={preference} 
                />
              } 
              label={preference} 
            />
          ))}
        </FormGroup>
        {error && selectedPreferences.length === 0 && <FormHelperText>Please select at least one option</FormHelperText>}
      </FormControl>

      <Button
        className="mt-10 w-60"
        variant="outlined"
        onClick={handleSubmit}
        endIcon={<CheckCircleIcon />}
      >
        Submit!
      </Button>
    </>
  );
};

export default Q15;
