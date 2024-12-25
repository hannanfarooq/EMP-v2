import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import GroupIcon from "@mui/icons-material/Group";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import { createConversation, getBlockedByUsers, getblockuser } from "src/api"; 
import { toast } from "react-toastify";

import { createTheme, ThemeProvider } from "@mui/material/styles";

function validateForm(name, description, members) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Group Name is required";
  }

  
  if (members.length < 1) {
    errors.members = "Add at least 1 members ";
  }

  return errors;
}

export default function CreateGroupChat({ fetchGroupChats }) {
  const [formData, setFormData] = useState({
    name: "",
   
    members: [], // Array of user IDs for group members
  });
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchGroupChats(storedUserData.token, storedUserData.company.id);
        const response2 = await getblockuser();  // Get users that the current user has blocked
    
        const blockedUsersData = response2.data;  // This is an object containing blockerId and blockedId array
    
        console.log("-----------BLOCKED USER", blockedUsersData);
        console.log("-----------Response USER", response.data);
    
        // Get users who have blocked the current user
        const response3 = await getBlockedByUsers(storedUserData.user.id);
        const blockedByUsersData = response3.data;  
    
        console.log("-----------BLOCKED BY USER", blockedByUsersData);
    
        const transformedUsers = response.data
          .filter(user => {
            // Filter out the current user
            if (user.id === storedUserData.user.id) return false;
            
            // Check if the current user has blocked this user
            const hasBlocked = blockedUsersData.blockerId === storedUserData.user.id && blockedUsersData.blockedId.includes(user.id);
    
            // Check if this user has blocked the current user
            const isBlockedBy = blockedByUsersData.some(blockedByUser => 
              blockedByUser.blockerId === user.id && blockedByUser.blockedId.includes(storedUserData.user.id)
            );
    
            return !hasBlocked && !isBlockedBy;
          })
          .map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          }));
    
        console.log("-------------------transformedUsers", transformedUsers);
    
        if (transformedUsers.length > 0) {
          setUsers(transformedUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users. Please try again.");
      }
    };
    
    
    
    
    

    loadUsers();
  }, [storedUserData.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, members } = formData;

    // Validate the form data
    const formErrors = validateForm(name, description, members);
    setErrors(formErrors);

    // Check if there are any validation errors
    if (Object.keys(formErrors).length === 0) {
      
     
      // Make API call to create group chat
      const data = {
        chatName: formData.name,
        isGroupChat:true,
        userIds: formData.members,
        groupAdminId: storedUserData?.user.id,
       
      };

      setSubmitting(true);
      try {
        
        
        await createConversation(data, storedUserData.token);
        
        setSubmitting(false);
        toast.success("Group chat created successfully!");

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            description: "",
            members: [],
          });
         
        }, 3000);
      } catch (error) {
        setSubmitting(false);
        toast.error("Error creating group chat. Please try again.");
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMembersChange = (event, value) => {
    setFormData({
      ...formData,
      members: value.map(user => user.id),
    });
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <GroupIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create new group chat
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Group Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
             
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={users}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  onChange={handleMembersChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Add Members"
                      placeholder="Search members by name or email"
                      error={!!errors.members}
                      helperText={errors.members}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Create Group Chat"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
