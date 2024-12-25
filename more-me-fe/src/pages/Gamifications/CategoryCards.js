// import React from 'react';
// import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import './SliderStyles.css';

// import { SampleNextArrow, SamplePrevArrow } from './CustomArrow';

// const CategoryCards = ({ categories, handleCategorySelect, completedCategories, retryTime }) => {
//   const lastCompletedCategoryId = completedCategories[completedCategories.length - 1];

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 3000,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     initialSlide: 0, // Set starting slide to 0
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };
  
//   return (
//     // <Box 
//     //   sx={{ 
//     //     maxWidth: {
//     //       xs: '400px',  // max width for extra-small screens
//     //       sm: '500px',   // max width for small screens
//     //       md: '600px',   // max width for medium screens
//     //       lg: '800px',   // max width for large screens
//     //       xl: '1000px'    // max width for extra-large screens
//     //     }, 
//     //     margin: 'auto', 
//     //     padding: {
//     //       xs: '10px',  // padding for extra-small screens
//     //       sm: '15px',  // padding for small screens
//     //       md: '20px',  // padding for medium screens
//     //       lg: '25px',  // padding for large screens
//     //       xl: '30px'   // padding for extra-large screens
//     //     } 
//     //   }}
//     // >
//       // <Slider {...settings}>
//       <>
//         {categories.map((category, index) => {
//           const isLocked = index > 0 && categories[index - 1].id !== lastCompletedCategoryId;

//           return (
//             <Box key={category.id} sx={{
//               width: '100%'
//             }}>
//               <Card className="category-card">
//                 <CardMedia
//                   component="img"
//                   alt={category.name}
//                   className="responsive-image"
//                   height="200"
//                   image={category.img || `https://random.imagecdn.app/500/${Math.floor(Math.random() * 1000)}`}
//                   title={"Category : " + category.name}
//                 />
//                 <CardContent>
//                   <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}>
//                     {category.name}
//                   </Typography>
//                   {retryTime && new Date() < retryTime ? (
//                     <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginTop: '10px' }}>
//                       Locked until {retryTime.toLocaleTimeString()}
//                     </Typography>
//                   ) : (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       disabled={isLocked}
//                       onClick={() => handleCategorySelect(category.id)}
//                       sx={{ display: 'block', margin: '10px auto 0' }}
//                     >
//                       {isLocked ? 'Locked' : 'Start Game'}
//                     </Button>
//                   )}
//                 </CardContent>
//                 {isLocked && (
//                   <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
//                     <Typography variant="h6">Locked</Typography>
//                   </Box>
//                 )}
//               </Card>
//             </Box>
//           );
//         })}
//       {/* </Slider> */}
// </>
//   );
// };

// export default CategoryCards;


// import React from 'react';
// import { Card, CardContent, CardMedia, Typography, Button, Box, Grid } from '@mui/material';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import './SliderStyles.css';

// const CategoryCards = ({ categories, handleCategorySelect, completedCategories, retryTime }) => {
//   const lastCompletedCategoryId = completedCategories[completedCategories.length - 1];

//   return (
//     <Grid container spacing={2} sx={{ padding: '20px' }}>
//       {categories.map((category, index) => {
//         const isLocked = index > 0 && categories[index - 1].id !== lastCompletedCategoryId;

//         return (
//           <Grid 
//             item 
//             key={category.id} 
//             xs={12} 
//             sm={6} 
//             md={6} 
//             lg={4} 
//             xl={4} // Controls the number of cards per row based on screen size
//           >
//             <Card className="category-card" sx={{ position: 'relative', height: '100%', minWidth:"100%", maxWidth:"100%" }}>
//               <CardMedia
//                 component="img"
//                 alt={category.name}
//                 className="responsive-image"
//                 height="200"
//                 image={category.img || `https://random.imagecdn.app/500/${Math.floor(Math.random() * 1000)}`}
//                 title={"Category : " + category.name}
//               />
//               <CardContent sx={{ textAlign: 'center' }}>
//                 <Typography gutterBottom variant="h6" component="div">
//                   {category.name}
//                 </Typography>
//                 {retryTime && new Date() < retryTime ? (
//                   <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
//                     Locked until {retryTime.toLocaleTimeString()}
//                   </Typography>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     disabled={isLocked}
//                     onClick={() => handleCategorySelect(category.id)}
//                     sx={{ margin: '10px auto 0' }}
//                   >
//                     {isLocked ? 'Locked' : 'Start Game'}
//                   </Button>
//                 )}
//               </CardContent>
//               {isLocked && (
//                 <Box sx={{ 
//                   position: 'absolute', 
//                   top: 0, 
//                   left: 0, 
//                   right: 0, 
//                   bottom: 0, 
//                   backgroundColor: 'rgba(0,0,0,0.5)', 
//                   display: 'flex', 
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   color: '#fff' 
//                 }}>
//                   <Typography variant="h6">Locked</Typography>
//                 </Box>
//               )}
//             </Card>
//           </Grid>
//         );
//       })}
//     </Grid>
//   );
// };

// export default CategoryCards;

// import React, { useState } from 'react';
// import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, CircularProgress } from '@mui/material';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import './SliderStyles.css';

// const CategoryCards = ({ categories, handleCategorySelect, completedCategories, retryTime }) => {
//   const lastCompletedCategoryId = completedCategories[completedCategories.length - 1];

