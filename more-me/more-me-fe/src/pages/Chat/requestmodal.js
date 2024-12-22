import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import { acceptChatRequest, rejectChatRequest, getChatRequests } from "src/api"; // Adjust path to your API functions
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ChatRequestsModal() {
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [chatRequests, setChatRequests] = useState([]);

  useEffect(() => {
    fetchChatRequests();
  }, [storedUserData.token]);

  const fetchChatRequests = async () => {
    try {
      const response = await getChatRequests(storedUserData.token);
      
      setChatRequests(response); 
    } catch (error) {
      toast.error("Error fetching chat requests. Please try again.");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptChatRequest(requestId, storedUserData.token);
      toast.success("Chat request accepted successfully!");
      // Update chat requests after accepting
      const updatedRequests = chatRequests.filter(
        (request) => request.invitationId !== requestId
      );
      setChatRequests(updatedRequests);
    } catch (error) {
      toast.error("Error accepting chat request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectChatRequest(requestId, storedUserData.token);
      toast.error("Chat request rejected.");
      // Update chat requests after rejecting
      const updatedRequests = chatRequests.filter(
        (request) => request.invitationId !== requestId
      );
      setChatRequests(updatedRequests);
    } catch (error) {
      toast.error("Error rejecting chat request. Please try again.");
    }
  };
console.log('-------------------------CHAT REQUEST',chatRequests);
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
            Chat Requests
          </Typography>
          <Box sx={{ width: "100%", mt: 3 }}>
            {chatRequests && chatRequests.length > 0 ? (
              chatRequests.map((request) => (
                <Box
                  key={request.invitationId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                    border: "1px solid #ccc",
                    padding: 2,
                  }}
                >
                  <Avatar src={request.adminProfilePicture} />
                  <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="subtitle1">
                      {request.adminFirstName} {request.adminLastName}
                      {request.isGroupChat?` has invited you to join Group Chat : ${request.chatName}`:` has invited you to chat with him !`}
                    </Typography>
                    <Box sx={{ display: "flex", mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAcceptRequest(request.invitationId)}
                        sx={{ mr: 1 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRejectRequest(request.invitationId)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body1" align="center">
                No chat requests
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
