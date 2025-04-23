import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  useTheme,
} from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SliderStyles.css';

const CategoryCards = ({ categories, subcategories, QuestionCategories,Games, handleCategorySelect, completedCategories, retryTime }) => {
  const [loadingImages, setLoadingImages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
console.log("questionCategories: ",QuestionCategories)
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

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return Array.isArray(completedCategories) && completedCategories.includes(categories[index - 1].id);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Show "Go Back" button when subcategories or question categories are visible */}
      {(selectedCategory || selectedSubCategory ||selectedGame) && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if(selectedGame)
            {
              setSelectedGame(null);
            }
            else if (selectedSubCategory) {
              setSelectedSubCategory(null); // Go back to Subcategories
            } else {
              setSelectedCategory(null); // Go back to Categories
            }
          }}
          sx={{ marginBottom: '20px' }}
        >
          Go Back
        </Button>
      )}

      <Grid container spacing={4}>
        {/* Show Categories */}
        {!selectedCategory &&
          categories.map((category, index) => {
            const isLocked = !isUnlocked(index);
            const image = imagePaths[index % imagePaths.length];

            return (
              <Grid item key={category.id} xs={12} sm={6} md={6} lg={4} xl={4} sx={{
                height: categories.length > 1 ? '50%' : '100%'
              }}
              >
                <Card className="category-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {loadingImages[category.id] !== false && (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      <CircularProgress />
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    alt={category.name}
                    className="responsive-image"
                    height="200"
                    image={image}
                    title={"Category: " + category.name}
                    onLoad={() => handleImageLoad(category.id)}
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
                        
                        onClick={() => setSelectedCategory(category.id)}
                        sx={{ margin: '10px auto 0' }}
                      >
                        { 'Show Subcategories'}
                      </Button>
                    )}
                  </CardContent>
                 
                </Card>
              </Grid>
            );
          })}

        {/* Show Subcategories when a category is selected */}
        {selectedCategory &&
          !selectedSubCategory &&
          (subcategories[selectedCategory] || []).map((sub, index) => {
            const image = imagePaths[index % imagePaths.length]; // Loop through images
            return (
              <Grid item key={sub.id} xs={12} sm={6} md={6} lg={4} xl={4} sx={{
                height: subcategories[selectedCategory].length > 1 ? '50%' : '100%'
              }}>
                <Card className="subcategory-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    alt={sub.name}
                    className="responsive-image"
                    height="200"
                    image={image}
                    title={"Subcategory: " + sub.name}
                  />
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {sub.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedSubCategory(sub.id)}
                      sx={{ margin: '10px auto 0' }}
                    >
                      Show Games 
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

{selectedCategory &&
          selectedSubCategory &&!selectedGame &&
          (Games[selectedSubCategory] || []).map((sub, index) => {
            const image = imagePaths[index % imagePaths.length]; // Loop through images
            return (
              <Grid item key={sub.id} xs={12} sm={6} md={6} lg={4} xl={4} sx={{
                height: Games[selectedSubCategory].length > 1 ? '50%' : '100%'
              }}>
                <Card className="subcategory-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    alt={sub.name}
                    className="responsive-image"
                    height="200"
                    image={image}
                    title={"Subcategory: " + sub.name}
                  />
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {sub.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedGame(sub.id)}
                      sx={{ margin: '10px auto 0' }}
                    >
                      Show Levels 
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

        {/* Show Question Categories when a subcategory is selected */}
        {selectedGame &&
  QuestionCategories
    .filter(qc => qc.gameid === selectedGame) // Filter Question Categories by gameid
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by createdAt (earliest first)
    .map((questionCategory, index) => {
      const image = imagePaths[index % imagePaths.length]; // Loop through images

      // Check if the category is unlocked
      let isUnlocked = questionCategory?.starting; // If starting is true, it's unlocked directly.

      // If not starting, check the previous category's locked status
      if (!isUnlocked && index > 0) {
        const previousCategory = QuestionCategories
        .filter(qc => qc.gameid === selectedGame) // Filter Question Categories by gameid
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[index - 1];
        
        // If the user is in the previous category's locked list, unlock the current category
        if (previousCategory.locked.includes(storedUserData.user.id)) {
          isUnlocked = true;
        }
      }

      return (
        <Grid item key={questionCategory.id} xs={12} sm={6} md={6} lg={4} xl={4} sx={{
          height: QuestionCategories.filter(qc => qc.gameid === selectedGame).length > 1 ? '50%' : '100%',
        }}>
          <Card className="question-category-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              alt={questionCategory.name}
              className="responsive-image"
              height="200"
              image={image}
              title={"Question Category: " + questionCategory.name}
            />
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {questionCategory.name}
              </Typography>
              
              {/* Show the Start Game button only if unlocked */}
              <Button
                variant="contained"
                color={isUnlocked ? "primary" : "secondary"} // Change color based on unlock status
                onClick={() => isUnlocked && handleCategorySelect(questionCategory.id)} // Prevent click if locked
                sx={{ margin: '10px auto 0', cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
                disabled={!isUnlocked} // Disable button if locked
              >
                {isUnlocked ? 'Start Game' : 'Locked'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      );
    })
}



      </Grid>
    </Box>
  );
};

export default CategoryCards;