//   // State to manage loading for each category image
//   const [loadingImages, setLoadingImages] = useState({});

//   const imagePaths = [
//     '/assets/images/game-images/game-5.jpg',
//     '/assets/images/game-images/game-2.jpg',
//     '/assets/images/game-images/game-3.jpg',
//     '/assets/images/game-images/game-4.jpg',
//     '/assets/images/game-images/game-5.jpg',
//     '/assets/images/game-images/game-6.jpg',
//   ];

//   const handleImageLoad = (id) => {
//     setLoadingImages((prev) => ({ ...prev, [id]: false }));
//   };

//   return (
//     <Grid container spacing={2} sx={{ padding: '20px' }}>
//       {categories.map((category, index) => {
//         const isLocked = index > 0 && categories[index - 1].id !== lastCompletedCategoryId;
        
//         // Get the corresponding image for the category
//         const image = imagePaths[index % imagePaths.length]; // Ensures it loops if there are more categories than images

//         return (
//           <Grid 
//             item 
//             key={category.id} 
//             xs={12} 
//             sm={6} 
//             md={6} 
//             lg={4} 
//             xl={4}
//             sx={{ height: '100%' }}
//           >
//             <Card className="category-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
//               {/* Display spinner until image loads */}
//               {loadingImages[category.id] !== false && (
//                 <Box 
//                   sx={{
//                     position: 'absolute', 
//                     top: 0, 
//                     left: 0, 
//                     right: 0, 
//                     bottom: 0, 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center', 
//                     backgroundColor: 'rgba(255,255,255,0.8)', 
//                     zIndex: 1
//                   }}
//                 >
//                   <CircularProgress />
//                 </Box>
//               )}
//               <CardMedia
//                 component="img"
//                 alt={category.name}
//                 className="responsive-image"
//                 height="200"
//                 image={image}
//                 title={"Category : " + category.name}
//                 onLoad={() => handleImageLoad(category.id)} // Remove spinner on image load
//               />
//               <CardContent sx={{ textAlign: 'center' }}>
//                 <Typography gutterBottom variant="h6" component="div">
//                   {category.name}
//                 </Typography>
//                 {retryTime && new Date() < retryTime ? (
//                   <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
//                     Locked until {retryTime.toLocaleTimeString()}
//                   </Typography>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     disabled={isLocked}
//                     onClick={() => handleCategorySelect(category.id)}
//                     sx={{ margin: '10px auto 0' }}
//                   >
//                     {isLocked ? 'Locked' : 'Start Game'}
//                   </Button>
//                 )}
//               </CardContent>
//               {isLocked && (
//                 <Box sx={{ 
//                   position: 'absolute', 
//                   top: 0, 
//                   left: 0, 
//                   right: 0, 
//                   bottom: 0, 
//                   backgroundColor: 'rgba(0,0,0,0.5)', 
//                   display: 'flex', 
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   color: '#fff' 
//                 }}>
//                   <Typography variant="h6">Locked</Typography>
//                 </Box>
//               )}
//             </Card>
//           </Grid>
//         );
//       })}
//     </Grid>
//   );
// };

// export default CategoryCards;

import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, CircularProgress } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SliderStyles.css';

const CategoryCards = ({ categories, handleCategorySelect, completedCategories, retryTime }) => {
  const lastCompletedCategoryId = completedCategories[completedCategories.length - 1];

  // State to manage loading for each category image
  const [loadingImages, setLoadingImages] = useState({});

  const imagePaths = [
        '/assets/images/game-images/game-5.jpg',
        '/assets/images/game-images/game-2.jpg',
        '/assets/images/game-images/game-3.jpg',
        '/assets/images/game-images/game-4.jpg',
        '/assets/images/game-images/game-5.jpg',
        '/assets/images/game-images/game-6.jpg',
      ];
    

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Grid container spacing={2} sx={{ padding: '20px' }}>
      {categories.map((category, index) => {
        const isLocked = index > 0 && categories[index - 1].id !== lastCompletedCategoryId;
        
        // Get the corresponding image for the category
        const image = imagePaths[index % imagePaths.length]; // Ensures it loops if there are more categories than images

        return (
          <Grid 
            item 
            key={category.id} 
            xs={12} 
            sm={6} 
            md={6} 
            lg={4} 
            xl={4}
            sx={{ height: '100%' }} // Ensures each grid item fills available height
          >
            <Card className="category-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Display spinner until image loads */}
              {loadingImages[category.id] !== false && (
                <Box 
                  sx={{
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    // backgroundColor: 'rgba(255,255,255,0.8)', 
                    zIndex: 1
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <CardMedia
                component="img"
                alt={category.name}
                className="responsive-image"
                height="200"
                image={image}
                title={"Category : " + category.name}
                onLoad={() => handleImageLoad(category.id)} // Remove spinner on image load
              />
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {category.name}
                </Typography>
                {retryTime && new Date() < retryTime ? (
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
                    Locked until {retryTime.toLocaleTimeString()}
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isLocked}
                    onClick={() => handleCategorySelect(category.id)}
                    sx={{ margin: '10px auto 0' }}
                  >
                    {isLocked ? 'Locked' : 'Start Game'}
                  </Button>
                )}
              </CardContent>
              {isLocked && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  backgroundColor: 'rgba(0,0,0,0.5)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  color: '#fff' 
                }}>
                  <Typography variant="h6">Locked</Typography>
                </Box>
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CategoryCards;
