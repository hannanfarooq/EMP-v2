import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = (currentStep / totalSteps) * 100;
    setProgress(newProgress);
  }, [currentStep, totalSteps]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={1000}
      bgcolor="background.paper"
      p={1}
      boxShadow={3}
    >
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        <Box position="relative" width="100%">
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 25, transition: 'width 2.5s ease' }} 
          />
          <Box 
            position="absolute" 
            top="0" 
            left="50%" 
            transform="translate(-50%, -50%)"
          >
            <Typography variant="body2" sx={{ color: 'white' }}>
              {`Progress ${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressBar;
