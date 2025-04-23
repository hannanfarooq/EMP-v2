import React, { useState, useEffect } from "react";
import { 
  Button, TextField, Box, Typography, Divider, 
  List, ListItem, ListItemText, IconButton, CircularProgress, Collapse 
} from "@mui/material";
import { Edit, Delete, Check, Close, ExpandMore, ExpandLess, Add } from "@mui/icons-material";
import axios from "axios";
import { createCategory, deleteCategory, getAllCategories, updateCategory, createSubCategory, getSubCategories, deleteSubCategory, updateSubCategory } from "src/api";
import { toast } from "react-toastify";

export default function AddCategory({ onClose,setLoad }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Subcategory states
  const [subcategories, setSubcategories] = useState({});
  const [newSubcategory, setNewSubcategory] = useState({});
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch categories on component mount
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(storedUserData.company.id);
      setCategories(response.data);
      for (const category of response.data) {
        fetchSubCategories(category.id);
      }
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setFetching(false);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await getSubCategories(categoryId);
      console.log("getSubCategories : ", response);
      setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
    } catch (err) {
      console.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await createCategory(storedUserData.company.id, name);
      if (response?.code === 200) {
        setCategories([...categories, response.data]);
        toast.success("Category Created Successfully");
        setLoad(true);
      }
      setName(""); // Clear input field
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Category
  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);
      if (response?.code === 200) {
        setCategories(categories.filter((cat) => cat.id !== id)); // Remove from UI
        setLoad(true);
        toast.success("Category Deleted Successfully");
      }
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  // Handle Edit Category
  const handleEdit = (id, currentName) => {
    setEditingId(id);

    setEditingName(currentName);
  };

  const handleEditSubmit = async (id) => {
    try {
      const response = await updateCategory(id, editingName);
      if (response?.code === 200) {
        setCategories(categories.map((cat) => (cat.id === id ? { ...cat, name: editingName } : cat)));
        setEditingId(null);
        setEditingName("");
        setLoad(true);
        toast.success("Category Updated Successfully");
      }
    } catch (err) {
      setError("Failed to update category");
    }
  };

  // Handle Expand/Collapse for Categories
  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Handle Add Subcategory
  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategory[categoryId]) return;
    try {
      const response = await createSubCategory(categoryId, newSubcategory[categoryId],storedUserData.company.id);
      if (response?.code === 200) {
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: [...(prev[categoryId] || []), response.data],
        }));
        toast.success("Subcategory Created Successfully");
        setLoad(true);
        setNewSubcategory({ ...newSubcategory, [categoryId]: "" });
      }
    } catch (err) {
      setError("Failed to add subcategory");
    }
  };
const handleDeleteSubcategory = async(id ,categoryid )=>
{
    const response = await deleteSubCategory(id);
    if(response?.code==200)
    {
        fetchSubCategories(categoryid);
        setLoad(true);
toast.success("Sub-Category Deleted Successfully");
    }
}
const handleEditSubcategory = (id, name) => {
    setEditingSubcategoryId(id);
    setEditingSubcategoryName(name);
  };
  const handleEditSubcategorySubmit = async (id, categoryId) => {
    try {
      const response = await updateSubCategory(id, editingSubcategoryName);
      if (response?.code === 200) {
        fetchSubCategories(categoryId);
        setEditingSubcategoryId(null);
        setEditingSubcategoryName("");
        setLoad(true);
        toast.success("Subcategory Updated Successfully");
      }
    } catch (err) {
      setError("Failed to update subcategory");
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Title */}
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
        Manage Categories & Subcategories
      </Typography>

      {/* Display Existing Categories */}
      <Typography variant="subtitle1">Existing Categories</Typography>
      <Box sx={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ddd", borderRadius: 1, p: 1 }}>
        {fetching ? (
          <CircularProgress size={24} />
        ) : categories.length > 0 ? (
          <List>
            {categories.map((category) => (
              <div key={category.id}>
                <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                  {editingId === category.id ? (
                    <>
                      <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <IconButton onClick={() => handleEditSubmit(category.id)} color="success">
                        <Check />
                      </IconButton>
                      <IconButton onClick={() => setEditingId(null)} color="error">
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={category.name} />
                      <IconButton onClick={() => toggleExpandCategory(category.id)}>
                        {expandedCategory === category.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      <IconButton onClick={() => handleEdit(category.id, category.name)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(category.id)} color="error">
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </ListItem>

                {/* Expandable Subcategory Section */}
                <Collapse in={expandedCategory === category.id} timeout="auto" unmountOnExit>
  <Box sx={{ pl: 4 }}>
    <Typography variant="body2">Subcategories</Typography>

    {/* ✅ FIX: Ensure subcategories exist and map correctly */}
    {subcategories[category.id] && subcategories[category.id].length > 0 ? (
      <List>
        {subcategories[category.id].map((sub) => (
          <ListItem key={sub.id} sx={{ display: "flex", justifyContent: "space-between" }}>
          {editingSubcategoryId === sub.id ? (
            <>
              <TextField size="small" value={editingSubcategoryName} onChange={(e) => setEditingSubcategoryName(e.target.value)} />
              <IconButton onClick={() => handleEditSubcategorySubmit(sub.id, category.id)} color="success">
                <Check />
              </IconButton>
              <IconButton onClick={() => setEditingId(null)} color="error">
                        <Close />
                      </IconButton>
            </>
          ) : (
            <>
              <ListItemText primary={sub.name} />
              <IconButton onClick={() => handleEditSubcategory(sub.id, sub.name)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteSubcategory(sub.id, category.id)} color="error">
                <Delete />
              </IconButton>
            </>
          )}
        </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="textSecondary">
        No subcategories available.
      </Typography>
    )}

    {/* Add Subcategory Input */}
    <Typography variant="body2" sx={{ mt: 2 }}>
      Add Subcategory
    </Typography>
    <TextField
      label="Subcategory Name"
      size="small"
      fullWidth
      value={newSubcategory[category.id] || ""}
      onChange={(e) => setNewSubcategory({ ...newSubcategory, [category.id]: e.target.value })}
    />
    <Button onClick={() => handleAddSubcategory(category.id)} variant="contained" sx={{ mt: 1 }}>
      Add Subcategory
    </Button>
  </Box>
</Collapse>

              </div>
            ))}
          </List>
        ) : (
          <Typography>No categories found.</Typography>
        )}
      </Box>

      {/* Separator */}
      <Divider sx={{ my: 2 }} />

      {/* Add Category Form */}
      <Typography variant="subtitle1">Add New Category</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Category Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </Button>
      </Box>
    </Box>
  );
}
