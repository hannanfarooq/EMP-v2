// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material';

// const Q9 = ({ handleNext, handleAnswerChange }) => {
//   const engagementMethods = [
//     'Email', 'WhatsApp', 'Social Media', 'Phone Calls', 'Face to Face Conversation'
//   ];
  
//   const [selectedEngagement, setSelectedEngagement] = useState(engagementMethods[0]);
//   const [error, setError] = useState(false);

//   const handleEngagementChange = (e) => {
//     setSelectedEngagement(e.target.value);
//     setError(false);
//   };

//   const handleSubmit = () => {
//     if (!selectedEngagement) {
//       setError(true);
//       return;
//     }
//     const answer = { engagementMethod: selectedEngagement };
//     console.log("Submitting answer for engagement method:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 9: How do you prefer to engage?</h2>
//       <FormControl component="fieldset" error={error && !selectedEngagement}>
//         <RadioGroup
//           aria-labelledby='engagement-methods-group'
//           name='engagement-methods-group'
//           value={selectedEngagement}
//           onChange={handleEngagementChange}
//         >
//           {engagementMethods.map((method, index) => (
//             <FormControlLabel key={index} value={method} control={<Radio />} label={method} />
//           ))}
//         </RadioGroup>
//         {error && !selectedEngagement && <FormHelperText>Please select an option</FormHelperText>}
//       </FormControl>

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q9;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Q9 = ({ handleNext, handleAnswerChange }) => {
  const engagementMethods = [
    'Email', 'WhatsApp', 'Social Media', 'Phone Calls', 'Face to Face Conversation'
  ];

  const [selectedEngagement, setSelectedEngagement] = useState(engagementMethods[0]);
  const [error, setError] = useState(false);

  const handleEngagementChange = (e) => {
    setSelectedEngagement(e.target.value);
    setError(false);
  };

  const handleSubmit = () => {
    if (!selectedEngagement) {
      setError(true);
      return;
    }
    const answer = { engagementMethod: selectedEngagement };
    console.log("Submitting answer for engagement method:", answer);
    handleAnswerChange(answer, 'preference'); // Save the answer in the preference category
    handleNext();
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 9: How do you prefer to engage?</h2>
      <FormControl component="fieldset" error={error && !selectedEngagement}>
        <RadioGroup
          aria-labelledby='engagement-methods-group'
          name='engagement-methods-group'
          value={selectedEngagement}
          onChange={handleEngagementChange}
        >
          {engagementMethods.map((method, index) => (
            <FormControlLabel key={index} value={method} control={<Radio />} label={method} />
          ))}
        </RadioGroup>
        {error && !selectedEngagement && <FormHelperText>Please select an option</FormHelperText>}
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

export default Q9;
