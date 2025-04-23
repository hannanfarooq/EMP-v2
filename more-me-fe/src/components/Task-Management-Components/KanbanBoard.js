import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';
import {
  Button,
  Container,
  Modal,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepContent,
  StepLabel,
  MenuItem,
  Divider,
  IconButton,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Dialog, DialogActions, DialogContent, DialogTitle,       DatePicker
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddIcon from '@mui/icons-material/Add';
import { Helmet } from 'react-helmet-async';

import { ClearBoardAndAssociations, Create_SubTask, createboard, createtask, createtaskchat, deleteBoardAndAssociations, getallboards, getAllCompanyUser, getAlldepartmentuser, getProjectsBTeamid, getProjectsByDepartmentId, getProjectsforUser, gettaskchat, getTeamuser, updateSubTaskStatus, updateTaskBoardId, updateTaskBoardUser } from 'src/api';

import { toast } from 'react-toastify';
import { socket } from "../../App"
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ImageIcon from '@mui/icons-material/Image';
import { uploadImageAndGetURL } from 'src/utils/uploadImageAndGetURL';
import { uploadPDFAndGetURL } from 'src/utils/uploadPDFAndGetURL';
import Microlink from '@microlink/react'; // For link previews

function KanbanBoard() {
  const [data, setData] = useState([]);
  const [user, setuser] = useState([]);
const [budget,setBudget]=useState(null);

const [filterProject,setFilterProject]=useState(null);

  const [popupOpen, setPopupOpen] = useState(null); // Column ID for which popup is open
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedCard, setSelectedCard] = useState(null); // Card modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [newAssignee,setNewAssignee]=useState(null);
  const [newColumn,setNewColumn]=useState(null);
  const [quickComments, setQuickComments] = useState({});
  const [fetchchat,setfetchchat]=useState(true);

  const [message, setMessage] = useState('');
  const [taskId, setTaskId] = useState(1); // Example task ID; replace with dynamic value
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [link, setLink] = useState('');
  const [taskchat,settaskchat]=useState([]);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [status,setstatus]=useState(null);
const [selectedproject,setSelectedproject]=useState(null); 
  const popupRef = useRef(null);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));


  const [taskTitle, setTaskTitle] = useState('');
const [assignee, setAssignee] = useState('');
const [deadline, setDeadline] = useState(null);
const [tags, setTags] = useState('');
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
const [subtaskModalOpen, setsubtaskModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

const [selectedcolumn ,setselectedcolumn] =useState(null);
const [description, setDescription] = useState('');  // for rich text editor
const [activeStep, setActiveStep] = useState(0);  // Control active step dynamically
const [activeTab, setActiveTab] = useState(0);
const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};

  const fetchDepartmentUser = async () => {
    const companyData = await getAlldepartmentuser(
      storedUserData.token,
      storedUserData.user.departmentId
    );
 
    const sortedData = companyData.data
    ?.filter((user, index, self) => 
      user.id !== storedUserData.user.id && 
      !self.some((t, idx) => t.id === user.id && idx < index) // Ensure no duplicates based on user.id
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      // For descending order
      return dateB - dateA;
    });
  console.log("FETCH DATA " ,sortedData);
    setuser(sortedData);
  };

 const fetchTeamUser = async () => {
    const companyData = await getTeamuser(
      storedUserData.token,
      storedUserData.user.teamid
    );
    console.log("-----------------TEAM", companyData);

    const sortedData = companyData.data
     // Filter out the logged-in user
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        //return dateA - dateB; // For ascending order
        return dateB - dateA; // For descending order
      });
    // Log the sorted data
    console.log("Sorted Data:", sortedData);
    
    setuser(sortedData);
  };

    const fetchCompanyUser = async () => {
      const companyData = await getAllCompanyUser(
        storedUserData.token,
        storedUserData.company.id
      );
      console.log("compan data b date:", companyData);
  
      const sortedData = companyData.data
        ?.filter((user) =>  user.role != "company-super-admin") // Filter out the logged-in user
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          //return dateA - dateB; // For ascending order
          return dateB - dateA; // For descending order
        });
      // Log the sorted data
      console.log("Sorted Data:", sortedData);
      setuser(sortedData);
    };
