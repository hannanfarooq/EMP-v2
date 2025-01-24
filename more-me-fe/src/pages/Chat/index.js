// import * as React from "react";
// import { Grid, LinearProgress, Stack, Button, Divider, Menu, MenuItem, Avatar, Badge } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { ProductCartWidget } from "src/sections/@dashboard/products";
// import { ChatDivContainer, Container, LeftContainer, RightContainer, StyledButton, Wrapper } from "./App.styles";
// import { getConversationMessages, getSellingItems, getChatRequests, acceptChatRequest, rejectChatRequest } from "src/api";
// import { MessageBox } from "react-chat-elements";
// import "react-chat-elements/dist/main.css";
// import ChatListComponent from "./ChatList";
// import MessageListComponent from "./MessageList";
// import MessageInputComponent from "./MessageInput";
// import { useNavigate } from "react-router-dom";
// import Header from "src/layouts/dashboard/header";
// import TransitionsModal from "src/components/modal";
// import CreateGroupChat from "./create-Group";
// import { getAllCompanyUser } from "src/api";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ChatRequestsModal from "./requestmodal";
// import ChatHeader from "./chatheader";
// import { CurrencyExchange } from "@mui/icons-material";
// import SingleUserChat from "./singleuserchat";
// import BLOCKUSER from "./Blockuser";
// import ChatTransitionsModal from "./chatmodal";
// import Iconify from "src/components/iconify";
// import { green } from '@mui/material/colors';
// export default function ChatPage() {
//   const [currentConversation, setCurrentConversation] = useState(null); // Initialize as null
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const navigate = useNavigate();
//   const [openTransitiongroup, setOpenTransitongroup] = useState(false);
//   const [openTransitionuser, setOpenTransitonuser] = useState(false);
//   const [openTransitionrequest, setOpenTransitonrequest] = useState(false);
//   const [openTransitionBlock, setOpenTransitionBlock] = useState(false);
//   const queryClient = useQueryClient();
//   const { data: chatRequests, isLoading: chatRequestsLoading } = useQuery('chatRequests', () => getChatRequests(currentUser.token));

//   const handleOpengroup = () => setOpenTransitongroup(true);
//   const handleClosegroup = () => setOpenTransitongroup(false);
//   const handleOpenuser = () => setOpenTransitonuser(true);
//   const handleCloseuser = () => setOpenTransitonuser(false);
//   const handleopenrequest = () => setOpenTransitonrequest(true);
//   const handlecloserequest = () => setOpenTransitonrequest(false);
//   const handleopenBlock = () => setOpenTransitionBlock(true);
//   const handlecloseBlock = () => setOpenTransitionBlock(false);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {}, [currentConversation]);
//   const isAdmin = currentConversation?.user1Id === currentUser.user.id ? true : false;
//   const isGroup = currentConversation?.isGroupChat;

//   return (
//     <>
     
//       <Wrapper>
//         <Container>
//           <LeftContainer>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item>
//               <Badge
//             badgeContent={'online'}
//             color="primary"
//             sx={{ '& .MuiBadge-badge': { backgroundColor:  green[400]  } }}
//           >
//                 <Avatar alt="User Avatar" src={currentUser?.user?.profilePic || ""} />
//                 </Badge>
//               </Grid>
//               <Grid item>
//                 <ChatTransitionsModal
//                   icon={<Iconify icon="el:group" style={{color: `#625555`}} />}
//                   open={openTransitiongroup}
//                   handleClose={handleClosegroup}
//                   handleOpen={handleOpengroup}
//                   component={<CreateGroupChat fetchGroupChats={getAllCompanyUser} />}
//                 />
//               </Grid>
//               <Grid item>
//                 <ChatTransitionsModal
//                   icon={<Iconify icon="mdi:user-add"  style={{color: `#625555`}}/>}
//                   open={openTransitionuser}
//                   handleClose={handleCloseuser}
//                   handleOpen={handleOpenuser}
//                   component={<SingleUserChat fetchGroupChats={getAllCompanyUser} />}
//                 />
//               </Grid>
//               <Grid item>
//                 <Badge badgeContent={chatRequests?.length} color="primary">
//                   <ChatTransitionsModal
//                     open={openTransitionrequest}
//                     icon={<Iconify icon="material-symbols:chat"  style={{color: `#625555`}}/>}
//                     handleOpen={handleopenrequest}
//                     handleClose={handlecloserequest}
//                     component={<ChatRequestsModal getChatRequests={getChatRequests} />}
//                     maxWidth="sm"
//                   />
//                 </Badge>
//               </Grid>
//               <Grid item>
//                 <ChatTransitionsModal
//                   open={openTransitionBlock}
//                   icon={<Iconify icon="mdi:user-block"  style={{color: `#625555`}}/>}
//                   handleClose={handlecloseBlock}
//                   handleOpen={handleopenBlock}
//                   component={<BLOCKUSER fetchGroupChats={getAllCompanyUser} />}
//                   maxWidth="sm"
//                 />
//               </Grid>
//             </Grid>

