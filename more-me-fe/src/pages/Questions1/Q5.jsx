// import React, { useState } from 'react';
// import { Button, Radio, RadioGroup, FormControl, FormControlLabel, TextField, Box } from '@mui/material';
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

// const Q5 = ({ handleNext, handleAnswerChange }) => {
//   const [hasChildren, setHasChildren] = useState('no');
//   const [numChildren, setNumChildren] = useState(0);
//   const [childrenNames, setChildrenNames] = useState([]);
//   const [childrenDOBs, setChildrenDOBs] = useState([]);
//   const [error, setError] = useState(false);

//   const today = new Date().toISOString().split('T')[0];

//   const handleChildrenChange = (e) => {
//     const value = e.target.value;
//     setHasChildren(value);
//     if (value === 'no') {
//       setNumChildren(0);
//       setChildrenNames([]);
//       setChildrenDOBs([]);
//       setError(false);
//     }
//   };

//   const handleNumChildrenChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     if (isNaN(value) || value <= 0) {
//       setNumChildren(0);
//       setChildrenNames([]);
//       setChildrenDOBs([]);
//     } else {
//       setNumChildren(value);
//       setChildrenNames(Array(value).fill(''));
//       setChildrenDOBs(Array(value).fill(''));
//     }
//     setError(false);
//   };

//   const handleNameChange = (index, value) => {
//     const newNames = [...childrenNames];
//     newNames[index] = value;
//     setChildrenNames(newNames);
//     setError(false);
//   };

//   const handleDOBChange = (index, value) => {
//     const newDOBs = [...childrenDOBs];
//     newDOBs[index] = value;
//     setChildrenDOBs(newDOBs);
//     setError(false);
//   };

//   const handleSubmit = () => {
//     if (hasChildren === 'yes') {
//       if (numChildren <= 0 || childrenNames.includes('') || childrenDOBs.includes('')) {
//         setError(true);
//         return;
//       }
//     }
//     const answer = {
//       hasChildren,
//       numChildren: hasChildren === 'yes' ? numChildren : 0,
//       childrenNames: hasChildren === 'yes' ? childrenNames : [],
//       childrenDOBs: hasChildren === 'yes' ? childrenDOBs : [],
//     };
//     console.log("Submitting answer:", answer);
//     handleAnswerChange(answer);
//     handleNext();
//   };

//   return (
//     <>
//       <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 5: Do you have children?</h2>
//       <FormControl>
//         <RadioGroup
//           aria-labelledby='children-question'
//           name='children-question'
//           value={hasChildren}
//           onChange={handleChildrenChange}
//         >
//           <FormControlLabel value='yes' control={<Radio />} label='Yes' />
//           <FormControlLabel value='no' control={<Radio />} label='No' />
//         </RadioGroup>
//       </FormControl>

//       {hasChildren === 'yes' && (
//         <>
//           <TextField
//             type='number'
//             label='How many children?'
//             value={numChildren}
//             onChange={handleNumChildrenChange}
//             inputProps={{ min: 1 }}
//             margin='normal'
//             required
//             error={error && numChildren <= 0}
//             helperText={error && numChildren <= 0 ? 'Number of children is required' : ''}
//             sx={error && numChildren <= 0 ? { animation: `${vibration} 0.3s ease` } : {}}
//           />
//           {Array.from({ length: numChildren }, (_, index) => (
//             <Box key={index} sx={{ mb: 2 }}>
//               <TextField
//                 label={`Child ${index + 1} Name`}
//                 value={childrenNames[index]}
//                 onChange={(e) => handleNameChange(index, e.target.value)}
//                 margin='normal'
//                 required
//                 error={error && childrenNames[index] === ''}
//                 helperText={error && childrenNames[index] === '' ? 'Name is required' : ''}
//                 sx={error && childrenNames[index] === '' ? { animation: `${vibration} 0.3s ease` } : {}}
//               />
//               <TextField
//                 type='date'
//                 label={`Child ${index + 1} Date of Birth`}
//                 value={childrenDOBs[index]}
//                 onChange={(e) => handleDOBChange(index, e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{ max: today }}
//                 margin='normal'
//                 required
//                 error={error && childrenDOBs[index] === ''}
//                 helperText={error && childrenDOBs[index] === '' ? 'Date of birth is required' : ''}
//                 sx={error && childrenDOBs[index] === '' ? { animation: `${vibration} 0.3s ease` } : {}}
//               />
//             </Box>
//           ))}
//         </>
//       )}

