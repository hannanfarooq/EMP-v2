import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField,ListItemText, Table, TableBody, TableCell,Typography, TableContainer,Avatar, TableHead,Checkbox, TableRow, Paper, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { keyframes } from '@mui/system';
import { CreateProject, getAllCompanyUser,getAlldepartmentuser,getProjectsBTeamid,getProjectsByDepartmentId, getProjectsByFunctionHead, getTeamuser, getUsersByFunctionStructure } from 'src/api';
const vibration = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
`;

const ProjectTable = () => {
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [projectLead,setProjectLead]= useState('');
    const [projectAdministrator,setProjectAdministrator]=useState("");
    const [projectTeam,setProjectTeam]=useState([]);
   const [users,setUsers]=useState([]);
   const [openteam, setOpenteam] = useState(false);
   const [selectedTeam, setSelectedTeam] = useState([]);
    const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const today = new Date();
    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));


     const fetchCompanyUser = async () => {
        const companyData = await getAllCompanyUser(
          storedUserData.token,
          storedUserData.company.id
        );
        const filteredData = companyData.data.filter(
          (user) => user.id !== storedUserData.user.id
        );
        setUsers(filteredData);
      };


 const fetchFunctionUser = async () => {
    const companyData = await getUsersByFunctionStructure(
      storedUserData.token,
      storedUserData.user.id
    );
    console.log("compan data b date:", companyData);

    const sortedData = companyData.data
      ?.filter((user) => user.id !== storedUserData.user.id && user.role != "company-super-admin") // Filter out the logged-in user
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        //return dateA - dateB; // For ascending order
        return dateB - dateA; // For descending order
      });
    // Log the sorted data
    console.log("Sorted Data:", sortedData);
    setUsers(sortedData);
   
  };
   const fetchDepartmentUser = async () => {
      const companyData = await getAlldepartmentuser(
        storedUserData.token,
        storedUserData.user.departmentId
      );
      console.log("compan data b date:", companyData);
  
      const sortedData = companyData.data
        ?.filter((user) => user.id !== storedUserData.user.id) // Filter out the logged-in user
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          //return dateA - dateB; // For ascending order
          return dateB - dateA; // For descending order
        });
      // Log the sorted data
      console.log("Sorted Data:", sortedData);
      setUsers(sortedData);
    };
 const fetchTeamUser = async () => {
    const companyData = await getTeamuser(
      storedUserData.token,
      storedUserData.user.teamid
    );
    console.log("-----------------TEAM", companyData);

    const sortedData = companyData.data
      ?.filter((user) => user.id !== storedUserData.user.id) // Filter out the logged-in user
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        //return dateA - dateB; // For ascending order
        return dateB - dateA; // For descending order
      });
    // Log the sorted data
    console.log("Sorted Data:", sortedData);
    setUsers(sortedData);
  };

    useEffect(() => {
       
      if(storedUserData.user.role=="company-super-admin")
        {
          
          fetchCompanyUser();
        } 

        if(storedUserData.user.role=="admin")
        {
          fetchFunctionUser();
          
          getProjectsByFunctionHead(storedUserData.token,storedUserData.user.id).then((response) => {
            console.log("PROJECTS",response);
            if(response)
            {

              setProjects(response);
            }
          })
          .catch((error) => {
              toast.error("Failed to fetch teams");
          });
        }
else if(storedUserData.user.role=="manager")
{
  fetchDepartmentUser();
  getProjectsByDepartmentId(storedUserData.token,storedUserData.user.departmentId).then((response) => {
      console.log("PROJECTS",response);
      if(response)
      {

        setProjects(response);
      }
    })
    .catch((error) => {
        toast.error("Failed to fetch teams");
    });
}
else if (storedUserData.user.role=="lead")
{
  fetchTeamUser();  
  getProjectsBTeamid(storedUserData.token,storedUserData.user.teamid).then((response) => {
    console.log("PROJECTS",response);
    if(response)
    {

      setProjects(response);
    }
  })
  .catch((error) => {
      toast.error("Failed to fetch teams");
  });
}
    }, []);

    // Open Modal
    const handleOpen = () => setOpen(true);

    // Close Modal
    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleOpenModal = (team) => {
        setSelectedTeam(team);
        setOpenteam(true);
      };
    
      const handleCloseModal = () => {
        setOpenteam(false);
        setSelectedTeam([]);
      };
    // Reset form fields
    const resetForm = () => {
        setName('');
        setDescription('');
      setProjectLead("");
        setProjectAdministrator("");
        setProjectTeam([]);
        setStartDate(null);
        setEndDate(null);
    };

    // Handle project creation
    const handleCreateProject = async () => {
        if (!name || !description  ||!startDate||!endDate ||!projectLead ||!projectAdministrator ||projectTeam.length <=0 ) {
            toast.error("Please fill out all fields.");
            return;
        }

        const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        if (startDate < today) {
            toast.error("Start date cannot be in the past.");
            return;
        }
    
        if (endDate < startDate) {
            toast.error("End date cannot be before the start date.");
            return;
        }
        let res;
      if(storedUserData.user.role=="admin")
      {
   res = await CreateProject(storedUserData.token,name,description,storedUserData.user.departmentId,startDate,endDate,projectLead,projectAdministrator,projectTeam,storedUserData.user.id,null,storedUserData.company.id);

      }
      else if(storedUserData.user.role=="manager")
      {

         res = await CreateProject(storedUserData.token,name,description,storedUserData.user.departmentId,startDate,endDate,projectLead,projectAdministrator,projectTeam,null,null,storedUserData.company.id);
      }
      else 
      {
        res = await CreateProject(storedUserData.token,name,description,storedUserData.user.departmentId,startDate,endDate,projectLead,projectAdministrator,projectTeam,null,storedUserData.user.teamid,storedUserData.company.id);

      }
if(res)
{
    toast.success("Project created successfully!");
    if(storedUserData.user.role=="admin")
      {
        fetchFunctionUser();
        
        getProjectsByFunctionHead(storedUserData.token,storedUserData.user.id).then((response) => {
          console.log("PROJECTS",response);
            setProjects(response);
        })
        .catch((error) => {
            toast.error("Failed to fetch teams");
        });
      }
else if(storedUserData.user.role=="manager")
{
fetchDepartmentUser();
getProjectsByDepartmentId(storedUserData.token,storedUserData.user.departmentId).then((response) => {
    console.log("PROJECTS",response);
      setProjects(response);
  })
  .catch((error) => {
      toast.error("Failed to fetch teams");
  });
}
else if (storedUserData.user.role=="lead")
{
fetchTeamUser();  
getProjectsBTeamid(storedUserData.token,storedUserData.user.teamid).then((response) => {
  console.log("PROJECTS",response);
    setProjects(response);
})
.catch((error) => {
    toast.error("Failed to fetch teams");
});
}
  

}
else
{
    toast.error("Project  Not created successfully!");

}
    
        // Reset form and close modal
        resetForm();
        handleClose();
    };

    return (
        <div>
            <h2>Project Management</h2>
            <Button variant="contained" color="primary" onClick={handleOpen}>Create Project</Button>

          
            <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Project Lead</TableCell>
              <TableCell>Project Administrator</TableCell>
              <TableCell>Project Team</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(projects || []).map((project, index) => (
              <TableRow key={index}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>

                {/* Project Lead */}
                <TableCell>
                  {(() => {
                    const lead = users.find((user) => user.id === project?.projectLead);
                    return lead ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={lead.profilePic} alt={lead.firstName} />
                        {lead.firstName} {lead.lastName}
                      </Box>
                    ) : (
                      'Unknown'
                    );
                  })()}
                </TableCell>

                {/* Project Administrator */}
                <TableCell>
                  {(() => {
                    const admin = users.find(
                      (user) => user.id === project?.projectAdministrator
                    );
                    return admin ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={admin.profilePic} alt={admin.firstName} />
                        {admin.firstName} {admin.lastName}
                      </Box>
                    ) : (
                      'Unknown'
                    );
                  })()}
                </TableCell>

                {/* Project Team */}
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(project.projectTeam)}
                  >
                    View Team
                  </Button>
                </TableCell>

                <TableCell>
                  {project.startDate
                    ? format(new Date(project.startDate), 'dd ,MMMM yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {project.endDate
                    ? format(new Date(project.endDate), 'dd ,MMMM yyyy')
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Project Team */}
      <Modal open={openteam} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 4,
            boxShadow: 24,
            minWidth: 400,
            maxWidth: '90vw', // Adjust width to fit the screen
            maxHeight: '90vh', // Adjust height to fit the screen
            overflowY: 'auto', // Add vertical scrolling
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Project Team
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedTeam.map((teamMemberId) => {
              const member = users.find((user) => user.id === teamMemberId);
              return member ? (
                <Box
                  key={teamMemberId}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Avatar src={member.profilePic} alt={member.firstName} />
                  {member.firstName} {member.lastName}
                </Box>
              ) : null;
            })}
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCloseModal} fullWidth>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>


            {/* Modal for creating a project */}
            <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="create-project-modal"
  aria-describedby="modal-to-create-new-project"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: 4,
      boxShadow: 24,
      minWidth: 400,
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflowY: 'auto',
      borderRadius: 2,
    }}
  >
    <h3>Create New Project</h3>

    {/* Project Name */}
    <TextField
      label="Project Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      fullWidth
      margin="normal"
    />

    {/* Description */}
    <TextField
      label="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      fullWidth
      margin="normal"
    />

        {/* Start Date */}
        <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="startDate"></InputLabel>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setErrorStartDate(false); // Reset error on valid date change
          }}
          dateFormat="dd/MM/yyyy"
          minDate={new Date(today)} // Ensure the date is not in the future
          customInput={
            <TextField
              id="startDate"
              label="Start Date"
              value={startDate ? startDate.toLocaleDateString("en-GB") : ''}
              error={errorStartDate && !startDate}
              helperText={errorStartDate && !startDate ? "Start date is required" : ""}
              sx={errorStartDate && !startDate ? { animation: `${vibration} 0.3s ease` } : {}}
              placeholder="dd/mm/yyyy"
              InputProps={{
                endAdornment: <span>📅</span>,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          }
          isClearable={false}
          placeholderText="dd/mm/yyyy"
          inline={false}
          popperModifiers={{
            preventOverflow: { enabled: true, boundariesElement: 'viewport' },
            hide: { enabled: true },
          }}
        />
      </FormControl>

      {/* End Date */}
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="endDate"></InputLabel>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            setErrorEndDate(false); // Reset error on valid date change
          }}
          dateFormat="dd/MM/yyyy"
          minDate={new Date(today)} // Ensure the date is not in the future
          customInput={
            <TextField
              id="endDate"
              label="End Date"
              value={endDate ? endDate.toLocaleDateString("en-GB") : ''}
              error={errorEndDate && !endDate}
              helperText={errorEndDate && !endDate ? "End date is required" : ""}
              sx={errorEndDate && !endDate ? { animation: `${vibration} 0.3s ease` } : {}}
              placeholder="dd/mm/yyyy"
              InputProps={{
                endAdornment: <span>📅</span>,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          }
          isClearable={false}
          placeholderText="dd/mm/yyyy"
          inline={false}
          popperModifiers={{
            preventOverflow: { enabled: true, boundariesElement: 'viewport' },
            hide: { enabled: true },
          }}
        />
      </FormControl>

    {/* Project Lead */}
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id="project-lead-label">Project Lead</InputLabel>
      <Select
        labelId="project-lead-label"
        value={projectLead}
        onChange={(e) => setProjectLead(e.target.value)}
        label="Project Lead"
      >
        {users
          .filter(
            (user) =>
              user.id !== projectAdministrator &&
              !projectTeam.includes(user.id)
          )
          .map((user, index) => (
            <MenuItem key={index} value={user.id}>
              {user.firstName + ' ' + user.lastName}
            </MenuItem>
          ))}
      </Select>
    </FormControl>

    {/* Project Administrator */}
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id="project-admin-label">Project Administrator</InputLabel>
      <Select
        labelId="project-admin-label"
        value={projectAdministrator}
        onChange={(e) => setProjectAdministrator(e.target.value)}
        label="Project Administrator"
      >
        {users
          .filter(
            (user) =>
               
              user.id !== projectLead &&
              !projectTeam.includes(user.id)
          )
          .map((user, index) => (
            <MenuItem key={index} value={user.id}>
              {user.firstName + ' ' + user.lastName}
            </MenuItem>
          ))}
      </Select>
    </FormControl>

    {/* Project Team */}
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id="project-team-label">Project Team</InputLabel>
      <Select
        labelId="project-team-label"
        multiple
        value={projectTeam}
        onChange={(e) => setProjectTeam(e.target.value)}
        renderValue={(selected) =>
          users
            .filter((user) => selected.includes(user.id))
            .map((user) => user.firstName + ' ' + user.lastName)
            .join(', ')
        }
        label="Project Team"
      >
        {users
          .filter(
            (user) =>
           (user.role != "company-super-admin")&&
              user.id !== projectLead &&
              user.id !== projectAdministrator
          )
          .map((user, index) => (
            <MenuItem key={index} value={user.id}>
              <Checkbox checked={projectTeam.includes(user.id)} />
              <ListItemText primary={user.firstName + ' ' + user.lastName} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>

    {/* Save Button */}
    <Box sx={{ marginTop: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateProject}
        fullWidth
      >
        Save Project
      </Button>
    </Box>
  </Box>
</Modal>




        </div>
    );
};

export default ProjectTable;