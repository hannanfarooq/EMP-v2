import { LinearProgress, TextField, Avatar, Badge } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { getConversations, readmessage } from "src/api";
import { green } from '@mui/material/colors';
import { formatDistanceStrict } from 'date-fns';

const getChatList = async () => await getConversations();

function CustomChatItem({ chat, onClick }) {
  const timeAgo = formatDistanceStrict(new Date(chat.date), new Date(), { addSuffix: true });

  return (
    <div
      onClick={() => onClick(chat)}
      className="chat-item"
    >
      {
        chat.unread ? (
          <Badge
            badgeContent={''}
            color="primary"
            sx={{ '& .MuiBadge-badge': { backgroundColor: chat.unread ? green[500] : 'transparent' } }}
          >
            <Avatar src={chat.avatar} alt={chat.alt} />
          </Badge>
        )
        :
        (<Avatar src={chat.avatar} alt={chat.alt} />)
      }

      <div className="chat-info">
        <div className="chat-title">{chat.title}</div>
        <div className="chat-subtitle">{chat.subtitle}</div>
      </div>
      <div className="chat-time">{timeAgo}</div>
    </div>
  );
}

export default function ChatListComponent({ setCurrentConversation }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery(
    ["conversation"],
    () => getChatList(),
    { refetchInterval: 1000 }
  );

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;

  const markMessagesAsRead = async (chatId) => {
    readmessage(chatId);
  };

  const handleChatClick = (chat) => {
    setCurrentConversation(chat);
    markMessagesAsRead(chat.id);
  };

  let chatList = [];

  if (data && data.conversations) {
    chatList = data.conversations.map((chat) => {
      const currentUserID = currentUser.user.id;
      const sender = chat.users.find(userId => userId !== currentUserID);
      const recentMessage = chat.latestMessage ? chat.latestMessage : '';

      if (!chat.isGroupChat) {
        Object.entries(chat.userMap).forEach(([userId, user]) => {
          if (parseInt(userId) !== currentUser.user.id) {
            chat.avatar = user.profilePic;
            chat.chatName = user.fullName;
          }
        });
      }

      let messagesender = "ok";
      let unread;
      if (chat && chat.latestMessageSender) {
        const currentUserFullName = `${currentUser.user.firstName} ${currentUser.user.lastName}`;
        if (currentUserFullName === chat.latestMessageSender) {
          messagesender = "You";
          unread = 0;
        } else {
          messagesender = chat.latestMessageSender;
          unread = chat.readBy.includes(currentUser.user.id) ? 0 : 1;
        }
      }

      return {
        id: chat.id,
        avatar: !chat.isGroupChat?chat.avatar : '',
        alt: `${chat?.chatName}`,
        title: `${chat?.chatName}`,
        subtitle: `${messagesender}: ${recentMessage}`,
        date: new Date(chat.updatedAt),
        text: `${messagesender}: ${recentMessage}`,
        unread: parseInt(unread),
        user1Id: chat.groupAdminId,
        user2Id: chat.users,
        usermap: chat?.userMap,
        isGroupChat: chat.isGroupChat,
      };
    });
  } else {
    console.error('Error: Conversations data is undefined or null');
  }

  // Filter chatList based on searchQuery
  const filteredChatList = chatList.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search Chats"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', backgroundColor: 'white' }}
        className="search-box"
      />
      {filteredChatList.length > 0 ? (
        <div className="chat-list">
          {filteredChatList.map(chat => (
            <CustomChatItem key={chat.id} chat={chat} onClick={handleChatClick} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
          No chats available
        </div>
      )}
    </>
  );
}

// CSS in JS or external CSS file
const styles = {
  '.chat-item': {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    transition: 'background-color 0.3s',
    '@media (min-width: 600px)': {
      padding: '15px',
    },
    '@media (min-width: 900px)': {
      padding: '20px',
    },
    ':hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  '.chat-info': {
    marginLeft: '10px',
    flex: 1,
    '@media (max-width: 600px)': {
      marginLeft: '5px',
    },
  },
  '.chat-title': {
    fontWeight: 'bold',
    color: '#888',
    '@media (max-width: 600px)': {
      fontSize: '14px',
    },
    '@media (min-width: 600px) and (max-width: 900px)': {
      fontSize: '16px',
    },
    '@media (min-width: 900px)': {
      fontSize: '18px',
    },
  },
  '.chat-subtitle': {
    color: '#888',
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
    '@media (min-width: 600px) and (max-width: 900px)': {
      fontSize: '14px',
    },
    '@media (min-width: 900px)': {
      fontSize: '16px',
    },
  },
  '.chat-time': {
    marginLeft: 'auto',
    color: '#888',
    '@media (max-width: 600px)': {
      fontSize: '10px',
    },
    '@media (min-width: 600px) and (max-width: 900px)': {
      fontSize: '12px',
    },
    '@media (min-width: 900px)': {
      fontSize: '14px',
    },
  },
  '.search-box': {
    '@media (max-width: 600px)': {
      marginBottom: '10px',
    },
    '@media (min-width: 600px) and (max-width: 900px)': {
      marginBottom: '15px',
    },
    '@media (min-width: 900px)': {
      marginBottom: '20px',
    },
  },
  '.chat-list': {
    '@media (max-width: 600px)': {
      padding: '10px',
    },
    '@media (min-width: 600px) and (max-width: 900px)': {
      padding: '15px',
    },
    '@media (min-width: 900px)': {
      padding: '20px',
    },
  },
};


// Add styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = Object.keys(styles).map(selector => {
  const rules = Object.keys(styles[selector])
    .map(property => `${property}: ${styles[selector][property]};`)
    .join(' ');
  return `${selector} { ${rules} }`;
}).join(' ');
document.head.appendChild(styleSheet);