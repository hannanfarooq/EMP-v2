// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel, Box, TextField } from '@mui/material';
// import { keyframes } from '@mui/system';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css"; // Include date picker styles

// // Define vibration animation
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
//   const [spouseDOB, setSpouseDOB] = useState(null); // Start with null for DatePicker
//   const [error, setError] = useState(false);

//   const today = new Date().toISOString().split('T')[0];

//   const handleSubmit = () => {
//     // Error handling logic: only apply to married/engaged/widowed statuses
//     if ((selectedStatus === 'Married' || selectedStatus === 'Engaged' || selectedStatus === 'Widowed') && (!spouseName || !spouseDOB)) {
//       setError(true);
//       return;
//     }

//     const answer = {
//       relationshipStatus: selectedStatus,
//       spouseName: selectedStatus !== 'Single' ? spouseName : '',
//       spouseDOB: selectedStatus !== 'Single' ? spouseDOB : '' // Only include DOB if not Single
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
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <TextField
//               label="Spouse Name"
//               value={spouseName}
//               onChange={(e) => setSpouseName(e.target.value)}
//               error={error && !spouseName}
//               helperText={error && !spouseName ? "Spouse name is required" : ""}
//               sx={error && !spouseName ? { animation: `${vibration} 0.3s ease` } : {}}
//               margin="normal"
//             />
            
//             <DatePicker
//               selected={spouseDOB}
//               onChange={(date) => {
//                 setSpouseDOB(date);
//                 setError(false); // Reset error on valid date change
//               }}
//               dateFormat="dd/MM/yyyy"
//               maxDate={new Date(today)} // Ensure the date is not in the future
//               customInput={
//                 <TextField
//                   error={error && !spouseDOB}
//                   helperText={error && !spouseDOB ? "Spouse date of birth is required" : ""}
//                   sx={error && !spouseDOB ? { animation: `${vibration} 0.3s ease` } : {}}
//                   placeholder="dd/mm/yyyy"
//                   InputProps={{
//                     endAdornment: <span>📅</span>,
//                   }}
//                 />
//               }
//               isClearable={false}
//               placeholderText="dd/mm/yyyy"
//               inline={false}
//               popperModifiers={{
//                 preventOverflow: { enabled: true, boundariesElement: 'viewport' },
//                 hide: { enabled: true },
//               }}
//             />
//           </Box>
//         </>
//       )}

//       <Button
//         className="mt-10 w-60"
//         variant="outlined"
//         onClick={handleSubmit}
//         endIcon={<ArrowForwardIcon />}
//       >
//         Next!
//       </Button>
//     </>
//   );
// };

// export default Q3;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, Box, TextField, InputLabel } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Include date picker styles

// Define vibration animation
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
  const [spouseDOB, setSpouseDOB] = useState(null); // Start with null for DatePicker
  const [error, setError] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    // Error handling logic: only apply to married/engaged/widowed statuses
    if ((selectedStatus === 'Married' || selectedStatus === 'Engaged' || selectedStatus === 'Widowed') && (!spouseName || !spouseDOB)) {
      setError(true);
      return;
    }

    const answer = {
      relationshipStatus: selectedStatus,
      spouseName: selectedStatus !== 'Single' ? spouseName : '',
      spouseDOB: selectedStatus !== 'Single' ? spouseDOB : '' // Only include DOB if not Single
    };
    console.log("Submitting answer for Q3:", answer);
    handleAnswerChange(answer);
    handleNext();
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              label="Spouse Name"
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
              error={error && !spouseName}
              helperText={error && !spouseName ? "Spouse name is required" : ""}
              sx={error && !spouseName ? { animation: `${vibration} 0.3s ease` } : {}}
              margin="normal"
            />

            {/* Label for Spouse Date of Birth */}
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="spouseDOB"></InputLabel>
              <DatePicker
                selected={spouseDOB}
                onChange={(date) => {
                  setSpouseDOB(date);
                  setError(false); // Reset error on valid date change
                }}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date(today)} // Ensure the date is not in the future
                customInput={
                  <TextField
                    id="spouseDOB"
                    label="Spouse Date of Birth"
                    value={spouseDOB ? spouseDOB.toLocaleDateString("en-GB") : ''}
                    error={error && !spouseDOB}
                    helperText={error && !spouseDOB ? "Spouse date of birth is required" : ""}
                    sx={error && !spouseDOB ? { animation: `${vibration} 0.3s ease` } : {}}
                    placeholder="dd/mm/yyyy"
                    InputProps={{
                      endAdornment: <span>📅</span>,
                    }}
                    InputLabelProps={{
                      shrink: true, // Ensures label floats above the input
                    }}
                  />
                }
                isClearable={false}
                placeholderText="dd/mm/yyyy"
                inline={false}
                popperModifiers={{
                  preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                  hide: { enabled: true },
                }}
              />
            </FormControl>
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