const addNewTask = (columnId) => {
  setIsTaskModalOpen(true); // Open modal
  // Reset the task form when opening the modal
  setselectedcolumn(columnId);
  setTaskTitle('');
  setAssignee('');
  setDeadline(null);
  setTags('');
  setDescription("");
};
const addNewsubTask = () => {
  setsubtaskModalOpen(true); // Open modal
  // Reset the task form when opening the modal
 
  setTaskTitle('');
  setAssignee('');
  setDeadline(null);
  setTags('');
  setDescription("");
};
  // Close the popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(null);
      }
    };

    if (popupOpen !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [popupOpen]);


  const fetchBoards = async () => {
    try {
       // Replace with the actual company ID
      const boards = await getallboards(storedUserData.token, storedUserData.company.id);
     console.log("TASK WITH BAORDS",boards.boards);
      setData(boards.boards);
      // Set the fetched data to the state
    } catch (err) {
    
    } finally {
     }
  };
  useEffect(() => {
   
    fetchCompanyUser();
if(storedUserData.user.role=="manager")
{
  getProjectsByDepartmentId(storedUserData.token,storedUserData.user.departmentId).then((response) => {
    console.log("PROJECTS",response);
      setProjects(response);
  })
  .catch((error) => {
    setProjects([]);
      toast.error("Failed to fetch teams");
  });
}
else 
{
  getProjectsforUser(storedUserData.token,storedUserData.user.id).then((response) => {
    console.log("PROJECTS",response);
      setProjects(response);
  })
  .catch((error) => {
      toast.error("Failed to fetch teams");
  });
}

 

    fetchBoards();
   
    
  }, []);

  useEffect(() => {
    // Listen for boards update from the server
  
    socket.on('boardsUpdated', (updatedBoards) => {

      fetchBoards();
      setData(updatedBoards); // Update the boards state with the updated data
    
     
    });
    socket.on('getchat', (chat) => {
    
      
    
      if(selectedCard)
        {
          getchat();
          setfetchchat(false);
        }
       

   
    });
    // Cleanup function when component unmounts
    return () => {
      socket.off('boardsUpdated');  // Remove the listener when the component unmounts
    };
  }, []); 

  useEffect(() => {
    if (selectedCard) {
      let updatedCard = null;
  
      // Iterate over boards if `updatedBoards` is an object
      for (const key in data) {
        const board = data[key];
        if (Array.isArray(board.items)) {
          updatedCard = board.items.find(item => item.id === selectedCard.id);
          if (updatedCard) break; // Exit loop once found
        }
      }
  
      if (updatedCard) {
        setSelectedCard(updatedCard);
      }
    }
  
   
  }, [data]); 


 useEffect(()=>{

  if(selectedCard)
  {
    getchat();
    setfetchchat(true);
  }
 },[fetchchat])

  const openLinkDialogHandler = () => {
    setOpenLinkDialog(true);
  };

  const closeLinkDialogHandler = () => {
    setOpenLinkDialog(false);
  };
  const handleLinkSubmit = () => {
    if (link) {
      setOpenLinkDialog(false);
    } else {
      alert("Please enter a valid link.");
    }
  };
    const handleImageUpload = async (e) => {
      setIsUploading(true);
      const uploadUrl = await uploadImageAndGetURL(e.target.files[0]);
      setImageUrl(uploadUrl);
      setIsUploading(false);
    };
  
    const handlePDFUpload = async (e) => {
      setIsUploading(true);
      const uploadUrl = await uploadPDFAndGetURL(e.target.files[0]);
      setAttachmentUrl( uploadUrl);
      setIsUploading(false);
    };
  const getchat = async () => {
    try {
       // Replace with the actual company ID
      const res = await gettaskchat(storedUserData.token,selectedCard.id);
      console.log("CHAT _____________",res);
     settaskchat(res);
      // Set the fetched data to the state
    } catch (err) {
    
    } finally {
     }
  };

  useEffect(() => {
  
  if(selectedCard)
  {
 
    getchat();
  
  }
   
  }, [selectedCard]); 

  const onDragEnd = async (result) => {
    const { source, destination } = result;
  
    if (!destination) return;
  
    const sourceColumn = data[source.droppableId];
    const destColumn = data[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
  
    const [movedItem] = sourceItems.splice(source.index, 1);
  
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setData({
        ...data,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });


    } else {
      destItems.splice(destination.index, 0, movedItem);
      setData({
        ...data,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
   await   updateTaskBoardId(storedUserData.token,movedItem.id,destination.droppableId,storedUserData.user.id);
  
    
    }
    await fetchBoards();
  };
  

  const renameColumn = (columnId) => {
    const newName = prompt('Enter new column name:');
    if (newName) {
      setData({
        ...data,
        [columnId]: {
          ...data[columnId],
          name: newName, // Update the column's name
        },
      });
    }
    setPopupOpen(null);
  };
  
  const clearColumn = async (columnId) => {
 const res =  await  ClearBoardAndAssociations(storedUserData.token,columnId);
 if(res?.code==200)
 {
   setData({
     ...data,
     [columnId]: {
       ...data[columnId],
       items: [], // Clear the items array
     },
   });
   setPopupOpen(null);

 }
  };
  

  const deleteColumn =async (columnId) => {
    const updatedData = { ...data };

  const res = await  deleteBoardAndAssociations(storedUserData.token,columnId);
  if(res?.code==200)
  {
    delete updatedData[columnId]; // Remove the column by its ID
    setData(updatedData); // Update state with the remaining columns
    setPopupOpen(null);
  }
    
  };
  

  const addNewBoard = async () => {
    if (!newBoardName.trim()) return;

    if(!filterProject)
    {


      toast.error('Please Select A Project');
    }
  
    // Check if a board with the same name already exists
    const boardExists = Object.values(data || {}).some(
      (column) =>
        column.name.toLowerCase() === newBoardName.trim().toLowerCase() &&
        column.projectId === filterProject
    );
  
    if (boardExists) {
      toast.error('A board with this name already exists.');
      return;
    }
  
   
  
    try {
    
    const res=  await createboard(storedUserData.token,storedUserData.company.id, newBoardName,filterProject);
    console.log("BOARD ADD ",res);
      setNewBoardName('');
      setIsAddingBoard(false);
     await fetchBoards();
      toast.success('Board created successfully!');
    } catch (error) {
      toast.error('Failed to create board. Please try again.');
    }

  };
 

  


  const handleTaskSave = async () => {
    const newTask = {
   
      title: taskTitle,
      assignedTo: [assignee], // Assuming assignee is a single person for simplicity
      description: description,
      deadline: deadline,
      tag: tags,
      comments: 0,
      attachments: 0,
      image: '',
    };

    const selectedProject = projects.find((project) => project.id === filterProject);
    if (!selectedProject) {
      alert("Selected project not found!");
      return;
    }
   
  
const rep = await createtask(storedUserData.token,taskTitle,assignee,description,deadline,tags,selectedcolumn);
    // Ensure the column exists and add the new task to it
    const updatedColumn = {
      ...data[selectedcolumn], // Spread the existing column data
      items: [...data[selectedcolumn].items, newTask], // Append the new task to items array
    };
  
    // Update the data state to reflect the changes for the specific column
    setData({
      ...data, // Keep other parts of the data intact
      [selectedcolumn]: updatedColumn, // Update the column with the new task
    });
  setselectedcolumn(null);
    setIsTaskModalOpen(false); // Close the modal after saving
  };
  const handleTaskSub = async () => {
    const newTask = {
   
      title: taskTitle,
      assignedTo: [assignee], // Assuming assignee is a single person for simplicity
      description: description,
      deadline: deadline,
      tag: tags,
      comments: 0,
      attachments: 0,
      image: '',
    };
   
const rep = await Create_SubTask(storedUserData.token,taskTitle,assignee,description,deadline,selectedCard?.id);
    // Ensure the column exists and add the new task to it
   

    setsubtaskModalOpen(false); // Close the modal after saving
  };

  
  // Close the modal
  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
  };
  const handleSubTaskModalClose = () => {
    setsubtaskModalOpen(false);
  };
  const handleCardClick = (e,card, columnId) => {
    if (e.target.closest('select') || e.target.closest('textarea') || e.target.closest('button')) {
      e.preventDefault();
      return;
    }
    setSelectedCard({ ...card, columnId });
    setActiveTab(0);
  };

  const handleCardModalClose = () => {
    setSelectedCard(null);
  };

  const handleCardSave = () => {
    const { columnId, id, title, assignee, description, image } = selectedCard;

    const updatedItems = data.columns[columnId].items.map((item) =>
      item.id === id ? { id, title, assignee, description, image } : item
    );

    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          items: updatedItems,
        },
      },
    });

    setSelectedCard(null);
  };


  const filterTasks = (items) => {
    return items && items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
        let matchesAssignee;

        if(storedUserData.user.role === "manager" || 
          selectedproject?.projectLead === storedUserData.user.id || 
          selectedproject?.projectAdministrator === storedUserData.user.id)

        {
          if(!filterAssignee)
          {
             matchesAssignee = Array.isArray(item.assignedTo) &&
            item.assignedTo.some((assignee) =>
              Array.isArray(user) &&
              user.some((user) => {

             

                return user.id === assignee;
              })
            );
          }
          else
          {

            matchesAssignee =
            !filterAssignee || item.assignedTo.includes(filterAssignee);
          
          }
        
        }
        else
        {

           matchesAssignee =
          item.assignedTo.includes(storedUserData.user.id) ||
          item.subtasks.some((subtask) => subtask.assignedTo.includes(storedUserData.user.id));

        }
     
      const matchesPriority =
        !filterPriority || item.tag === filterPriority;

      return matchesSearch && matchesAssignee && matchesPriority;
    });
  };
  const handleUpdate = async (id, newAssignee, newColumn, quickComment, columnId) => {
    try {
      // Handle the quick comment if provided
      if (quickComment[id] && quickComment[id].trim() !== "") {
        await createtaskchat(
          storedUserData.token,
          id,
          storedUserData.user.id,
          quickComment[id],
          imageUrl,
          attachmentUrl,
          link
        );
  await   getchat();
        // Clear the quick comment for this specific task
        setQuickComments((prev) => ({
          ...prev,
          [id]: "", // Clear the comment for this task
        }));
      }
  
      // Update the task's assigned user
      if (newAssignee) {
        await updateTaskBoardUser(
          storedUserData.token,
          id,
          newAssignee,
          storedUserData.user.id
        );
      }
  
      // Update the task's column if it has changed
      if (newColumn && newColumn !== columnId) {
        await updateTaskBoardId(
          storedUserData.token,
          id,
          newColumn,
          storedUserData.user.id
        );
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };
  

const filteredColumns = filterProject
  ? Object.fromEntries(
      Object.entries(data || {})
        .filter(([columnId, column]) => column.projectId === filterProject) // Filter columns based on projectId
        .map(([columnId, column]) => [
          columnId,
          { ...column, items: filterTasks(column.items) }, // Keep the original task filtering logic
        ])
    )
  : {};

  const tag = selectedCard?.tag;  // Only one tag should be in selectedCard.tags
 
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  
  // Define color for the tag
  let tagColor;
  switch (tag) {
    case 'High Priority':
      tagColor = 'error';  // Red color for high priority
      break;
    case 'Medium Priority':
      tagColor = 'warning'; // Yellow color for medium priority
      break;
    case 'Low Priority':
      tagColor = 'success'; // Green color for low priority
      break;
    case 'Blocked':
      tagColor = 'gray'; // Gray for blocked
      break;
    default:
      tagColor = 'default'; // Default color
  }


//Chat Task 
const handleSend = async () => {
  try {
    // Build the payload
  

    // Call the API
   await createtaskchat(storedUserData.token,selectedCard.id,storedUserData.user.id,message,imageUrl,attachmentUrl,link);
    

    // Clear the input fields after successful API call
    setMessage('');
    setImageUrl('');
    setAttachmentUrl('');
    setLink('');
  } catch (error) {
    console.error('Error sending message:', error.response || error.message);
  }
};

const handleStatusChange = async (subtaskId, newStatus) => {
  try {
    // Call the API to update the status
    const response = await updateSubTaskStatus(storedUserData.token, subtaskId, newStatus,storedUserData.user.id);
console.log("STATUS UPDATE: ",response);
    if (response && response.success) {
      // Update the local state to reflect the new status
      setSelectedCard((prevCard) => ({
        ...prevCard,
        subtasks: prevCard.subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
        ),
      }));
    } else {
      console.error("Failed to update status:", response.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error updating subtask status:", error);
  }
};

const handleProjectSelect = (e) => {
  setFilterProject(e.target.value);
  const selected = projects.find((project) => project.id === e.target.value);
  setSelectedproject(selected); // Set the selected project
};

  return (
    <>
      <Helmet>
        <title>Task Management | Hr.System</title>
      </Helmet>

      <Dialog open={subtaskModalOpen} onClose={handleSubTaskModalClose}>
      <DialogTitle>Add New Sub Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            label="Assigned To"
          >
            <MenuItem value="">Select Assignee</MenuItem>
            {user && user
  .filter(userItem => selectedproject?.projectTeam?.includes(userItem.id)) // Filter users by project team
  .map((userItem) => (
    <MenuItem key={userItem.id} value={userItem.id}>
      <ListItemIcon>
        <Avatar src={userItem.profilePic} alt={`${userItem.firstName} ${userItem.lastName}`} />
      </ListItemIcon>
      <ListItemText primary={`${userItem.firstName} ${userItem.lastName}`} />
    </MenuItem>
))}
          </Select>
        </FormControl>

        <TextField
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

       

        {/* Rich Text Editor for Description */}
        <div style={{ marginTop: '20px' }}>
          <InputLabel>Description</InputLabel>
          <ReactQuill
            value={description}
            onChange={setDescription}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['blockquote'],
                [{ align: [] }],
                ['clean'],
              ],
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubTaskModalClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleTaskSub()} color="primary">
          Save Task
        </Button>
      </DialogActions>
    </Dialog>



   {/* Modal for adding a new task */}
   {/* Modal for adding a new task */}
<Dialog open={isTaskModalOpen} onClose={handleTaskModalClose}>
  <DialogTitle>Add New Task</DialogTitle>
  <DialogContent>
    <TextField
      label="Task Title"
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      fullWidth
      margin="normal"
    />

    <FormControl fullWidth margin="normal">
      <InputLabel>Assigned To</InputLabel>
      <Select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        label="Assigned To"
      >
        <MenuItem value="">Select Assignee</MenuItem>
        {user && user
  .filter(userItem => selectedproject?.projectTeam?.includes(userItem.id)) // Filter users by project team
  .map((userItem) => (
    <MenuItem key={userItem.id} value={userItem.id}>
      <ListItemIcon>
        <Avatar src={userItem.profilePic} alt={`${userItem.firstName} ${userItem.lastName}`} />
      </ListItemIcon>
      <ListItemText primary={`${userItem.firstName} ${userItem.lastName}`} />
    </MenuItem>
))}
      </Select>
    </FormControl>

    <TextField
      label="Deadline"
      type="date"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      fullWidth
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
    />

    <FormControl fullWidth margin="normal">
      <InputLabel>Tags</InputLabel>
      <Select
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        label="Tags"
      >
        <MenuItem value="">Select Tags</MenuItem>
        <MenuItem value="High Priority">High Priority</MenuItem>
        <MenuItem value="Medium Priority">Medium Priority</MenuItem>
        <MenuItem value="Low Priority">Low Priority</MenuItem>
      </Select>
    </FormControl>


 

    {/* Rich Text Editor for Description */}
    <div style={{ marginTop: '20px' }}>
      <InputLabel>Description</InputLabel>
      <ReactQuill
        value={description}
        onChange={setDescription}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            ['blockquote'],
            [{ align: [] }],
            ['clean'],
          ],
        }}
      />
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleTaskModalClose} color="secondary">
      Cancel
    </Button>
    <Button onClick={() => handleTaskSave()} color="primary">
      Save Task
    </Button>
  </DialogActions>