//             <ChatDivContainer>
//               <ChatListComponent setCurrentConversation={setCurrentConversation} />
//             </ChatDivContainer>
//           </LeftContainer>
//           <RightContainer>
//             {currentConversation ? (
//               <>
//                 <ChatHeader conversation={currentConversation} isGroup={isGroup} isAdmin={isAdmin} fetchGroupChats={getAllCompanyUser} />
//                 <MessageListComponent conversation={currentConversation} />
//                 <Divider />
//                 <MessageInputComponent conversation={currentConversation} />
//               </>
//             ) : (
//               <img
//                 width="100%"
//                 height="100%"
//                 src="/assets/images/messaging-bg.svg"
//                 style={{ objectFit: 'fit' }}
//                 alt="Messaging Background"
//               />
//             )}
//           </RightContainer>
//         </Container>
//       </Wrapper>
//     </>
//   );
// }

import * as React from "react";
import { Grid, LinearProgress, Stack, Button, Divider, Menu, MenuItem, Avatar, Badge, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ProductCartWidget } from "src/sections/@dashboard/products";
import { ChatDivContainer, Container, LeftContainer, RightContainer, StyledButton, Wrapper } from "./App.styles";
import { getConversationMessages, getSellingItems, getChatRequests, acceptChatRequest, rejectChatRequest, getblockuser } from "src/api";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import ChatListComponent from "./ChatList";
import MessageListComponent from "./MessageList";
import MessageInputComponent from "./MessageInput";
import { useNavigate } from "react-router-dom";
import Header from "src/layouts/dashboard/header";
import TransitionsModal from "src/components/modal";
import CreateGroupChat from "./create-Group";
import { getAllCompanyUser } from "src/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatRequestsModal from "./requestmodal";
import ChatHeader from "./chatheader";
import { CurrencyExchange } from "@mui/icons-material";
import SingleUserChat from "./singleuserchat";
import BLOCKUSER from "./Blockuser";
import ChatTransitionsModal from "./chatmodal";
import Iconify from "src/components/iconify";
import { green } from '@mui/material/colors';

