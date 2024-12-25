// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   FormHelperText,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   Button,
//   Stack,
// } from "@mui/material";
// import {
//   getFunctionDepartments,
//   createDepartment,
//   deleteDepartment,
//   updateDepartment,
//   createTeam,
//   getDepartmentTeams,
// } from "src/api";

// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import { getAllCompanyUser } from "src/api";
// import { get, set } from "lodash";
// import { toast } from "react-toastify";

// export default function AddDepartment({ functionF, department, handleClose }) {
//   const [companyUsers, setCompanyUsers] = useState([]);

//   const [departmentName, setDepartmentName] = useState(department?.name || "");
//   const [head, setHead] = useState("");
//   const [teams, setTeams] = useState([]);

//   const [departmentNameIsValid, setDepartmentNameIsValid] = useState(true);
//   const [headIsValid, setHeadIsValid] = useState(true);

//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//   const isSuperAdmin = storedUserData.role === "super_admin";
//   const [teamNameIsValid, setTeamNameIsValid] = useState(true);

//   useEffect(() => {
//     getAllCompanyUser(storedUserData?.token, storedUserData?.company.id, isSuperAdmin).then(
//       (res) => {
//         console.log("COMPANY USERS", res.data);
//         setCompanyUsers(res.data.filter((user) => !user.is_function_head));
//         setHead(get(department, "Head.id", null));
//       }
//     );
//     if (department) {
//       getDepartmentTeams(storedUserData.token, department?.id).then((res) => {
//         console.log("DEPARTMENT TEAMS", res.data);
//         setTeams(res.data);
//       });
//     }
//   }, []);

//   const addNewTeamFields = () => {
//     const newTeam = {
//       name: null,
//       leadId: null,
//     };

//     setTeams((currentTeams) => [...currentTeams, newTeam]);
//   };

//   const handleDeleteTeam = (teamIndex) => {
//     const newTeams = [...teams];
//     newTeams.splice(teamIndex, 1);
//     setTeams(newTeams);
//   };

//   const handleAddDepartment = async (e) => {
//     e.preventDefault();
//     let noErrors = true;
//     if (!departmentName) {
//       setDepartmentNameIsValid(false);
//       noErrors = false;
//     } else setDepartmentNameIsValid(true);

//     if (head === null) {
//       setHeadIsValid(false);
//       noErrors = false;
//     } else setHeadIsValid(true);

//     if (!noErrors) return;
//     if (!department) {
//       const currentDepartments = await getFunctionDepartments(
//         storedUserData.token,
//         functionF.id
//       );
//       console.log("CURRENT DEPARTMENTS", currentDepartments.data);
//       const departmentExists = currentDepartments.data.some(
//         (department) => department.name === departmentName
//       );
//       if (departmentExists) {
//         toast.error("Department already exists");
//         return;
//       }

