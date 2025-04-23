  // import React, { useState } from 'react';
  // import { Button, TextField, Box } from '@mui/material';
  // import { keyframes } from '@mui/system';
  // import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

  
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
  
  // const Q4 = ({ handleNext, handleAnswerChange }) => {
  //   const [dateOfBirth, setDateOfBirth] = useState('');
  //   const [error, setError] = useState(false);
  
  //   // Get today's date in YYYY-MM-DD format
  //   const today = new Date().toISOString().split('T')[0];
  
  //   const handleSubmit = () => {
  //     if (!dateOfBirth) {
  //       setError(true);
  //       return;
  //     }
  
  //     const answer = { dateOfBirth };
  //     console.log("Submitting answer for Q4:", answer);
  //     handleAnswerChange(answer, 'persona'); // Save the answer in the persona category
  //     handleNext(); // Move to the next question
  //   };
  
  //   return (
  //     <>
  //       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 4: Tell us your date of birth?</h2>
  //       <p className='text-l font-semibold text-slate-700 mt-3 mb-6'>Select your date of birth.</p>
  //       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //         {/* <TextField
  //           id="date"
  //           label="Date of Birth"
  //           type="date"
  //           value={dateOfBirth}
  //           onChange={(e) => {
  //             setDateOfBirth(e.target.value);
  //             setError(false);
  //           }}
  //           InputLabelProps={{
  //             shrink: true,
  //           }}
  //           inputProps={{
  //             max: today, // Disable future dates
  //           }}
  //           error={error}
  //           helperText={error ? "Date of birth is required" : ""}
  //           sx={error ? { animation: `${vibration} 0.3s ease` } : {}}
  //         /> */}
  //         <TextField
  //           id="date"
  //           label="Date of Birth"
  //           type="date"
  //           value={dateOfBirth}
  //           onChange={(e) => {
  //             setDateOfBirth(e.target.value);
  //             setError(false);
  //             e.target.blur(); // Programmatically remove focus to close the date picker in Safari
  //           }}
  //           InputLabelProps={{
  //             shrink: true,
  //           }}
  //           inputProps={{
  //             max: today, // Disable future dates
  //           }}
  //           error={error}
  //           helperText={error ? "Date of birth is required" : ""}
  //           sx={error ? { animation: `${vibration} 0.3s ease` } : {}}
  //         />
  //         <Button
  //           className="mt-10 w-60"
  //           variant="outlined"
  //           onClick={handleSubmit}
  //           endIcon={<ArrowForwardIcon />}
  //         >
  //           Next!
  //         </Button>
  //       </Box>
  //     </>
  //   );
  // };
  
  // export default Q4;
  

  import React, { useState } from 'react';
import { Button, TextField, Box, FormControl, InputLabel } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Include date picker styles

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

const Q4 = ({ handleNext, handleAnswerChange }) => {
  const [dateOfBirth, setDateOfBirth] = useState(null); // Use null as initial state
  const [error, setError] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!dateOfBirth) {
      setError(true);
      return;
    }

    const answer = { dateOfBirth };
    console.log("Submitting answer for Q4:", answer);
    handleAnswerChange(answer, 'persona'); // Save the answer in the persona category
    handleNext(); // Move to the next question
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 4: Tell us your date of birth?</h2>
      <p className='text-l font-semibold text-slate-700 mt-3 mb-6'>Select your date of birth.</p>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Custom DatePicker for Date of Birth */}
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="dateOfBirth"></InputLabel>
          <DatePicker
            selected={dateOfBirth}
            onChange={(date) => {
              setDateOfBirth(date);
              setError(false); // Reset error on valid date change
            }}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date(today)} // Ensure the date is not in the future
            customInput={
              <TextField
                id="dateOfBirth"
                label="Date of Birth"
                value={dateOfBirth ? dateOfBirth.toLocaleDateString("en-GB") : ''}
                error={error && !dateOfBirth}
                helperText={error && !dateOfBirth ? "Date of birth is required" : ""}
                sx={error && !dateOfBirth ? { animation: `${vibration} 0.3s ease` } : {}}
                InputLabelProps={{
                  shrink: true, // Ensures label floats above the input
                }}
                placeholder="dd/mm/yyyy"
                InputProps={{
                  endAdornment: <span>📅</span>,
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

export default Q4;