import { LinearProgress, Typography } from "@mui/material";  // Import Typography for showing blocked message
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getConversationMessages } from "src/api";
import {  Box, Avatar } from "@mui/material";
import { MessageList } from "react-chat-elements";
import { MessageListWrapper } from "./App.styles";
import Filter from "bad-words";
const CustomMessageList = ({ messages, currentUser,usermap }) => {
  // Function to format timestamp to 12-hour format (HH:mm AM/PM)
  const formatTimestamp = (createdAt) => {
    const date = new Date(createdAt);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12:00 AM is 12, not 0
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };
  const filter = new Filter();
  // Function to determine tick marks and color
  const getMessageStatus = (status) => {
    if (status === 'seen') {
      return <span style={{ color: 'blue' }}>✓✓</span>; // Blue ticks when seen
    } else if (status === 'delivered') {
      return <span>✓✓</span>; // Default color for delivered
    } else {
      return <span>✓</span>; // Single tick for sent
    }
  };

  return (
    <div style={{ padding: '15px', maxHeight: '50vh', overflowY: 'auto' }}>
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => {
          const sender = msg.senderId === currentUser.user.id;
          const filteredText = filter.clean(msg.content);
          return (
            <Box
              key={index}
              display="flex"
              flexDirection={sender ? "row-reverse" : "row"}
              alignItems="center"
              marginBottom={2}
            >
              <Avatar alt={msg.title} src={sender ? currentUser.user.profilePic : usermap[msg.senderId].profilePic} />
              
              <Box
                sx={{
                  marginLeft: sender ? 1 : 2,
                  marginRight: sender ? 2 : 1,
                  backgroundColor: sender ? "#e8f5e9" : "#f5f5f5",
                  padding: 2,
                  borderRadius: 2,
                  maxWidth: "50%",
                }}
              >
                <Typography className="comment-content" variant="body1" dangerouslySetInnerHTML={{ __html: filteredText }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="textSecondary" sx={{ textAlign: "right", display: "block" }}>
                    {formatTimestamp(msg.createdAt)}
                  </Typography>

                  {/* Tick marks */}
                  {sender && (
                    <Typography variant="caption" sx={{ marginLeft: 1 }}>
                      {getMessageStatus(msg.status)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          No messages in this conversation.
        </Typography>
      )}
    </div>
  );
};
const getMessages = async (id) => await getConversationMessages(id);

export default function MessageListComponent({ conversation, blockeduser }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { data, isLoading, error } = useQuery(
    ["conversations", conversation?.id],
    () => getMessages(conversation?.id),
    { refetchInterval: 1000 }
  );

  // Check if the user is blocked
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

  // Scroll to bottom function
  const scrollToBottom = () => {
    const mlistElement = document.querySelector('.my-chat .rce-mlist');
    if (mlistElement) {
      mlistElement.style.height = 'auto';
      mlistElement.scrollTop = mlistElement.scrollHeight;
    }
  };

  // Using useEffect to ensure scroll happens after data has loaded
  useEffect(() => {
    if (data && data.length > 0) {
      scrollToBottom(); // Scroll to the bottom of the messages once data is loaded
    }
  }, [data]);  // Only run this effect when `data` changes

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;

  // Function to format timestamp to 12-hour format (HH:mm AM/PM)
  const formatTimestamp = (createdAt) => {
    const date = new Date(createdAt);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12:00 AM is 12, not 0
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };
console.log("DATA : ",conversation)
  // Map over the data to prepare the chat list
  const chatList = data?.map((msg) => {
    const sender = msg.senderId === currentUser.user.id;
    if (msg?.content && msg?.content !== "") {
      return {
        position: sender ? "right" : "left",
        type: "text",
        title: sender ? 'You' : msg?.senderName,
        text: msg?.content,  // No need to manually add line breaks, CSS will handle it
        date: msg?.createdAt, // Format and display the timestamp
        usermap:conversation.usermap,
      };
    }
  });

  return (
    <MessageListWrapper>
      {isBlocked ? (
        // Show blocked message if the user is blocked, center it
        <Typography 
          variant="h6" 
          align="center" 
          color="textSecondary" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50%', // Take full height of the container
            textAlign: 'center',
            marginTop: 15
          }}
        >
          You have blocked this user. Unblock to view content.
        </Typography>
      ) : (
        // Show the chat messages if not blocked
        <div>
          {chatList?.length === 0 ? (
            // If no messages are present, show "No messages"
            <Typography variant="h6" align="center" color="textSecondary" sx={{ marginTop: 20 }}>
              No messages in this conversation.
            </Typography>
          ) : (
            <CustomMessageList messages={data} currentUser={currentUser}  usermap={conversation.userMap}/>
          )}
        </div>
      )}
    </MessageListWrapper>
  );
}