</Dialog>


    <Container maxWidth="xl">
  <Grid container spacing={2} sx={{ mb: 5 }}>

    {/* Filter by Project */}
    <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Select Project</InputLabel>
          <Select
            value={filterProject}
            onChange={handleProjectSelect} // Using handleProjectSelect to set the selected project
            label="Select Project"
          >
            {Array.isArray(projects) && projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

    {/* Role-based conditional rendering */}
    {(storedUserData.user.role === "manager" || 
  selectedproject?.projectLead === storedUserData.user.id || 
  selectedproject?.projectAdministrator === storedUserData.user.id) && (
    <>
      {/* Search Tasks */}
      <Grid item xs={12} md={4}>
        <TextField
          placeholder="Search tasks"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Grid>

      {/* Filter by Assignee */}
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Filter by Assignee</InputLabel>
          <Select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            label="Filter by Assignee"
          >
            <MenuItem key={0} value="">
              <ListItemIcon>
                <Avatar src={null} alt={`All`} />
              </ListItemIcon>
              <ListItemText primary={`All`} />
            </MenuItem>
            {user && user
  .filter(userItem => selectedproject?.projectTeam?.includes(userItem.id)) // Filter users by project team
  .map((userItem) => (
    <MenuItem key={userItem.id} value={userItem.id}>
      <ListItemIcon>
        <Avatar src={userItem.profilePic} alt={`${userItem.firstName} ${userItem.lastName}`} />
      </ListItemIcon>
      <ListItemText primary={`${userItem.firstName} ${userItem.lastName}`} />
    </MenuItem>
))}
          </Select>
        </FormControl>
      </Grid>

      {/* Filter by Priority */}
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Filter by Priority</InputLabel>
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            label="Filter by Priority"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High Priority">High Priority</MenuItem>
            <MenuItem value="Medium Priority">Medium Priority</MenuItem>
            <MenuItem value="Low Priority">Low Priority</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>
)}


  </Grid>



  {/* Add New Board Button */}

  {
      (storedUserData.user.role === "manager" || 
        selectedproject?.projectLead === storedUserData.user.id || 
        selectedproject?.projectAdministrator === storedUserData.user.id) &&(filterProject) &&(
      <Grid container alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
      <Button
        onClick={() => setIsAddingBoard(!isAddingBoard)}
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
      >
        Add New Board
      </Button>
    </Grid>
    )
  }


  {/* Add New Board Input */}
  {isAddingBoard && (
    <div style={{ position: 'relative' }}>
      <div className="add-board-input-container">
        <input
          type="text"
          className="add-board-input"
          placeholder="Enter board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addNewBoard();
          }}
        />
        <Button onClick={addNewBoard}>Add</Button>
      </div>
    </div>
  )}

