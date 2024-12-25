// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material';

// const Q14 = ({ handleNext, handleAnswerChange }) => {
//   const readingPreferences = [
//     'Books', 'Summaries', 'Both'
//   ];
  
//   const [selectedPreference, setSelectedPreference] = useState(readingPreferences[0]);
//   const [error, setError] = useState(false);

//   const handlePreferenceChange = (e) => {
//     setSelectedPreference(e.target.value);
//     setError(false);
//   };

//   const handleSubmit = () => {
//     if (!selectedPreference) {
//       setError(true);
//       return;
//     }
//     const answer = { readingPreference: selectedPreference };
//     console.log("Submitting answer for reading preference:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 14: Do you prefer reading books or summaries?</h2>
//       <FormControl component="fieldset" error={error && !selectedPreference}>
//         <RadioGroup
//           aria-labelledby='reading-preferences-group'
//           name='reading-preferences-group'
//           value={selectedPreference}
//           onChange={handlePreferenceChange}
//         >
//           {readingPreferences.map((preference, index) => (
//             <FormControlLabel key={index} value={preference} control={<Radio />} label={preference} />
//           ))}
//         </RadioGroup>
//         {error && !selectedPreference && <FormHelperText>Please select an option</FormHelperText>}
//       </FormControl>

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q14;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Q14 = ({ handleNext, handleAnswerChange }) => {
  const readingPreferences = [
    'Books', 'Summaries', 'Both'
  ];
  
  const [selectedPreference, setSelectedPreference] = useState(readingPreferences[0]);
  const [error, setError] = useState(false);

  const handlePreferenceChange = (e) => {
    setSelectedPreference(e.target.value);
    setError(false);
  };

  const handleSubmit = () => {
    if (!selectedPreference) {
      setError(true);
      return;
    }
    const answer = { readingPreference: selectedPreference };
    console.log("Submitting answer for reading preference:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 14: Do you prefer reading books or summaries?</h2>
      <FormControl component="fieldset" error={error && !selectedPreference}>
        <RadioGroup
          aria-labelledby='reading-preferences-group'
          name='reading-preferences-group'
          value={selectedPreference}
          onChange={handlePreferenceChange}
        >
          {readingPreferences.map((preference, index) => (
            <FormControlLabel key={index} value={preference} control={<Radio />} label={preference} />
          ))}
        </RadioGroup>
        {error && !selectedPreference && <FormHelperText>Please select an option</FormHelperText>}
      </FormControl>

      <Button
        className="mt-10 w-60"
        variant="outlined"
        onClick={handleSubmit}
        endIcon={<ArrowForwardIcon />}
      >
        Next!
      </Button>
    </>
  );
};

export default Q14;