//       <Button className='mt-10 w-60' variant='outlined' onClick={handleSubmit}>Next!</Button>
//     </>
//   );
// };

// export default Q5;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, TextField, Box } from '@mui/material';
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

const Q5 = ({ handleNext, handleAnswerChange }) => {
  const [hasChild, setHasChild] = useState('no');
  const [numChildren, setNumChildren] = useState(0);
  const [childrenNames, setChildrenNames] = useState([]);
  const [childrenDOBs, setChildrenDOBs] = useState([]);
  const [error, setError] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleChildrenChange = (e) => {
    const value = e.target.value;
    setHasChild(value);
    if (value === 'no') {
      setNumChildren(0);
      setChildrenNames([]);
      setChildrenDOBs([]);
      setError(false);
    }
  };

  const handleNumChildrenChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value <= 0) {
      setNumChildren(0);
      setChildrenNames([]);
      setChildrenDOBs([]);
    } else {
      setNumChildren(value);
      setChildrenNames(Array(value).fill(''));
      setChildrenDOBs(Array(value).fill(''));
    }
    setError(false);
  };

  const handleNameChange = (index, value) => {
    const newNames = [...childrenNames];
    newNames[index] = value;
    setChildrenNames(newNames);
    setError(false);
  };

  const handleDOBChange = (index, value) => {
    const newDOBs = [...childrenDOBs];
    newDOBs[index] = value;
    setChildrenDOBs(newDOBs);
    setError(false);
  };

  const handleSubmit = () => {
    if (hasChild === 'yes') {
      if (numChildren <= 0 || childrenNames.includes('') || childrenDOBs.includes('')) {
        setError(true);
        return;
      }
    }
    const answer = {
      hasChild,
      numChildren: hasChild === 'yes' ? numChildren : 0,
      childrenNames: hasChild === 'yes' ? childrenNames : [],
      childrenDOBs: hasChild === 'yes' ? childrenDOBs : [],
    };
    console.log("Submitting answer for Q5:", answer);
    handleAnswerChange(answer, 'persona'); // Save the answer in the persona category
    handleNext();
  };

  return (
    <>
      <h2 className='text-l font-semibold text-slate-700 mt-3 mb-6'>Question No 5: Do you have children?</h2>
      <FormControl>
        <RadioGroup
          aria-labelledby='children-question'
          name='children-question'
          value={hasChild}
          onChange={handleChildrenChange}
        >
          <FormControlLabel value='yes' control={<Radio />} label='Yes' />
          <FormControlLabel value='no' control={<Radio />} label='No' />
        </RadioGroup>
      </FormControl>

      {hasChild === 'yes' && (
        <>
          <TextField
            type='number'
            label='How many children?'
            value={numChildren}
            onChange={handleNumChildrenChange}
            inputProps={{ min: 1 }}
            margin='normal'
            required
            error={error && numChildren <= 0}
            helperText={error && numChildren <= 0 ? 'Number of children is required' : ''}
            sx={error && numChildren <= 0 ? { animation: `${vibration} 0.3s ease` } : {}}
          />
          {Array.from({ length: numChildren }, (_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                label={`Child ${index + 1} Name`}
                value={childrenNames[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                margin='normal'
                required
                error={error && childrenNames[index] === ''}
                helperText={error && childrenNames[index] === '' ? 'Name is required' : ''}
                sx={error && childrenNames[index] === '' ? { animation: `${vibration} 0.3s ease` } : {}}
              />
              <TextField
                type='date'
                label={`Child ${index + 1} Date of Birth`}
                value={childrenDOBs[index]}
                onChange={(e) => handleDOBChange(index, e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: today }}
                margin='normal'
                required
                error={error && childrenDOBs[index] === ''}
                helperText={error && childrenDOBs[index] === '' ? 'Date of birth is required' : ''}
                sx={error && childrenDOBs[index] === '' ? { animation: `${vibration} 0.3s ease` } : {}}
              />
            </Box>
          ))}
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

export default Q5;
