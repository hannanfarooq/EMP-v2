// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel, TextField, Box } from '@mui/material';
// import { keyframes } from "@mui/system";

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

// const Q3 = ({ handleNext, handleAnswerChange }) => {
//   const [selectedStatus, setSelectedStatus] = useState('Single');
//   const [spouseName, setSpouseName] = useState('');
//   const [spouseDOB, setSpouseDOB] = useState('');
//   const [error, setError] = useState(false);

//   const today = new Date().toISOString().split('T')[0];

//   const handleSubmit = () => {
//     if ((selectedStatus === 'Married' || selectedStatus === 'Engaged' || selectedStatus === 'Widowed') && (spouseName === '' || spouseDOB === '')) {
//       setError(true);
//       return;
//     }
//     const answer = {
//       relationshipStatus: selectedStatus,
//       spouseName: selectedStatus !== 'Single' ? spouseName : '',
//       spouseDOB: selectedStatus !== 'Single' ? spouseDOB : ''
//     };
//     console.log("Submitting answer for Q3:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 3: Tell us about your relationship status?</h2>
//       <p className='text-l font-semibold text-slate-700 mt-3 mb-6'>Select your relationship status.</p>
//       <FormControl>
//         <RadioGroup
//           aria-labelledby='demo-radio-buttons-group-label'
//           name='radio-buttons-group'
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//         >
//           <FormControlLabel className='text-s' value='Single' control={<Radio />} label='Single' />
//           <FormControlLabel className='text-s' value='Married' control={<Radio />} label='Married' />
//           <FormControlLabel className='text-s' value='Engaged' control={<Radio />} label='Engaged' />
//           <FormControlLabel className='text-s' value='Widowed' control={<Radio />} label='Widowed' />
//         </RadioGroup>
//       </FormControl>

//       {(selectedStatus === 'Married' || selectedStatus === 'Engaged' || selectedStatus === 'Widowed') && (
//         <>
//           <Box
//             sx={{
//               animation: error && spouseName === '' ? `${vibration} 0.3s linear` : 'none'
//             }}
//           >
//             <TextField
//               style={{ width: "100%" }}
//               label='Spouse Name'
//               value={spouseName}
//               onChange={(e) => setSpouseName(e.target.value)}
//               margin='normal'
//               error={error && spouseName === ''}
//               helperText={error && spouseName === '' ? 'Spouse name is required' : ''}
//             />
//           </Box>
//           <Box
//             sx={{
//               animation: error && spouseDOB === '' ? `${vibration} 0.3s linear` : 'none'
//             }}
//           >
//             <TextField
//               type='date'
//               label='Spouse Date of Birth'
//               value={spouseDOB}
//               onChange={(e) => setSpouseDOB(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//               inputProps={{ max: today }}
//               margin='normal'
//               error={error && spouseDOB === ''}
//               helperText={error && spouseDOB === '' ? 'Spouse date of birth is required' : ''}
//             />
//           </Box>
//         </>
//       )}

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q3;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, TextField, Box } from '@mui/material';
import { keyframes } from "@mui/system";
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

const Q3 = ({ handleNext, handleAnswerChange }) => {
  const [selectedStatus, setSelectedStatus] = useState('Single');
  const [spouseName, setSpouseName] = useState('');
  const [spouseDOB, setSpouseDOB] = useState('');
  const [error, setError] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    if ((selectedStatus === 'Married' || selectedStatus === 'Engaged' || selectedStatus === 'Widowed') && (spouseName === '' || spouseDOB === '')) {
      setError(true);
      return;
    }
    const answer = {
      relationshipStatus: selectedStatus,
      spouseName: selectedStatus !== 'Single' ? spouseName : '',
      spouseDOB: selectedStatus !== 'Single' ? spouseDOB : ''
    };
    console.log("Submitting answer for Q3:", answer);
    handleAnswerChange(answer, 'persona'); // Save the answer in the persona category
    handleNext(); // Move to the next question
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 3: Tell us about your relationship status?</h2>
      <p className='text-l font-semibold text-slate-700 mt-3 mb-6'>Select your relationship status.</p>
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <FormControlLabel className='text-s' value='Single' control={<Radio />} label='Single' />
          <FormControlLabel className='text-s' value='Married' control={<Radio />} label='Married' />
          <FormControlLabel className='text-s' value='Engaged' control={<Radio />} label='Engaged' />
          <FormControlLabel className='text-s' value='Widowed' control={<Radio />} label='Widowed' />
        </RadioGroup>
      </FormControl>

      {(selectedStatus === 'Married' || selectedStatus === 'Engaged' || selectedStatus === 'Widowed') && (
        <>
          <Box
            sx={{
              animation: error && spouseName === '' ? `${vibration} 0.3s linear` : 'none'
            }}
          >
            <TextField
              style={{ width: "100%" }}
              label='Spouse Name'
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
              margin='normal'
              error={error && spouseName === ''}
              helperText={error && spouseName === '' ? 'Spouse name is required' : ''}
            />
          </Box>
          <Box
            sx={{
              animation: error && spouseDOB === '' ? `${vibration} 0.3s linear` : 'none'
            }}
          >
            {/* <TextField
              type='date'
              label='Spouse Date of Birth'
              value={spouseDOB}
              onChange={(e) => setSpouseDOB(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
              margin='normal'
              error={error && spouseDOB === ''}
              helperText={error && spouseDOB === '' ? 'Spouse date of birth is required' : ''}
            /> */}
            <TextField
              type="date"
              label="Spouse Date of Birth"
              value={spouseDOB}
              onChange={(e) => {
                setSpouseDOB(e.target.value);
                // Programmatically blur the input after selection
                e.target.blur();
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
              margin="normal"
              error={error && spouseDOB === ''}
              helperText={error && spouseDOB === '' ? 'Spouse date of birth is required' : ''}
            />
          </Box>
        </>
      )}

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

export default Q3;
