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
import { useState, useEffect } from "react";
import { getblockuser,UnBlockUser } from "src/api"; 
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function BLOCKUSER({ fetchGroupChats }) {
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadBlockedUsers = async () => {
      try {
        const response = await fetchGroupChats(storedUserData.token, storedUserData.company.id);
        const response2 = await getblockuser();  // Get users that the current user has blocked
    
        const blockedUsersData = response2.data;  // This is an object containing blockerId and blockedId array
    
        console.log("-----------BLOCKED USER", blockedUsersData);
        console.log("-----------Response USER", response.data);
        const transformedUsers = response.data
        .filter(user => {
          // Filter out the current user
          if (user.id === storedUserData.user.id) return false;
          
          // Check if the current user has blocked this user
          const hasBlocked = blockedUsersData.blockerId === storedUserData.user.id && blockedUsersData.blockedId.includes(user.id);
  
         
          return hasBlocked ;
        })
        .map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }));

        // Transform the blocked users data
       

        
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
        toast.error("Error fetching blocked users. Please try again.");
      }
    };

    loadBlockedUsers();
  }, [storedUserData.token]);

  const handleUnblock = async (userId) => {
    try {
      await UnBlockUser( userId);
      toast.success("User unblocked successfully!");

    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Error unblocking user. Please try again.");
    }
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
            Blocked Users
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {users.length > 0 ? (
                users.map(user => (
                  <Grid item xs={12} key={user.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1">
                        {user.name} ({user.email}  )
                      </Typography>
                      <Button
                      
                        variant="contained"
                        color="secondary"
                        onClick={() => handleUnblock(user.id)}
                      >
                        Unblock
                      </Button>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1">No blocked users</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