//       const response = await createDepartment(
//         {
//           name: departmentName,
//           headId: head,
//           functionId: functionF.id,
//         },
//         storedUserData.token
//       );
//       if (response.code === 200) {
//         teams.forEach(async (team) => {
//           await createTeam(
//             {
//               name: team.name,
//               leadId: team.leadId,
//               departmentId: response.data.id,
//             },
//             storedUserData.token
//           );
//         });
//         toast.success("Department added successfully");
//         handleClose();
//       } else {
//         toast.error("Failed to add department");
//       }
//     } else {
//       const response = await updateDepartment(
//         {
//           id: department.id,
//           name: departmentName,
//           headId: head,
//           functionId: functionF.id,
//         },
//         storedUserData.token
//       );
//       if (response.code === 200) {
//         toast.success("Department updated successfully");
//         handleClose();
//       } else {
//         toast.error("Failed to update department");
//       }
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" marginBlock={2}>
//         {department ? "Edit" : "Add"} Department{" "}
//         {department ? "of Function" : "to"} {functionF.name}
//       </Typography>
//       <Box
//         component={"form"}
//         autoComplete="off"
//         noValidate
//         onSubmit={handleAddDepartment}
//       >
//         <FormControl className="my-3" fullWidth>
//           <TextField
//             label="Department Name"
//             id="dept-name"
//             fullWidth
//             variant="outlined"
//             error={!departmentNameIsValid}
//             helperText={
//               departmentNameIsValid ? "" : "Enter the name of the department"
//             }
//             value={departmentName}
//             onChange={(e) => setDepartmentName(e.target.value)}
//           />
//         </FormControl>
//         <FormControl className="my-3" fullWidth error={!headIsValid}>
//           <InputLabel id="dept-head-label">Head of Department</InputLabel>
//           <Select
//             labelId="dept-head-label"
//             id="dept-head"
//             label="Head of Department"
//             fullWidth
//             value={head}
//             onChange={(e) => setHead(e.target.value)}
//           >
//             {companyUsers.map((user) => (
//               <MenuItem key={user.id} value={user.id}>
//                 {user.firstName} {user.lastName}
//               </MenuItem>
//             ))}
//           </Select>
//           <FormHelperText>
//             {headIsValid ? "" : "Select the head of the department"}
//           </FormHelperText>
//         </FormControl>
//         <FormControl className="my-3" fullWidth>
//           {teams && teams.length > 0 && (
//             <Typography variant="h5">Teams</Typography>
//           )}
//           {teams.map((team, teamIndex) => (
//             <Stack direction={"row"} gap={1} marginBlock={1} key={teamIndex}>
//               <FormControl>
//                 <TextField
//                   label="Team Name"
//                   id="team-name"
//                   variant="outlined"
//                   value={team.name}
//                   onChange={(e) => {
//                     setTeams((currentTeams) => {
//                       const newTeams = [...currentTeams];
//                       newTeams[teamIndex].name = e.target.value;
//                       return newTeams;
//                     });
//                   }}
//                 />
//               </FormControl>
//               <FormControl className="flex-grow">
//                 <InputLabel id="team-head-label">Team Lead</InputLabel>
//                 <Select
//                   labelId="team-head-label"
//                   id="team-head"
//                   label="Team Lead"
//                   value={team.leadId}
//                   onChange={(e) => {
//                     setTeams((currentTeams) => {
//                       const newTeams = [...currentTeams];
//                       newTeams[teamIndex].leadId = e.target.value;
//                       return newTeams;
//                     });
//                   }}
//                 >
//                   {companyUsers.map((user) => (
//                     <MenuItem key={user.id} value={user.id}>
//                       {user.firstName} {user.lastName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <span
//                 onClick={() => handleDeleteTeam(teamIndex)}
//                 className="h-max self-center"
//               >
//                 <DeleteOutlineIcon className="cursor-pointer hover:text-red-500 w-8 h-8" />
//               </span>
//             </Stack>
//           ))}
//           <Button variant="outlined" onClick={addNewTeamFields}>
//             Add a Team
//           </Button>
//         </FormControl>
//         <Box marginBlock={2}>
//           <Button variant="contained" color="primary" type="submit">
//             {department ? "Update" : "Add"} Department
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

//////////////////////////////////////////////////////

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   FormHelperText,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   Button,
//   Stack,
// } from "@mui/material";
// import {
//   getFunctionDepartments,
//   createDepartment,
//   deleteDepartment,
//   updateDepartment,
//   createTeam,
//   updateTeam,
//   getDepartmentTeams,
// } from "src/api";

// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import { getAllCompanyUser } from "src/api";
// import { get } from "lodash";
// import { toast } from "react-toastify";

// export default function AddDepartment({ functionF, department, handleClose }) {
//   const [companyUsers, setCompanyUsers] = useState([]);

//   const [departmentName, setDepartmentName] = useState(department?.name || "");
//   const [head, setHead] = useState("");
//   const [teams, setTeams] = useState([]);
//   const [teamNameIsValid, setTeamNameIsValid] = useState([]);
//   const [teamLeadIsValid, setTeamLeadIsValid] = useState([]);

//   const [departmentNameIsValid, setDepartmentNameIsValid] = useState(true);
//   const [headIsValid, setHeadIsValid] = useState(true);

//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//   const isSuperAdmin = storedUserData.role === "super_admin";

//   useEffect(() => {
//     getAllCompanyUser(storedUserData?.token, storedUserData?.company.id, isSuperAdmin).then(
//       (res) => {
//         console.log("COMPANY USERS", res.data);
//         setCompanyUsers(res.data.filter((user) => !user.is_function_head));
//         setHead(get(department, "Head.id", null));
//       }
//     );
//     if (department) {
//       getDepartmentTeams(storedUserData.token, department?.id).then((res) => {
//         console.log("DEPARTMENT TEAMS", res.data);
//         setTeams(res.data);
//         setTeamNameIsValid(res.data.map(() => true)); // Initialize teamNameIsValid state
//         setTeamLeadIsValid(res.data.map(() => true)); // Initialize teamLeadIsValid state
//       });
//     }
//   }, []);

