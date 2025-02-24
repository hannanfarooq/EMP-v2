// import React from 'react';
// import { IconButton } from '@mui/material';
// import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

// const SampleNextArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <IconButton
//       className={className}
//       style={{ ...style, display: 'block', right: 0, zIndex: 1 }}
//       onClick={onClick}
//     >
//       <ArrowForwardIos />
//     </IconButton>
//   );
// };

// const SamplePrevArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <IconButton
//       className={className}
//       style={{ ...style, display: 'block', left: 0, zIndex: 1 }}
//       onClick={onClick}
//     >
//       <ArrowBackIos />
//     </IconButton>
//   );
// };

// export { SampleNextArrow, SamplePrevArrow };


import React from 'react';
import { IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      className={className}
      style={{ ...style, display: 'block', right: '10px', zIndex: 1 }} // Position adjusted
      onClick={onClick}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      className={className}
      style={{ ...style, display: 'block', left: '10px', zIndex: 1 }} // Position adjusted
      onClick={onClick}
    >
      <ArrowBackIos />
    </IconButton>
  );
};

export { SampleNextArrow, SamplePrevArrow };
