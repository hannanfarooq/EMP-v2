import { LinearProgress, Typography, IconButton, Box, Button } from "@mui/material";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { getblockuser, getConversationMessages, postMessage, UnBlockUser } from "src/api"; // Ensure unblockUser API is available
import { Input } from "react-chat-elements";
import { MessageInputWrapper } from "./App.styles";
import SendIcon from "@mui/icons-material/Send"; // Import Send Icon
import { toast } from "react-toastify";

export default function MessageInputComponent({ conversation, blockeduser, handleloaduser }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [inputValue, setInputValue] = useState('');
  const sender = conversation?.groupAdminId === currentUser.user.id ? conversation?.groupAdminId : currentUser.user.id;
  const input = useRef(undefined);
  let inputClear;

  const sendMessage = async (msg) => {
    // Ensure no empty or whitespace-only messages are sent
    if (!msg.trim()) return;

    const data = {
      "senderId": currentUser.user.id,
      "chatId": conversation?.id,
      "content": msg
    };
    postMessage(data).then(() => {
      if (inputClear) {
        inputClear();
      }
      setInputValue(''); // Clear input after sending
    });
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update input value on change
  };

  const handleUnblock = async () => {
    try {
      // Iterate over each blocked user ID and check if it's in the conversation
      let userToUnblock = null;

      // Check if any blocked ID matches user1Id or any ID in user2Id
      for (let blockedUserId of blockeduser.blockedId) {
        if (conversation.user1Id === blockedUserId) {
          userToUnblock = conversation.user1Id;
          break;
        } else if (Array.isArray(conversation.user2Id) && conversation.user2Id.includes(blockedUserId)) {
          userToUnblock = blockedUserId; // match with any user in user2Id array
          break;
        } else if (conversation.user2Id === blockedUserId) {
          userToUnblock = blockedUserId; // match with user2Id if it's a single ID
          break;
        }
      }

      // If a blocked user is found, unblock them
      if (userToUnblock) {
        await UnBlockUser(userToUnblock); // API call to unblock
        toast.success("User unblocked successfully!");
        handleloaduser(); // Toggle loading state
      } else {
        toast.error("User is not blocked in this conversation.");
        handleloaduser(); // Toggle loading state
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Error unblocking user. Please try again.");
      handleloaduser(); // Toggle loading state
    }
  };

  // Check if the current user has blocked the other user (check in blockeduser.blockedId array)
  let isBlocked = false;

// Ensure blockeduser and its blockedId are properly defined
if (blockeduser && blockeduser.blockedId && Array.isArray(blockeduser.blockedId)) {
  // Check for blocked user in conversation.user2Id
  if (!conversation.isGroupChat && conversation.user2Id && Array.isArray(conversation.user2Id)) {
    isBlocked = conversation.user2Id.some(userId => blockeduser.blockedId.includes(userId));
  }
  
  // If not already blocked, check for blocked user in conversation.user1Id
  if (!isBlocked && conversation.user1Id) {
    isBlocked = blockeduser.blockedId.includes(conversation.user1Id);
  }
}

  return (
    <MessageInputWrapper>
      {isBlocked ? (
        <>
          <Typography variant="h6" color="textSecondary">
            You cannot send a message to this user, you have blocked this user.
          </Typography>
          <Button
            onClick={handleUnblock}
            variant="contained"
            color="primary"
            sx={{ marginTop: 1 }}
          >
            Unblock to chat
          </Button>
        </>
      ) : (
        <Box display="flex" alignItems="center" width="95%">
          <Input
            ref={input}
            placeholder="Type a message..."
            multiline={false}
            type="text"
            onChange={handleInputChange}
            value={inputValue}
            clear={(clear) => (inputClear = clear)}
            onKeyPress={(event) => {
              // Only send the message when 'Enter' is pressed, and ensure no empty content is sent
              if (event.key === 'Enter' && inputValue.trim()) {
                sendMessage(inputValue);
              }
            }}
            onPaste={(event) => {
              // Optionally handle pasting large text, but we no longer limit the length
              const paste = event.clipboardData.getData('text');
              setInputValue(paste); // Allow the pasted text without limiting
            }}
            style={{
              flexGrow: 1, // Make the input take most of the space
              marginRight: '8px', // Add space between input and button
              backgroundColor: inputValue.trim() ? '#e8f5e9' : 'white', // Change background to light green when there's text
              overflow: 'hidden',  // Prevent text from overflowing
              textOverflow: 'ellipsis', // Add ellipsis if text overflows (for multi-line inputs)
              whiteSpace: 'nowrap' // Ensure the text does not wrap within the input field
            }}
          />
          <IconButton
            color="primary"
            onClick={() => sendMessage(inputValue)} // Send message when clicked
            disabled={!inputValue.trim()} // Disable button if input is empty or only spaces
          >
            <SendIcon />
          </IconButton>
        </Box>
      )}
    </MessageInputWrapper>
  );
}