//   const addNewTeamFields = () => {
//     const newTeam = {
//       name: "",
//       leadId: null,
//     };

//     setTeams((currentTeams) => [...currentTeams, newTeam]);
//     setTeamNameIsValid((currentIsValid) => [...currentIsValid, true]); // Add new validity state
//     setTeamLeadIsValid((currentIsValid) => [...currentIsValid, true]); // Add new validity state
//   };

//   const handleDeleteTeam = (teamIndex) => {
//     const newTeams = [...teams];
//     newTeams.splice(teamIndex, 1);
//     setTeams(newTeams);

//     const newTeamNameIsValid = [...teamNameIsValid];
//     newTeamNameIsValid.splice(teamIndex, 1);
//     setTeamNameIsValid(newTeamNameIsValid);

//     const newTeamLeadIsValid = [...teamLeadIsValid];
//     newTeamLeadIsValid.splice(teamIndex, 1);
//     setTeamLeadIsValid(newTeamLeadIsValid);
//   };

//   const handleAddDepartment = async (e) => {
//     e.preventDefault();
//     let noErrors = true;
//     if (!departmentName) {
//       setDepartmentNameIsValid(false);
//       noErrors = false;
//     } else setDepartmentNameIsValid(true);

//     if (head === null) {
//       setHeadIsValid(false);
//       noErrors = false;
//     } else setHeadIsValid(true);

//     const newTeamNameIsValid = teams.map((team, index) => {
//       if (!team.name) {
//         noErrors = false;
//         return false;
//       }
//       return true;
//     });

//     const newTeamLeadIsValid = teams.map((team, index) => {
//       if (!team.leadId) {
//         noErrors = false;
//         return false;
//       }
//       return true;
//     });

//     setTeamNameIsValid(newTeamNameIsValid);
//     setTeamLeadIsValid(newTeamLeadIsValid);

//     // Check for duplicate team names
//     const teamNames = teams.map((team) => team.name.toLowerCase());
//     const hasDuplicateTeamNames = new Set(teamNames).size !== teamNames.length;
//     if (hasDuplicateTeamNames) {
//       toast.error("Team names must be unique");
//       return;
//     }

//     if (!noErrors) return;

//     if (!department) {
//       const currentDepartments = await getFunctionDepartments(
//         storedUserData.token,
//         functionF.id
//       );
//       console.log("CURRENT DEPARTMENTS", currentDepartments.data);
//       const departmentExists = currentDepartments.data.some(
//         (department) => department.name === departmentName
//       );
//       if (departmentExists) {
//         toast.error("Department already exists");
//         return;
//       }

