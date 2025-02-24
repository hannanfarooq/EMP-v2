// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material';

// const Q11 = ({ handleNext, handleAnswerChange }) => {
//   const personalityTypes = [
//     'Social Butterfly', 'Introvert', 'Family Person', 'Extrovert', 'Workaholic'
//   ];
  
//   const [selectedPersonality, setSelectedPersonality] = useState(personalityTypes[0]);
//   const [error, setError] = useState(false);

//   const handlePersonalityChange = (e) => {
//     setSelectedPersonality(e.target.value);
//     setError(false);
//   };

//   const handleSubmit = () => {
//     if (!selectedPersonality) {
//       setError(true);
//       return;
//     }
//     const answer = { personalityType: selectedPersonality };
//     console.log("Submitting answer for personality type:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 11: What describes you most?</h2>
//       <FormControl component="fieldset" error={error && !selectedPersonality}>
//         <RadioGroup
//           aria-labelledby='personality-types-group'
//           name='personality-types-group'
//           value={selectedPersonality}
//           onChange={handlePersonalityChange}
//         >
//           {personalityTypes.map((type, index) => (
//             <FormControlLabel key={index} value={type} control={<Radio />} label={type} />
//           ))}
//         </RadioGroup>
//         {error && !selectedPersonality && <FormHelperText>Please select an option</FormHelperText>}
//       </FormControl>

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q11;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Q11 = ({ handleNext, handleAnswerChange }) => {
  const personalityTypes = [
    'Social Butterfly', 'Introvert', 'Family Person', 'Extrovert', 'Workaholic'
  ];
  
  const [selectedPersonality, setSelectedPersonality] = useState(personalityTypes[0]);
  const [error, setError] = useState(false);

  const handlePersonalityChange = (e) => {
    setSelectedPersonality(e.target.value);
    setError(false);
  };

  const handleSubmit = () => {
    if (!selectedPersonality) {
      setError(true);
      return;
    }
    const answer = { personalityType: selectedPersonality };
    console.log("Submitting answer for personality type:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 11: What describes you most?</h2>
      <FormControl component="fieldset" error={error && !selectedPersonality}>
        <RadioGroup
          aria-labelledby='personality-types-group'
          name='personality-types-group'
          value={selectedPersonality}
          onChange={handlePersonalityChange}
        >
          {personalityTypes.map((type, index) => (
            <FormControlLabel key={index} value={type} control={<Radio />} label={type} />
          ))}
        </RadioGroup>
        {error && !selectedPersonality && <FormHelperText>Please select an option</FormHelperText>}
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

export default Q11;
