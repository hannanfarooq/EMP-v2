import React, { useEffect, useState } from 'react';
import { TextField, Button, List,Accordion , ListItem,AccordionSummary,Typography,AccordionDetails, ListItemText, IconButton, FormControl, InputLabel, MenuItem, Select, Switch, FormControlLabel } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon  } from '@mui/icons-material';
import { addQuestionCategory, deleteQuestionCategory, getQuestionCategories, updateQuestionCategory, getAllCategories, getSubCategories } from 'src/api';
import { uploadImageAndGetURL } from 'src/utils/uploadImageAndGetURL';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddQuestionCategory = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [questionCategories, setQuestionCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [subcategories,setsubcategories]=useState([]);

  const handleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategory(expandedSubCategory === subCategoryId ? null : subCategoryId);
  };

  useEffect(() => {
    fetchCategories();
    fetchQuestionCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
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
          setsubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
        } catch (err) {
          console.error("Failed to fetch subcategories");
        }

}
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
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('categoryId', selectedCategory);
      formData.append('subCategoryId', selectedSubCategory);

      if (isVideoMode && video) {
        const videoURL = await uploadImageAndGetURL(video);
        formData.append('video', videoURL);
      }

      if (!isVideoMode) {
        const imageURLs = await Promise.all(images.map(img => uploadImageAndGetURL(img)));
        formData.append('images', JSON.stringify(imageURLs));  // ✅ Correctly stringify array
    }
    

      const res = await addQuestionCategory(name, description, formData.get('images'), formData.get('video'),  selectedSubCategory);
      if (res?.code === 200) {
        toast.success("Gamification Added Successfully");
        fetchQuestionCategories();
      }

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
      fetchQuestionCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteQuestionCategory(category.id);
      fetchQuestionCategories();
    }
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
                      {questionCategories
                        .filter((qc) => qc.subCategoryId === subCategory.id)
                        .map((qc) => (
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
      <FormControl fullWidth className='mt-4'>
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
        <FormControl fullWidth className='mt-4'>
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

      {/* Gamification Name */}
      <TextField
        label="Gamification Level"
        variant="outlined"
        fullWidth
        value={name}
        className='mt-4'
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
        className='mt-4'
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Upload Type Switch */}
      <FormControlLabel
        control={<Switch checked={isVideoMode} onChange={() => setIsVideoMode(!isVideoMode)} />}
        label={isVideoMode ? "Upload Video" : "Upload Images"}
        className='mt-4'
      />

      {/* Video/Image Upload */}
      {isVideoMode ? (
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className='mt-4' />
      ) : (
        <input type="file" accept="image/*" multiple onChange={(e) => setImages([...e.target.files])} className='mt-4' />
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
      <Button variant="contained" color="primary" className='mt-4' onClick={handleAddCategory} disabled={loading}>
        Add Gamification Level
      </Button>
    </div>
  );
};

export default AddQuestionCategory;