//       const response = await createDepartment(
//         {
//           name: departmentName,
//           headId: head,
//           functionId: functionF.id,
//         },
//         storedUserData.token
//       );
//       if (response.code === 200) {
//         teams.forEach(async (team) => {
//           await createTeam(
//             {
//               name: team.name,
//               leadId: team.leadId,
//               departmentId: response.data.id,
//             },
//             storedUserData.token
//           );
//         });
//         toast.success("Department added successfully");
//         handleClose();
//       } else {
//         toast.error("Failed to add department");
//       }
//     } else {
//       const response = await updateDepartment(
//         {
//           id: department.id,
//           name: departmentName,
//           headId: head,
//           functionId: functionF.id,
//         },
//         storedUserData.token
//       );
//       if (response.code === 200) {
//         //console.log("team details", teams);
//         teams.forEach(async (team) => {
//           await updateTeam(
//             {
//               id: team.id,
//               name: team.name,
//               leadId: team.leadId,
//               departmentId: response.data.id,
//             },
//             storedUserData.token
//           );
//         });
//         toast.success("Department updated successfully");
//         handleClose();
//       } else {
//         toast.error("Failed to update department");
//       }
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" marginBlock={2}>
//         {department ? "Edit" : "Add"} Department{" "}
//         {department ? "of Function" : "to"} {functionF.name}
//       </Typography>
//       <Box
//         component={"form"}
//         autoComplete="off"
//         noValidate
//         onSubmit={handleAddDepartment}
//       >
//         <FormControl className="my-3" fullWidth>
//           <TextField
//             label="Department Name"
//             id="dept-name"
//             fullWidth
//             variant="outlined"
//             error={!departmentNameIsValid}
//             helperText={
//               departmentNameIsValid ? "" : "Enter the name of the department"
//             }
//             value={departmentName}
//             onChange={(e) => setDepartmentName(e.target.value)}
//           />
//         </FormControl>
//         <FormControl className="my-3" fullWidth error={!headIsValid}>
//           <InputLabel id="dept-head-label" style={{ color: !headIsValid ? 'red' : undefined }}>Head of Department</InputLabel>
//           <Select
//             labelId="dept-head-label"
//             id="dept-head"
//             label="Head of Department"
//             fullWidth
//             value={head}
//             onChange={(e) => setHead(e.target.value)}
//             style={{ borderColor: !headIsValid ? 'red' : undefined }}
//           >
//             {companyUsers.map((user) => (
//               <MenuItem key={user.id} value={user.id}>
//                 {user.firstName} {user.lastName}
//               </MenuItem>
//             ))}
//           </Select>
//           <FormHelperText>
//             {headIsValid ? "" : "Select the head of the department"}
//           </FormHelperText>
//         </FormControl>
//         <FormControl className="my-3" fullWidth>
//           {teams && teams.length > 0 && (
//             <Typography variant="h5">Teams</Typography>
//           )}
//           {teams.map((team, teamIndex) => (
//             <Stack direction={"row"} gap={1} marginBlock={1} key={teamIndex}>
//               <FormControl error={!teamNameIsValid[teamIndex]} style={{ width: '50%' }}>
//                 <TextField
//                   error={!teamNameIsValid[teamIndex]}
//                   label="Team Name"
//                   id="team-name"
//                   variant="outlined"
//                   value={team.name}
//                   onChange={(e) => {
//                     setTeams((currentTeams) => {
//                       const newTeams = [...currentTeams];
//                       newTeams[teamIndex].name = e.target.value;
//                       return newTeams;
//                     });
//                   }}
//                   helperText={
//                     teamNameIsValid[teamIndex] ? "" : (
//                       <span style={{ color: 'red' }}>Field must not be empty</span>
//                     )
//                   }
//                   InputProps={{
//                     style: { borderColor: !teamNameIsValid[teamIndex] ? 'red' : undefined },
//                   }}
//                   InputLabelProps={{
//                     style: { color: !teamNameIsValid[teamIndex] ? 'red' : undefined },
//                   }}
//                 />
//               </FormControl>
//               <FormControl className="flex-grow" error={!teamLeadIsValid[teamIndex]} style={{ width: '50%' }}>
//                 <InputLabel id="team-head-label" style={{ color: !teamLeadIsValid[teamIndex] ? 'red' : undefined }}>Team Lead</InputLabel>
//                 <Select
//                   labelId="team-head-label"
//                   id="team-head"
//                   label="Team Lead"
//                   value={team.leadId}
//                   onChange={(e) => {
//                     setTeams((currentTeams) => {
//                       const newTeams = [...currentTeams];
//                       newTeams[teamIndex].leadId = e.target.value;
//                       return newTeams;
//                     });
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: !teamLeadIsValid[teamIndex] ? 'red' : undefined,
//                     },
//                   }}
//                 >
//                   {companyUsers.map((user) => (
//                     <MenuItem key={user.id} value={user.id}>
//                       {user.firstName} {user.lastName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 <FormHelperText>
//                   {teamLeadIsValid[teamIndex] ? "" : (
//                     <span style={{ color: 'red' }}>Field must not be empty</span>
//                   )}
//                 </FormHelperText>
//               </FormControl>
//               <span
//                 onClick={() => handleDeleteTeam(teamIndex)}
//                 className="h-max self-center"
//               >
//                 <DeleteOutlineIcon className="cursor-pointer hover:text-red-500 w-8 h-8" />
//               </span>
//             </Stack>
//           ))}
//           <Button variant="outlined" onClick={addNewTeamFields}>
//             Add a Team
//           </Button>
//         </FormControl>
//         <Box marginBlock={2}>
//           <Button variant="contained" color="primary" type="submit">
//             {department ? "Update" : "Add"} Department
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

