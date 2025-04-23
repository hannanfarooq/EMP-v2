import React, { useEffect, useState } from 'react';
import { TextField, Button, List, Accordion, ListItem, AccordionSummary, Typography, AccordionDetails, ListItemText, IconButton, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllCategories, getSubCategories,  createGame, getGamesBySubCategory, updateGame, deleteGame } from 'src/api';  // Assuming `getGamesForSubCategory` is an API call to fetch games.
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddGame = ({setLoad}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [gamesBySubCategory, setGamesBySubCategory] = useState({}); // Store games by subcategory ID
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [subcategories,setsubcategories]=useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    fetchCategories();
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
const fetchsubCategories= async (categoryId)=>
{
 try {
          const response = await getSubCategories(categoryId);
          console.log("getSubCategories : ", response);
          for (const subcategory of response.data) {
          await  fetchGamesForSubCategory(subcategory.id);
          }
        
          setsubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
        } catch (err) {
          console.error("Failed to fetch subcategories");
        }

}
  const fetchSubCategories = async (categoryId) => {
    try {
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
          [subCategoryId]: response.data, // Save games by subcategory ID
        }));
      }
    } catch (error) {
      console.error('Failed to fetch games for subcategory:', error);
    }
  };

  const handleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategory(expandedSubCategory === subCategoryId ? null : subCategoryId);
 
  };

  const handleAddGame = async () => {
    try {
      setLoading(true);

      if (!selectedCategory || !selectedSubCategory || !name) {
        toast.error('Please select category, subcategory, and enter the game name.');
        setLoading(false);
        return;
      }

    //   API call to add game
      const res = await createGame(name, selectedSubCategory);
      if (res?.code === 200) {
        toast.success('Game added successfully');
        setLoad(true);
        fetchGamesForSubCategory(selectedSubCategory); // Refresh games for the selected subcategory
      }

      // Reset form after game added
      setName('');
      setSelectedCategory('');
      setSelectedSubCategory('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to add game:', error);
    }
  };

  const handleEditGame = async(game) => {
    const updatedGameName = prompt('Enter the updated game name:', game.name);
    if (updatedGameName !== null) {
     await  updateGame(game.id, updatedGameName); // Update game (not implemented)
     setLoad(true);
   await  fetchCategories();
    }
  };

  const handleDeleteGame = async (game) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
     await deleteGame(game.id); // Delete game (not implemented)
     setLoad(true);
     await  fetchCategories();
    }
  };

  return (
    <div>
      <p className="form-title">Add Game</p>

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
          <Select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            {subCategories.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Game Name */}
      <TextField
        label="Game Name"
        variant="outlined"
        fullWidth
        value={name}
        className="mt-4"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Submit Button */}
      <Button variant="contained" color="primary" className="mt-4" onClick={handleAddGame} disabled={loading}>
        Add Game
      </Button>

      {/* List of Categories with Subcategories and Games */}
      <List sx={{ maxHeight: 400, overflowY: 'auto', marginTop: '20px' }}>
        {categories.map((category) => (
          <Accordion key={category.id} expanded={expandedCategory === category.id} onChange={() => handleCategoryExpand(category.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              { subcategories[category.id] && subcategories[category.id].length > 0&& subcategories[category.id].map((subCategory) => (
                  <Accordion key={subCategory.id} expanded={expandedSubCategory === subCategory.id} onChange={() => handleSubCategoryExpand(subCategory.id)} sx={{ ml: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{subCategory.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* List Games under each SubCategory */}
                      <List>
                        {gamesBySubCategory[subCategory.id] && gamesBySubCategory[subCategory.id].length > 0 ? (
                          gamesBySubCategory[subCategory.id].map((game) => (
                            <ListItem key={game.id}>
                              <ListItemText primary={game.name} />
                              <IconButton onClick={() => handleEditGame(game)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDeleteGame(game)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItem>
                          ))
                        ) : (
                          <Typography sx={{ ml: 2 }}>No games available</Typography>
                        )}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
    </div>
  );
};

export default AddGame;
