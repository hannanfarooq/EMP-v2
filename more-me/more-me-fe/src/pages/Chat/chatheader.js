import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { removememberfromgroup, addmembertogroup, BlockUser } from 'src/api'; // Assuming you have these API functions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chat } from '@mui/icons-material';

const ChatHeader = ({ conversation, isGroup, isAdmin, fetchGroupChats }) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [groupName, setGroupName] = useState(conversation.title);
  const [members, setMembers] = useState([]);
  const [tempMembers, setTempMembers] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState(conversation.title);
  const [avatar, setAvatar] = useState(conversation.avatar);
  const [alt, setAlt] = useState(conversation.alt);

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchGroupChats(storedUserData.token, storedUserData.company.id);
        const transformedUsers = response.data.map(user => ({
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }));
        setUsers(transformedUsers);
      } catch (error) {
        toast.error("Error fetching users. Please try again.");
      }
    };
    loadUsers();
  }, [storedUserData.token, storedUserData.company.id, fetchGroupChats]);

  useEffect(() => {
    if (conversation.usermap) {
      const membersArray = Object.entries(conversation.usermap).map(([id, userDetails]) => ({
        id,
        ...userDetails,
        markedForRemoval: false,
      }));
      setMembers(membersArray);
      setTempMembers(membersArray); // initialize tempMembers with members
    }
  }, [conversation.usermap]);

  useEffect(() => {
    setTitle(conversation.title);
    setAvatar(conversation.avatar);
    setAlt(conversation.alt);
    setGroupName(conversation.title); // also update groupName for editing
  }, [conversation]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setTempMembers(members); // reset tempMembers to the current members
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleMemberAdd = () => {
    if (selectedUser) {
      const newMember = users.find(user => user.id == selectedUser);
      if (newMember) {
        setTempMembers([...tempMembers, newMember]);
        setAddedMembers([...addedMembers, newMember.id]);
        setSelectedUser('');
      }
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...tempMembers];
    newMembers[index][field] = value;
    setTempMembers(newMembers);
  };

  const handleMemberRemove = (index) => {
    const newMembers = [...tempMembers];
    newMembers[index].markedForRemoval = !newMembers[index].markedForRemoval;

    if (newMembers[index].markedForRemoval) {
      setRemovedMembers([...removedMembers, newMembers[index].id]);
    } else {
      setRemovedMembers(removedMembers.filter(id => id !== newMembers[index].id));
    }

    setTempMembers(newMembers);
  };

  const handleSave = () => {
    const remainingMemberIds = tempMembers
      .filter(member => !member.markedForRemoval)
      .map(member => member.id);

    if (removedMembers.length > 0) {
      removememberfromgroup(remainingMemberIds, conversation.id)
        .then(() => {
          toast.success("Members removed successfully");
        })
        .catch(() => {
          toast.error("Failed to remove members");
        });
    }

    if (addedMembers.length > 0) {
      const newMembers = addedMembers.map(id => [id]);
      addmembertogroup(newMembers, conversation.id)
        .then(() => {
          toast.success("Members added successfully");
        })
        .catch(() => {
          toast.error("Failed to add members");
        });
    }

    setMembers(tempMembers.filter(member => !member.markedForRemoval));
    setAddedMembers([]);
    setRemovedMembers([]);
    setOpen(false);
    setEditMode(false);
  };

  const handleBlockUser = () => {
    let id = null;
    members.map(member=>
      {
        if(member.id!=storedUserData.user.id)
          {
            id=parseInt(member.id);
            
          }
      }
    )
    BlockUser(id).then(() => {
      toast.success("User Blocked ");
      handleLeaveGroup();
      window.location.reload();

    }, 3000)
    .catch(() => {
      toast.error("Failed to Block User");
    });
  };

  const handleLeaveGroup = () => {
    const userId = storedUserData.user.id;
    const remainingMemberIds = members
      .filter(member => member.id != userId)
      .map(member => member.id);
console.log("REMAINGING USER AFTER LEAVING GROUP : ",remainingMemberIds);
    removememberfromgroup(remainingMemberIds, conversation.id)
      .then(() => {
        toast.success("Chat Deleted successfully");
        // Optionally, you can add a redirect or update the state to reflect that the user left the group
      })
      .catch(() => {
        toast.error("Failed to Chat Delete ");
      });
  };

  const filteredUsers = users.filter(user => !members.find(member => member.id == user.id));

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Avatar alt={alt} src={avatar} style={{ marginRight: 10 }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {isGroup ? `Group: ${title}` : `${title}`}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleClickOpen}>
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose} aria-labelledby="group-info-title">
        <DialogTitle id="group-info-title">
          {editMode ? (
            <TextField fullWidth label="Group Name" value={groupName} onChange={handleGroupNameChange} />
          ) : (
            'Group Information'
          )}
        </DialogTitle>
        <DialogContent>
          <List>
            {editMode ? (
              tempMembers.map((member, index) => (
                <ListItem key={member.id}>
                  <Avatar alt={member.fullName} src={conversation.avatar} style={{ marginRight: 10 }} />
                  <TextField
                    fullWidth
                    label={`Member ${index + 1}`}
                    value={member.fullName || ''}
                    onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                    style={{ marginRight: 10 }}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    label={`Email ${index + 1}`}
                    value={member.email || ''}
                    onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    style={{ marginRight: 10 }}
                    disabled={true}
                  />
                  {isAdmin && member.id != conversation.user1Id && (
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={() => handleMemberRemove(index)}
                      style={{ color: member.markedForRemoval ? 'red' : 'inherit' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))
            ) : (
              <>
                <ListItem>
                  <ListItemText primary="Group Name" secondary={groupName} />
                </ListItem>
                {members.map((member) => (
                  <ListItem key={member.id}>
                    <Avatar alt={member.fullName} src={member.profilePic} style={{ marginRight: 10 }} />
                    <ListItemText
                      primary={member.fullName}
                      secondary={member.id == conversation.user1Id ? '(Admin)' : null}
                    />
                    <ListItemText primary={member.email} />
                  </ListItem>
                ))}
              </>
            )}
          </List>
          {isAdmin && editMode ? (
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel id="select-user-label">Select User</InputLabel>
                <Select
                  labelId="select-user-label"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {filteredUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="text" color="primary" onClick={handleMemberAdd} style={{ marginTop: 10 }}>
                Add Member
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: 10 }}>
                Save
              </Button>
              <Button variant="text" color="secondary" onClick={handleEditModeToggle} style={{ marginTop: 10 }}>
                Cancel
              </Button>
            </Box>
          ) : (
            isAdmin  && isGroup&& (
              <Button variant="contained" color="primary" onClick={handleEditModeToggle}>
                Edit
              </Button>
            )
          )}
          {!isGroup && (
            <Button variant="contained" color="secondary" onClick={handleBlockUser} style={{ marginTop: 10 }}>
              Block User
            </Button>
            
          )
          }
          {
            !isGroup && (
              <Button variant="contained" color="secondary" onClick={handleLeaveGroup} style={{ marginTop: 10,marginLeft:10 }}>
              Delete Chat
            </Button>
              
            )
          }
          {isGroup && !isAdmin && (
            <Button variant="contained" color="secondary" onClick={handleLeaveGroup} style={{ marginTop: 10 }}>
              Leave Group
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default ChatHeader;
