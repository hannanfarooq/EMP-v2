import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { addQuestionCategory, deleteQuestionCategory, getQuestionCategories, updateQuestionCategory } from 'src/api';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AddQuestionCategory = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoryList = await getQuestionCategories();
      console.log(categoryList.data);
      if(
        categoryList?.data
      )
      {

        setCategories(categoryList?.data);
      }
    } catch (error) {
      console.error('Failed to fetch question categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true)
      const newCategory = await addQuestionCategory(name);
      setName('')
      setLoading(false)
      window.location.reload()

      console.log('New category added:', newCategory);
    } catch (error) {
    setLoading(false)
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
      fetchCategories();
      console.log('Category updated successfully.');
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteQuestionCategory(category?.id);
    }
  };

  return (
    <div>
      <p className="form-title">Add Gamification Level</p>
      <List sx={{ height: 180, cursor: 'move', overflow: 'scroll' }}>
        {categories.map((category) => (
          <ListItem key={category.id}>
            {category.isEditing ? (
              <>
                <TextField
                  fullWidth
                  value={category.name}
                  onChange={(e) => category.name = e.target.value}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    updateCategory(category.id, category.name);
                    category.isEditing = false;
                  }}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <ListItemText primary={category.name} />
                <IconButton onClick={() => handleEditCategory(category)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteCategory(category)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <TextField
        label="Gamification Level"
        variant="outlined"
        fullWidth
        value={name}
        className='mt-4'
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className='mt-4'
        onClick={handleAddCategory}
        disabled={loading}
      >
        Add Gamification Level
      </Button>
    </div>
  );
};

export default AddQuestionCategory;