////////////////////////////////////////////////////
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Stack,
} from "@mui/material";
import {
  getFunctionDepartments,
  createDepartment,
  updateDepartment,
  createTeam,
  updateTeam,
  getDepartmentTeams,
} from "src/api";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAllCompanyUser } from "src/api";
import { get } from "lodash";
import { toast } from "react-toastify";

export default function AddDepartment({ functionF, department, handleClose }) {
  const [companyUsers, setCompanyUsers] = useState([]);
  const [departmentName, setDepartmentName] = useState(department?.name || "");
  const [head, setHead] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamNameIsValid, setTeamNameIsValid] = useState([]);
  const [teamLeadIsValid, setTeamLeadIsValid] = useState([]);
  const [departmentNameIsValid, setDepartmentNameIsValid] = useState(true);
  const [headIsValid, setHeadIsValid] = useState(true);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const isSuperAdmin = storedUserData.role === "super_admin";

  useEffect(() => {
    getAllCompanyUser(storedUserData?.token, storedUserData?.company.id, isSuperAdmin).then(
      (res) => {
        console.log("COMPANY USERS", res.data);
        setCompanyUsers(res.data.filter((user) => !user.is_function_head));
        setHead(get(department, "Head.id", null));
      }
    );
    if (department) {
      getDepartmentTeams(storedUserData.token, department?.id).then((res) => {
        console.log("DEPARTMENT TEAMS", res.data);
        setTeams(res.data);
        setTeamNameIsValid(res.data.map(() => true));
        setTeamLeadIsValid(res.data.map(() => true));
      });
    }
  }, []);

  const addNewTeamFields = () => {
    const newTeam = {
      name: "",
      leadId: null,
    };

    setTeams((currentTeams) => [...currentTeams, newTeam]);
    setTeamNameIsValid((currentIsValid) => [...currentIsValid, true]);
    setTeamLeadIsValid((currentIsValid) => [...currentIsValid, true]);
  };

  const handleDeleteTeam = (teamIndex) => {
    const newTeams = [...teams];
    newTeams.splice(teamIndex, 1);
    setTeams(newTeams);

    const newTeamNameIsValid = [...teamNameIsValid];
    newTeamNameIsValid.splice(teamIndex, 1);
    setTeamNameIsValid(newTeamNameIsValid);

    const newTeamLeadIsValid = [...teamLeadIsValid];
    newTeamLeadIsValid.splice(teamIndex, 1);
    setTeamLeadIsValid(newTeamLeadIsValid);
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    let noErrors = true;
    if (!departmentName) {
      setDepartmentNameIsValid(false);
      noErrors = false;
    } else setDepartmentNameIsValid(true);

    if (head === null) {
      setHeadIsValid(false);
      noErrors = false;
    } else setHeadIsValid(true);

    const newTeamNameIsValid = teams.map((team) => {
      if (!team.name) {
        noErrors = false;
        return false;
      }
      return true;
    });

    const newTeamLeadIsValid = teams.map((team) => {
      if (!team.leadId) {
        noErrors = false;
        return false;
      }
      return true;
    });

    setTeamNameIsValid(newTeamNameIsValid);
    setTeamLeadIsValid(newTeamLeadIsValid);

    // Check for duplicate team names
    const teamNames = teams.map((team) => team.name.toLowerCase());
    const hasDuplicateTeamNames = new Set(teamNames).size !== teamNames.length;
    if (hasDuplicateTeamNames) {
      toast.error("Team names must be unique");
      return;
    }

    if (!noErrors) return;

    if (!department) {
      const currentDepartments = await getFunctionDepartments(
        storedUserData.token,
        functionF.id
      );
      console.log("CURRENT DEPARTMENTS", currentDepartments.data);
      const departmentExists = currentDepartments.data.some(
        (department) => department.name === departmentName
      );
      if (departmentExists) {
        toast.error("Department already exists");
        return;
      }

      const response = await createDepartment(
        {
          name: departmentName,
          headId: head,
          functionId: functionF.id,
        },
        storedUserData.token
      );
      if (response.code === 200) {
        for (const team of teams) {
          await createTeam(
            {
              name: team.name,
              leadId: team.leadId,
              departmentId: response.data.id,
            },
            storedUserData.token
          );
        }
        toast.success("Department added successfully");
        handleClose();
      } else {
        toast.error("Failed to add department");
      }
    } else {
      const response = await updateDepartment(
        {
          id: department.id,
          name: departmentName,
          headId: head,
          functionId: functionF.id,
        },
        storedUserData.token
      );
      if (response.code === 200) {
        for (const team of teams) {
          if (team.id) {
            await updateTeam(
              {
                id: team.id,
                name: team.name,
                leadId: team.leadId,
                departmentId: department.id,
              },
              storedUserData.token
            );
          } else {
            await createTeam(
              {
                name: team.name,
                leadId: team.leadId,
                departmentId: department.id,
              },
              storedUserData.token
            );
          }
        }
        toast.success("Department updated successfully");
        handleClose();
      } else {
        toast.error("Failed to update department");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" marginBlock={2}>
        {department ? "Edit" : "Add"} Department {department ? "of Function" : "to"} {functionF.name}
      </Typography>
      <Box
        component={"form"}
        autoComplete="off"
        noValidate
        onSubmit={handleAddDepartment}
      >
        <FormControl className="my-3" fullWidth>
          <TextField
            label="Department Name"
            id="dept-name"
            fullWidth
            variant="outlined"
            error={!departmentNameIsValid}
            helperText={departmentNameIsValid ? "" : "Enter the name of the department"}
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </FormControl>
        <FormControl className="my-3" fullWidth error={!headIsValid}>
          <InputLabel id="dept-head-label" style={{ color: !headIsValid ? 'red' : undefined }}>Head of Department</InputLabel>
          <Select
            labelId="dept-head-label"
            id="dept-head"
            label="Head of Department"
            fullWidth
            value={head}
            onChange={(e) => setHead(e.target.value)}
            style={{ borderColor: !headIsValid ? 'red' : undefined }}
          >
            {companyUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {headIsValid ? "" : "Select the head of the department"}
          </FormHelperText>
        </FormControl>
        <FormControl className="my-3" fullWidth>
          {teams && teams.length > 0 && (
            <Typography variant="h5">Teams</Typography>
          )}
          {teams.map((team, teamIndex) => (
            <Stack direction={"row"} gap={1} marginBlock={1} key={teamIndex}>
              <FormControl error={!teamNameIsValid[teamIndex]} style={{ width: '50%' }}>
                <TextField
                  error={!teamNameIsValid[teamIndex]}
                  label="Team Name"
                  id="team-name"
                  variant="outlined"
                  value={team.name}
                  onChange={(e) => {
                    setTeams((currentTeams) => {
                      const newTeams = [...currentTeams];
                      newTeams[teamIndex].name = e.target.value;
                      return newTeams;
                    });
                  }}
                  helperText={
                    teamNameIsValid[teamIndex] ? "" : (
                      <span style={{ color: 'red' }}>Field must not be empty</span>
                    )
                  }
                  InputProps={{
                    style: { borderColor: !teamNameIsValid[teamIndex] ? 'red' : undefined },
                  }}
                  InputLabelProps={{
                    style: { color: !teamNameIsValid[teamIndex] ? 'red' : undefined },
                  }}
                />
              </FormControl>
              <FormControl className="flex-grow" error={!teamLeadIsValid[teamIndex]} style={{ width: '50%' }}>
                <InputLabel id="team-head-label" style={{ color: !teamLeadIsValid[teamIndex] ? 'red' : undefined }}>Team Lead</InputLabel>
                <Select
                  labelId="team-head-label"
                  id="team-head"
                  label="Team Lead"
                  value={team.leadId}
                  onChange={(e) => {
                    setTeams((currentTeams) => {
                      const newTeams = [...currentTeams];
                      newTeams[teamIndex].leadId = e.target.value;
                      return newTeams;
                    });
                  }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: !teamLeadIsValid[teamIndex] ? 'red' : undefined,
                    },
                  }}
                >
                  {companyUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {teamLeadIsValid[teamIndex] ? "" : (
                    <span style={{ color: 'red' }}>Field must not be empty</span>
                  )}
                </FormHelperText>
              </FormControl>
              <span
                onClick={() => handleDeleteTeam(teamIndex)}
                className="h-max self-center"
              >
                <DeleteOutlineIcon className="cursor-pointer hover:text-red-500 w-8 h-8" />
              </span>
            </Stack>
          ))}
          <Button variant="outlined" onClick={addNewTeamFields}>
            Add a Team
          </Button>
        </FormControl>
        <Box marginBlock={2}>
          <Button variant="contained" color="primary" type="submit">
            {department ? "Update" : "Add"} Department
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
