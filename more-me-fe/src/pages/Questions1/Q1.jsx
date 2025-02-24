// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

// const Q1 = ({ handleNext, handleAnswerChange }) => {
//   const [selectedGender, setSelectedGender] = useState('male');

//   const handleSubmit = () => {
//     const answer = { gender: selectedGender };
//     console.log("Submitting answer for Q1:", answer);
//     handleAnswerChange(answer); // Save the answer as { gender: "selectedGender" }
//     handleNext(answer); // Pass the new answer to handleNext
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 1: Select Gender?</h2>

//       <FormControl>
//         <RadioGroup
//           aria-labelledby='demo-radio-buttons-group-label'
//           name='radio-buttons-group'
//           value={selectedGender}
//           onChange={(e) => setSelectedGender(e.target.value)}
//         >
//           <FormControlLabel className='text-s' value='male' control={<Radio />} label='Male' />
//           <FormControlLabel className='text-s' value='female' control={<Radio />} label='Female' />
//           <FormControlLabel className='text-s' value='Prefer not to say' control={<Radio />} label='Prefer not to say' />
//         </RadioGroup>
//       </FormControl>

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>
//         Next!
//       </Button>
//     </>
//   );
// };

// export default Q1;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Q1 = ({ handleNext, handleAnswerChange }) => {
  const [selectedGender, setSelectedGender] = useState('male');

  const handleSubmit = () => {
    const answer = { gender: selectedGender };
    console.log("Submitting answer for Q1:", answer);
    handleAnswerChange(answer, 'persona'); // Save the answer in the persona category
    handleNext(answer); // Pass the new answer to handleNext
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 1: Select Gender?</h2>

      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <FormControlLabel className='text-s' value='male' control={<Radio />} label='Male' />
          <FormControlLabel className='text-s' value='female' control={<Radio />} label='Female' />
          <FormControlLabel className='text-s' value='other' control={<Radio />} label='Prefer not to say' />
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

export default Q1;
