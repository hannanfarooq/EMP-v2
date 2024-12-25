// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

// const Q2 = ({ handleNext, handleAnswerChange }) => {
//   const [selectedAge, setSelectedAge] = useState('18 - 24');

//   const handleSubmit = () => {
//     const answer = { age: selectedAge };
//     console.log("Submitting answer for Q2:", answer);
//     handleAnswerChange(answer); // Save the answer as { age: selectedAge }
//     handleNext(answer); // Move to the next question
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 2: Tell us about your age?</h2>
//       <p className='text-l font-semibold text-slate-700 mt-3 mb-6'>Select your age.</p>
//       <FormControl>
//         <RadioGroup
//           aria-labelledby='demo-radio-buttons-group-label'
//           name='radio-buttons-group'
//           value={selectedAge}
//           onChange={(e) => setSelectedAge(e.target.value)}
//         >
//           <FormControlLabel className='text-s' value='18 - 24' control={<Radio />} label='18 - 24' />
//           <FormControlLabel className='text-s' value='25 - 34' control={<Radio />} label='25 - 34' />
//           <FormControlLabel className='text-s' value='35 - 44' control={<Radio />} label='35 - 44' />
//           <FormControlLabel className='text-s' value='45 - 54' control={<Radio />} label='45 - 54' />
//           <FormControlLabel className='text-s' value='55+' control={<Radio />} label='55+' />
//         </RadioGroup>
//       </FormControl>

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q2;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Q2 = ({ handleNext, handleAnswerChange }) => {
  const [selectedAge, setSelectedAge] = useState('18 - 24');

  const handleSubmit = () => {
    const answer = { ageRange: selectedAge };
    console.log("Submitting answer for Q2:", answer);
    handleAnswerChange(answer, 'persona'); // Save the answer in the persona category
    handleNext(answer); // Move to the next question
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 2: Tell us about your age?</h2>
      <p className='text-l font-semibold text-slate-700 mt-3 mb-6'>Select your age.</p>
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
        >
          <FormControlLabel className='text-s' value='18 - 24' control={<Radio />} label='18 - 24' />
          <FormControlLabel className='text-s' value='25 - 34' control={<Radio />} label='25 - 34' />
          <FormControlLabel className='text-s' value='35 - 44' control={<Radio />} label='35 - 44' />
          <FormControlLabel className='text-s' value='45 - 54' control={<Radio />} label='45 - 54' />
          <FormControlLabel className='text-s' value='55+' control={<Radio />} label='55+' />
        </RadioGroup>
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

export default Q2;