export default function ChatPage() {
  const [currentConversation, setCurrentConversation] = useState(null); // Initialize as null
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [openTransitiongroup, setOpenTransitongroup] = useState(false);
  const [openTransitionuser, setOpenTransitonuser] = useState(false);
  const [openTransitionrequest, setOpenTransitonrequest] = useState(false);
  const [openTransitionBlock, setOpenTransitionBlock] = useState(false);
  const [loaduser, setloaduser] = useState(false);
  const queryClient = useQueryClient();
  const { data: chatRequests, isLoading: chatRequestsLoading } = useQuery('chatRequests', () => getChatRequests(currentUser.token));

  const [tooltipOpengroup, setTooltipOpengroup] = useState(false);
  const [tooltipOpenchat, setTooltipOpenchat] = useState(false);
  const [tooltipOpenrequest, setTooltipOpenrequest] = useState(false);
  const [tooltipOpenblock, setTooltipOpenblock] = useState(false);

  const handleOpengroup = () => setOpenTransitongroup(true);
  const handleClosegroup = () => setOpenTransitongroup(false);
  const handleOpenuser = () => setOpenTransitonuser(true);
  const handleCloseuser = () => setOpenTransitonuser(false);
  const handleopenrequest = () => setOpenTransitonrequest(true);
  const handlecloserequest = () => setOpenTransitonrequest(false);
  const handleopenBlock = () => setOpenTransitionBlock(true);
  const handlecloseBlock = () => setOpenTransitionBlock(false);

  const [isLoadingUser, setLoadingUser] = useState(false); // State for loading status

  // Function to toggle the loading state
  const handleloaduser = () => {
    setLoadingUser(prev => !prev); // Toggle loading state between true and false
  };

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const loadBlockedUsers = async () => {
      try {
     
        const response2 = await getblockuser();  // Get users that the current user has blocked
    
        const blockedUsersData = response2.data;  // This is an object containing blockerId and blockedId array
    
        console.log("-----------BLOCKED USER", blockedUsersData);
       
       

        // Transform the blocked users data
       

        
        setUsers(blockedUsersData);
        
      } catch (error) {
        console.error("Error fetching blocked users:", error);
        toast.error("Error fetching blocked users. Please try again.");
      }
    };

    loadBlockedUsers();
    setloaduser(false);
  }, [storedUserData.token,isLoadingUser]);

  useEffect(() => {}, [currentConversation]);
  const isAdmin = currentConversation?.user1Id === currentUser.user.id ? true : false;
  const isGroup = currentConversation?.isGroupChat;

  return (
    <>
     
      <Wrapper>
        <Container>
          <LeftContainer>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
              <Badge
                badgeContent={'online'}
                color="primary"
                sx={{ '& .MuiBadge-badge': { backgroundColor: green[400] } }}
              >
                <Avatar alt="User Avatar" src={currentUser?.user?.profilePic || ""} />
              </Badge>
              </Grid>
              <Grid item>
  <Tooltip
    title="Create Group Chat"
    open={tooltipOpengroup}
    onClose={() => setTooltipOpengroup(false)}
    onOpen={() => setTooltipOpengroup(true)}
  >
                 <div onClick={() => setTooltipOpengroup(false)}>
                  <ChatTransitionsModal
                  
                    icon={<Iconify icon="el:group" style={{ color: `#625555` }} />}
                    open={openTransitiongroup}
                    handleClose={handleClosegroup}
                    handleOpen={handleOpengroup}
                    component={<CreateGroupChat fetchGroupChats={getAllCompanyUser} handleClosegroup={handleClosegroup}/>}
                  />
                  </div>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Contact User"
                open={tooltipOpenchat}
                onClose={() => setTooltipOpenchat(false)}
                onOpen={() => setTooltipOpenchat(true)}
              >
                             <div onClick={() => setTooltipOpenchat(false)}>
                  <ChatTransitionsModal
                    icon={<Iconify icon="mdi:user-add" style={{ color: `#625555` }} />}
                    open={openTransitionuser}
                    handleClose={handleCloseuser}
                    handleOpen={handleOpenuser}
                    component={<SingleUserChat fetchGroupChats={getAllCompanyUser}  handleCloseuser={handleCloseuser}/>}
                  />
                  </div>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Chat Requests"
            
             >
                            <div >
                  <Badge badgeContent={chatRequests?.length} color="primary">
                    <ChatTransitionsModal
                      open={openTransitionrequest}
                      icon={<Iconify icon="material-symbols:chat" style={{ color: `#625555` }} />}
                      handleOpen={handleopenrequest}
                      handleClose={handlecloserequest}
                      component={<ChatRequestsModal getChatRequests={getChatRequests} />}
                      maxWidth="sm"
                    />
                  </Badge>
                  </div>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Block User"
             
             >
                            <div >
                  <ChatTransitionsModal
                    open={openTransitionBlock}
                    icon={<Iconify icon="mdi:user-block" style={{ color: `#625555` }} />}
                    handleClose={handlecloseBlock}
                    handleOpen={handleopenBlock}
                    component={<BLOCKUSER fetchGroupChats={getAllCompanyUser} />}
                    maxWidth="sm"
                  />
                  </div>
                </Tooltip>
              </Grid>
            </Grid>

            <ChatDivContainer>
              <ChatListComponent setCurrentConversation={setCurrentConversation} />
            </ChatDivContainer>
          </LeftContainer>
          <RightContainer>
            {currentConversation ? (
              <>
                <ChatHeader conversation={currentConversation} isGroup={isGroup} isAdmin={isAdmin} fetchGroupChats={getAllCompanyUser} blockeduser={users} handleloaduser={handleloaduser} />
                <MessageListComponent conversation={currentConversation} blockeduser={users} />
                <Divider />
                <MessageInputComponent conversation={currentConversation} blockeduser={users} handleloaduser={handleloaduser} />
              </>
            ) : (
              <img
                width="100%"
                height="100%"
                src="/assets/images/messaging-bg.svg"
                style={{ objectFit: 'fit' }}
                alt="Messaging Background"
              />
            )}
          </RightContainer>
        </Container>
      </Wrapper>
    </>
  );
}