</Container>


   
      <div className="kanban-container">
  <DragDropContext onDragEnd={onDragEnd}>
    {Object.entries(filteredColumns).map(([columnId, column]) => (
      <div className="kanban-column" key={columnId.toString}>
        <div className="kanban-column-header">

          
          <h3 className="kanban-column-title">{column.name}</h3>

          {

(storedUserData.user.role === "manager" || 
  selectedproject?.projectLead === storedUserData.user.id || 
  selectedproject?.projectAdministrator === storedUserData.user.id) &&

            <button
            className="kanban-header-menu"
            onClick={() =>
              setPopupOpen(popupOpen === columnId ? null : columnId)
            }
          >
            ⋮
          </button>
          }
        
          {popupOpen === columnId && (
            <div className="popup-menu" ref={popupRef}>
              <button
                className="popup-menu-item"
                onClick={() => addNewTask(columnId)}
              >
                🆕 New Task
              </button>

            
             
              <button
                className="popup-menu-item"
                onClick={() => clearColumn(columnId)}
              >
                🧹 Clear
              </button>
              <button
                className="popup-menu-item delete"
                onClick={() => deleteColumn(columnId)}
              >
                🗑️ Delete
              </button>
            </div>

            
          )}
        </div>
        <Droppable droppableId={columnId}>
  {(provided) => (
    <div
      className="kanban-column-items"
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      {column.items && column.items.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={
          item.subtasks?.length > 0 && 
          !item.subtasks.every(subtask => subtask.status === 'Completed')
        }>
          {(provided) => (
            <div
      className="kanban-card"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={(e) => handleCardClick(e, item, columnId)} // Pass event, card, and columnId
    >
              <h4
                className="kanban-card-title"
                style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}
              >
                {item.title}
              </h4>

              {/* Assignees */}
              <div className="assignees" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                {item.assignedTo.map((assigneeId, idx) => {
                  const assignee = user &&user.find((userItem) => userItem.id === assigneeId);
                  return assignee ? (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Avatar
                        alt={`${assignee.firstName} ${assignee.lastName}`}
                        src={assignee.profilePic}
                        sx={{
                          width: 32,
                          height: 32,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#555',
                        }}
                      >
                        {assignee.firstName} {assignee.lastName}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Metadata */}
              <div className="kanban-card-meta" style={{ marginBottom: '12px' }}>
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.tag && (
                    <Chip
                      label={item.tag}
                      color={(() => {
                        switch (item.tag) {
                          case 'High Priority':
                            return 'error';
                          case 'Medium Priority':
                            return 'warning';
                          case 'Low Priority':
                            return 'success';
                          case 'Blocked':
                            return 'default';
                          default:
                            return 'default';
                        }
                      })()}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: '16px',
                        padding: '0 8px',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Deadline */}
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Due Date:</strong>{' '}
                {new Date(item.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>

              {/* Update Options */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {

(storedUserData.user.role === "manager" || 
  selectedproject?.projectLead === storedUserData.user.id || 
  selectedproject?.projectAdministrator === storedUserData.user.id)&&

                    <>
             {/* Reassign User */}
<select
  value={newAssignee || item.assignedTo[0] || ''}
  onChange={(e) => setNewAssignee(e.target.value)}
  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
>
  <option value="">Select User</option>

  {user && user
    .filter(userItem => selectedproject?.projectTeam?.includes(userItem.id)) // Filter users by project team
    .map((userItem) => (
      <option key={userItem.id} value={userItem.id}>
        {userItem.firstName} {userItem.lastName}
      </option>
  ))}
</select>
      
                        {/* Update Column */}
                        <select
  value={newColumn || columnId}
  onChange={(e) => setNewColumn(e.target.value)}
  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
>
  <option value="">Select Column</option>
  {Object.entries(data || {}).map(([id, column]) => {
    // Filter columns based on projectId matching filterProject
    if (column.projectId === filterProject) {
      return (
        <option key={id} value={id}>
          {column.name}
        </option>
      );
    }
    return null; // Skip if projectId doesn't match
  })}
</select>
      </>
                  }
              
                  {/* Quick Comment */}
                  <textarea
  placeholder="Add a quick comment..."
  value={quickComments[item.id] || ''} // Get the comment for this task, or use an empty string if none exists
  onChange={(e) =>
    setQuickComments((prev) => ({
      ...prev,
      [item.id]: e.target.value, // Update the comment for this specific task
    }))
  }
  style={{
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    resize: 'none',
    height: '60px',
  }}
></textarea>


                  {/* Update Button */}
                  <button
                    onClick={() => handleUpdate(item.id, newAssignee, newColumn, quickComments,columnId)}
                    style={{
                      padding: '8px 16px',

                      backgroundColor: '#007bff',

                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>

      </div>
    ))}
  </DragDropContext>
</div>


{selectedCard && (
  <Modal open={!!selectedCard} onClose={handleCardModalClose}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '90%',
        maxWidth: '1000px',
        height: '80vh',
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        gap: 3,


      }}
    >
      {/* Left Pane - Task Details */}
      <Box
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        borderRight: '1px solid #ddd',
      }}
    >
      {/* Tabs */}
      <Tabs
  value={activeTab}
  onChange={handleTabChange}
  sx={{
    marginBottom: 3,
    overflowX: 'auto', // Ensure the tabs container can scroll
    '& .MuiTabs-scrollableX': {
      overflowX: 'auto',
    },
  }}
  textColor="primary"
  indicatorColor="primary"
  variant="scrollable" // Enables horizontal scrolling
  scrollButtons="auto" // Automatically shows scroll buttons
>
  <Tab label="General" /> {/* Main task tab */}
  {selectedCard.subtasks?.map((subtask, index) => (
    <Tab key={index} label={`Subtask ${subtask.title}`} />
  ))}
</Tabs>

      {/* Tab Panels */}
      {activeTab === 0 && (
  <Box sx={{ p: 3 }}>
    {/* Add Sub Task */}

    {(storedUserData.user.role === "manager" || 
  selectedproject?.projectLead === storedUserData.user.id || 
  selectedproject?.projectAdministrator === storedUserData.user.id)&&

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
    <Button
      variant="contained"
      color="primary"
      onClick={addNewsubTask}
      sx={{
        textTransform: 'none',
        fontWeight: 'bold',
      }}
    >
      Add Subtask
    </Button>
  </Box>

    }
    
    {/* Task Title */}
    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
      {selectedCard.title}
    </Typography>

    {/* Assignees */}
    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
      Assigned to:
    </Typography>
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3,
        p: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {selectedCard.assignedTo?.map((assigneeId, idx) => {
        const assignee = user?.find((userItem) => userItem.id === assigneeId);
        return (
          assignee && (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: '50px',
                padding: '4px 8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar
                alt={`${assignee.firstName} ${assignee.lastName}`}
                src={assignee.profilePic}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {assignee.firstName} {assignee.lastName}
              </Typography>
            </Box>
          )
        );
      })}
    </Box>

    {/* Description */}
    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
      Description:
    </Typography>
    <Box
      sx={{
        padding: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        height: '200px',
        mb: 3,
      }}
    >
      <Typography
        dangerouslySetInnerHTML={{
          __html: selectedCard.description || 'No description provided.',
        }}
        sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      />
    </Box>

    {/* Due Date */}
    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
      Due Date:
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      {new Date(selectedCard.deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </Typography>

    {/* Tag */}
    {selectedCard.tag && (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
          Tag:
        </Typography>
        <Chip
          label={selectedCard.tag}
          color={(() => {
            switch (selectedCard.tag) {
              case 'High Priority':
                return 'error';
              case 'Medium Priority':
                return 'warning';
              case 'Low Priority':
                return 'success';
              case 'Blocked':
                return 'default';
              default:
                return 'default';
            }
          })()}
          sx={{
            border: '1px solid #ddd',
            borderRadius: '16px',
            padding: '0 8px',
          }}
        />
      </Box>
    )}

    {/* Last Modified */}
    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
      Last Modified Date:
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      {new Date(selectedCard.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}{' '}
      {new Date(selectedCard.updatedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}
    </Typography>

    {/* Change History */}
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
      Change History:
    </Typography>
    <Box
      sx={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stepper activeStep={-1} orientation="vertical">
        {selectedCard.history ? (
          selectedCard.history.map((historyItem, index) => (
            <Step key={index}>
              <StepLabel>
                {historyItem.changeHistory[0]?.description || 'No description'}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {new Date(historyItem.creationDate).toLocaleDateString('en-US')},{' '}
                  {new Date(historyItem.creationDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Typography>
              </StepContent>
            </Step>
          ))
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            No history recorded.
          </Typography>
        )}
      </Stepper>
    </Box>
  </Box>
)}

{activeTab > 0 && (
  <Box sx={{ p: 3 }}>
    {/* Subtask Title */}
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
      Subtask {activeTab}: {selectedCard.subtasks[activeTab - 1]?.title || 'Unnamed'}
    </Typography>

    {/* Status Dropdown */}
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
      Status:
    </Typography>
    <Select
  value={selectedCard.subtasks[activeTab - 1]?.status || ''} // Reflect current status
  onChange={(e) => handleStatusChange(selectedCard.subtasks[activeTab - 1].id, e.target.value)}
  displayEmpty
  fullWidth
  sx={{
    mb: 3,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }}
>
  <MenuItem value="" disabled>
    Select Status
  </MenuItem>
  <MenuItem value="Pending">Pending</MenuItem>
  <MenuItem value="In Progress">In Progress</MenuItem>
  <MenuItem value="Completed">Completed</MenuItem>
</Select>
    {/* Description */}
    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
      Description:
    </Typography>
    <Box
      sx={{
        padding: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        height: '200px',
        mb: 3,
      }}
    >
      <Typography
        dangerouslySetInnerHTML={{
          __html: selectedCard.subtasks[activeTab - 1]?.description || 'No description provided.',
        }}
        sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
      />
    </Box>

    {/* Subtask Assignees */}
    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
      Assigned to:
    </Typography>
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3,
        p: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {selectedCard.subtasks[activeTab - 1]?.assignedTo?.map((assigneeId, idx) => {
        const assignee = user?.find((userItem) => userItem.id === assigneeId);
        return (
          assignee && (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: '50px',
                padding: '4px 8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar
                alt={`${assignee.firstName} ${assignee.lastName}`}
                src={assignee.profilePic}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {assignee.firstName} {assignee.lastName}
              </Typography>
            </Box>
          )
        );
      })}
    </Box>

    {/* Subtask Change History */}
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
      Change History:
    </Typography>
    <Box
      sx={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stepper activeStep={-1} orientation="vertical">
        {selectedCard.subtasks[activeTab - 1]?.history?.length > 0 ? (
          selectedCard.subtasks[activeTab - 1]?.history.map((historyItem, index) => (
            <Step key={index}>
              <StepLabel>
                {historyItem.changeHistory[0]?.description || 'No description'}
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {new Date(historyItem.creationDate).toLocaleDateString('en-US')},{' '}
                  {new Date(historyItem.creationDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Typography>
              </StepContent>
            </Step>
          ))
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            No history recorded.
          </Typography>
        )}
      </Stepper>
    </Box>
  </Box>
)}


      {/* Close Button */}
      <Button
        onClick={handleCardModalClose}
        variant="contained"

        color="secondary"
        sx={{ mt: 'auto', alignSelf: 'flex-start' }}

      >
        Close
      </Button>
    </Box>

      {/* Right Pane - Chat */}
      <Box
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      {/* Header */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Quick Thread
      </Typography>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          mb: 2,
        }}
      >
       {Array.isArray(taskchat) && taskchat.length > 0 ? (
    taskchat.map((chat) => {
            const isSender = chat.sender.id === storedUserData.user.id;

            return (
              <Box
                key={chat.id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: isSender ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isSender ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  {/* Sender Name */}
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 'bold',
                      color: isSender ? '#1e88e5' : '#000', // Sender color (WhatsApp blue)
                    }}
                  >
                    {isSender ? 'You' : `${chat.sender.firstName} ${chat.sender.lastName}`}
                  </Typography>

                  {/* Message Bubble */}
                  <Box
                    sx={{
                      backgroundColor: isSender ? '#dcf8c6' : '#e4e6eb', // Green for sender, Gray for receiver
                      color: isSender ? '#000' : '#000',

                      borderRadius: '20px',
                      padding: '8px 12px',
                  

                      wordBreak: 'break-word',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography variant="body2">{chat.message}</Typography>

                    {/* Render Image */}
                    {chat.imageUrl && (
                      <img
                        src={chat.imageUrl}
                        alt="Chat Image"
                        style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }}
                      />
                    )}

                    {/* Render Attachment */}
                    {chat.attachmentUrl && (
                      <a href={chat.attachmentUrl} download>
                        <Typography variant="body2" color="primary">
                          📎 Attachment
                        </Typography>
                      </a>
                    )}

                    {/* Render Link */}
                    {chat.link && (
                      <Typography variant="body2" color="primary">
                        <Microlink url={chat.link} size="small" />
                      </Typography>
                    )}
                  </Box>

                  {/* Optionally, you can add a timestamp */}
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      color: '#888',
                      textAlign: isSender ? 'right' : 'left',
                    }}
                  >
                    {/* Add actual timestamp here */}
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ): (
          <Typography variant="body2" color="textSecondary">
            No chats available.
          </Typography>
        )}
      </Box>

      {/* Chat Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton color="primary" sx={{ ml: 1 }} component="label">
          <ImageIcon />
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </IconButton>
        <IconButton color="primary" sx={{ ml: 1 }} component="label">
          <AttachFileIcon />
          <input type="file" hidden accept=".pdf" onChange={handlePDFUpload} />
        </IconButton>
        <IconButton color="primary" sx={{ ml: 1 }} onClick={openLinkDialogHandler}>
          <InsertLinkIcon />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={handleSend}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Send'}
        </Button>
      </Box>

      {/* Dialog for Link Input */}
      <Dialog open={openLinkDialog} onClose={closeLinkDialogHandler}>
        <DialogTitle>Enter Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Link URL"
            variant="outlined"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLinkDialogHandler} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLinkSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  </Modal>
)}





    </>
  );

}
export default KanbanBoard;