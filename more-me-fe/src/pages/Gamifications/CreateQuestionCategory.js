import React, { useEffect, useState } from 'react';
import { TextField, Button, List, Accordion, ListItem, AccordionSummary, Typography, AccordionDetails, ListItemText, IconButton, FormControl, InputLabel, MenuItem, Select, Switch, FormControlLabel } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { addQuestionCategory, deleteQuestionCategory, getQuestionCategories, updateQuestionCategory, getAllCategories, getSubCategories, getGamesBySubCategory } from 'src/api';
import { uploadImageAndGetURL } from 'src/utils/uploadImageAndGetURL';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddQuestionCategory = ({setLoad}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedgameid, setSelectedgameid] = useState('');
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [questionCategories, setQuestionCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [subcategories, setsubcategories] = useState([]);
  const [gamesBySubCategory, setGamesBySubCategory] = useState({});
  const [startingLevel, setStartingLevel] = useState(false);  // New state for starting level
  const [canProceedToNextLevel, setCanProceedToNextLevel] = useState(false);  // New state for canProceedToNextLevel
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const handleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };
  
  const [expandedGame, setExpandedGame] = useState(null);
  const handleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategory(expandedSubCategory === subCategoryId ? null : subCategoryId);
  };

  useEffect(() => {
    fetchCategories();
    fetchQuestionCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(storedUserData.company.id);
      if (response?.data) {
        setCategories(response.data);
        for (const category of response.data) {
          fetchsubCategories(category.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchsubCategories = async (categoryId) => {
    try {
      const response = await getSubCategories(categoryId);
      console.log("getSubCategories : ", response);
      for (const subcategory of response.data) {
        await fetchGamesForSubCategory(subcategory.id);
      }
      setsubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
    } catch (err) {
      console.error("Failed to fetch subcategories");
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      if (!categoryId) return;
      const response = await getSubCategories(categoryId);
      if (response?.data) {
        setSubCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  const fetchGamesForSubCategory = async (subCategoryId) => {
    try {
      const response = await getGamesBySubCategory(subCategoryId);
      if (response?.data) {
        console.log("getGamesBySubCategory : ", response);
        setGamesBySubCategory((prevState) => ({
          ...prevState,
          [subCategoryId]: response.data,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch games for subcategory:', error);
    }
  };

  const fetchQuestionCategories = async () => {
    try {
      const categoryList = await getQuestionCategories();
      if (categoryList?.data) {
        setQuestionCategories(categoryList.data);
      }
    } catch (error) {
      console.error('Failed to fetch question categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
  
      if (!selectedCategory) {
        toast.error("Please select a category");
        setLoading(false);
        return;
      }
      if (!selectedSubCategory) {
        toast.error("Please select a subcategory");
        setLoading(false);
        return;
      }
      if (!selectedgameid) {
        toast.error("Please select a game");
        setLoading(false);  
        return;
      }



      // Check if name or description is empty
      if (!name.trim() || !description.trim()) {
        toast.error("Name and Description are required");
        setLoading(false);
        return;
      }
  
      // Check if at least one of image or video is provided
      if (!(video || images.length > 0)) {
        toast.error("At least one image or video should be provided");
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('categoryId', selectedCategory);
      formData.append('subCategoryId', selectedSubCategory);
      formData.append('gameid', selectedgameid);
      formData.append('startingLevel', startingLevel);  // Add the starting level information
  
      // Prevent adding a new level if it already exists for the game and is a starting level
      if (questionCategories.filter((qc) => qc.gameid === selectedgameid).length > 0 && startingLevel) {
        toast.error("Level already exists for this game");
        setLoading(false);
        return;
      }
  
      // Upload video if selected
      if (isVideoMode && video) {
        const videoURL = await uploadImageAndGetURL(video);
        formData.append('video', videoURL);
      }
  
      // Upload images if not in video mode
      if (!isVideoMode && images.length > 0) {
        const imageURLs = await Promise.all(images.map(img => uploadImageAndGetURL(img)));
        formData.append('images', JSON.stringify(imageURLs)); // ✅ Correctly stringify array
      }
  
      const res = await addQuestionCategory(name, description, formData.get('images'), formData.get('video'), selectedSubCategory, selectedgameid, startingLevel,canProceedToNextLevel);
      if (res?.code === 200) {
        toast.success("Gamification Added Successfully");
        setLoad(true);
        fetchQuestionCategories();
      }
  
      // Reset fields after submission
      setName('');
      setDescription('');
      setSelectedCategory('');
      setSelectedSubCategory('');
      setVideo(null);
      setImages([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to add category:', error);
    }
  };
  

  const handleEditCategory = (category) => {
    const updatedCategoryName = prompt('Enter the updated category name:', category.name);
    if (updatedCategoryName !== null) {
      updateCategory(category.id, updatedCategoryName);
    }
  };

  const updateCategory = async (categoryId, categoryName) => {
    try {
      await updateQuestionCategory(categoryId, categoryName);
      setLoad(true);
      fetchQuestionCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteQuestionCategory(category.id);
      setLoad(true);
      fetchQuestionCategories();
    }
  };

  const handleGameExpand = (gameId) => {
    setExpandedGame(expandedGame === gameId ? null : gameId);
  };

  return (
    <div>
      <p className="form-title">Add Gamification Level</p>

      {/* List of Existing Gamification Levels */}
      <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {categories.map((category) => (
          <Accordion key={category.id} expanded={expandedCategory === category.id} onChange={() => handleCategoryExpand(category.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {subcategories[category.id] && subcategories[category.id].length > 0 ? (
                subcategories[category.id].map((subCategory) => (
                  <Accordion key={subCategory.id} expanded={expandedSubCategory === subCategory.id} onChange={() => handleSubCategoryExpand(subCategory.id)} sx={{ ml: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{subCategory.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {gamesBySubCategory[subCategory.id] && gamesBySubCategory[subCategory.id].length > 0 ? (
                          gamesBySubCategory[subCategory.id].map((game) => (
                            <Accordion key={game.id} expanded={expandedGame === game.id} onChange={() => handleGameExpand(game.id)}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <ListItemText primary={game.name} />
                              </AccordionSummary>
                              <AccordionDetails>
                                {/* Display Question Categories for the expanded game */}
                                {questionCategories.filter((qc) => qc.gameid === game.id).map((qc) => (
                                  <ListItem key={qc.id} sx={{ pl: 4 }}>
                                    <ListItemText primary={qc.name} secondary={qc.description} />
                                    <IconButton onClick={() => handleEditCategory(qc)}>
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteCategory(qc)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItem>
                                ))}
                                {questionCategories.filter((qc) => qc.gameid === game.id).length === 0 && (
                                  <Typography>No Level available for this game.</Typography>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          ))
                        ) : (
                          <Typography sx={{ ml: 2 }}>No games available</Typography>
                        )}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography sx={{ ml: 2 }}>No subcategories available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </List>

      {/* Category Selection */}
      <FormControl fullWidth className="mt-4">
        <InputLabel>Select Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            fetchSubCategories(e.target.value);
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SubCategory Selection */}
      {selectedCategory && (
        <FormControl fullWidth className="mt-4">
          <InputLabel>Select SubCategory</InputLabel>
          <Select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
            {subCategories.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
 {
selectedSubCategory && gamesBySubCategory[selectedSubCategory] && gamesBySubCategory[selectedSubCategory].length > 0 && (
        <FormControl fullWidth className='mt-4'>
          <InputLabel>Select Game</InputLabel>
          <Select
            value={selectedgameid}
            onChange={(e) => setSelectedgameid(e.target.value)}
          >
            {gamesBySubCategory[selectedSubCategory].map((game) => (
              <MenuItem key={game.id} value={game.id}>
                {game.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )

      }
      {/* Starting Level Switch */}
      <FormControlLabel
        control={<Switch checked={startingLevel} onChange={() => setStartingLevel(!startingLevel)} />}
        label="Set as Starting Level"
        className="mt-4"
      />

      {/* Gamification Name */}
      <TextField
        label="Gamification Level"
        variant="outlined"
        fullWidth
        value={name}
        className="mt-4"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Description */}
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        className="mt-4"
        onChange={(e) => setDescription(e.target.value)}
      />
<FormControlLabel
  control={<Switch checked={canProceedToNextLevel} onChange={() => setCanProceedToNextLevel(!canProceedToNextLevel)} />}
  label="Allow Proceed to Next Level"
  className="mt-4"
/>

      {/* Upload Type Switch */}
      <FormControlLabel
        control={<Switch checked={isVideoMode} onChange={() => setIsVideoMode(!isVideoMode)} />}
        label={isVideoMode ? "Upload Video" : "Upload Images"}
        className="mt-4"
      />

      {/* Video/Image Upload */}
      {isVideoMode ? (
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="mt-4" />
      ) : (
        <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} className="mt-4" />
      )}

      {/* Selected Files Preview */}
      {isVideoMode && video && <p>Selected Video: {video.name}</p>}
      {!isVideoMode && images.length > 0 && (
        <div>
          <p>Selected Images:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {images.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt="Preview" width={100} height={100} />
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button variant="contained" color="primary" className="mt-4" onClick={handleAddCategory} disabled={loading}>
        Add Gamification Level
      </Button>
    </div>
  );
};

export default AddQuestionCategory;
