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
  deleteDepartment,
  updateDepartment,
  UpdateUser,
  createTeam,
  updateTeam,
  getTeamMembers,
  getDepartmentTeams
} from "src/api";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import { getAllCompanyUser } from "src/api";
import { get, set } from "lodash";
import { toast } from "react-toastify";

export default function AddTeam({ department, team, handleClose }) {
  const [companyUsers, setCompanyUsers] = useState([]);

  const [teamName, setTeamName] = useState(team?.name || "");
  const [lead, setLead] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  const [teamNameIsValid, setTeamNameIsValid] = useState(true);
  const [leadIsValid, setLeadIsValid] = useState(true);

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const isSuperAdmin = storedUserData.role === "super_admin";

  useEffect(() => {
    getAllCompanyUser(
      storedUserData?.token,
      storedUserData?.company.id,
      isSuperAdmin
    ).then((res) => {
      console.log("COMPANY USERS", res.data);
      setCompanyUsers(
        res.data.filter((user) => !user.is_function_head)
      );
      console.log(
        "COMPANY USERS NON FUNCTION HEADS",
        res.data.filter((user) => !user.is_function_head)
      );
      setLead(get(team, "Lead.id", null));
      if (team) {
        setTeamMembers(res.data.filter((user) => user.teamId === team.id));
      }
    });
    if (team) {
      getTeamMembers(storedUserData.token, team.id).then((res) => {
        console.log("TEAM MEMBERS", res.data);
        setTeamMembers(
          res.data.map((member) => ({
            firstName: member.firstName,
            lastName: member.lastName,
            id: member.id,
          }))
        );
      });
    }
  }, []);

  const addNewMemberFields = () => {
    const newTeam = {
      firstName: "",
      lastName: "",
      id: null,
    };

    setTeamMembers((currentTeamMembers) => [...currentTeamMembers, newTeam]);
  };

  const handleDeleteTeamMember = (teamMemberIndex) => {
    const newTeams = [...teamMembers];
    newTeams.splice(teamMemberIndex, 1);
    setTeamMembers(newTeams);
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    let noErrors = true;
    if (!teamName) {
      setTeamNameIsValid(false);
      noErrors = false;
    } else setTeamNameIsValid(true);

    if (lead === null) {
      setLeadIsValid(false);
      noErrors = false;
    } else setLeadIsValid(true);

    if (!noErrors) return;
    if (!team) {
      const currentTeams = await getDepartmentTeams(
        storedUserData.token,
        department?.id
      );
      console.log("CURRENT TEAMS", currentTeams.data);
      const teamExists = currentTeams.data.some(
        (team) => team.name === teamName
      );
      if (teamExists) {
        toast.error("Team already exists");
        return;
      }

      const response = await createTeam(
        {
          name: teamName,
          leadId: lead,
          departmentId: department?.id,
        },
        storedUserData.token
      );

      if (response.code === 200) {
        teamMembers.forEach(async (teamMember) => {
          await UpdateUser({ id: teamMember.id, teamId: response.data.id });
        });
        toast.success("Members added successfully");
        handleClose();
      } else {
        toast.error("Failed to add members to the team.");
      }
    } else {
      const response = await updateTeam(
        {
          id: team.id,
          name: teamName,
          leadId: lead,
          departmentId: department?.id,
        },
        storedUserData.token
      );
      if (response.code === 200) {
        toast.success("Team updated successfully");
        handleClose();
      } else {
        toast.error("Failed to update team");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" marginBlock={2}>
        {team ? "Edit" : "Add a new"} Team {team ? "" : "to"} {department.name}
      </Typography>
      <Box
        component={"form"}
        autoComplete="off"
        noValidate
        onSubmit={handleAddTeam}
      >
        <Stack direction={"row"} gap={1} marginBlock={1}>
          <FormControl className="my-3 flex-grow">
            <TextField
              label="Team Name"
              id="team-name"
              fullWidth
              variant="outlined"
              error={!teamNameIsValid}
              helperText={teamNameIsValid ? "" : "Enter the name of the team"}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </FormControl>
          <FormControl className="my-3 flex-grow" error={!leadIsValid}>
            <InputLabel id="dept-lead-label">Team Lead</InputLabel>
            <Select
              labelId="team-lead-label"
              id="team-lead"
              label="Team Lead"
              fullWidth
              value={lead ?? ""}
              onChange={(e) => setLead(e.target.value)}
            >
              {companyUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {leadIsValid ? "" : "Select the lead of the team"}
            </FormHelperText>
          </FormControl>
        </Stack>
        <FormControl className="my-3" fullWidth>
          {teamMembers && teamMembers.length > 0 && (
            <Typography variant="h5">Members</Typography>
          )}
          {teamMembers.map((teamMember, teamMemberIndex) => (
            <Stack
              direction={"row"}
              gap={1}
              marginBlock={1}
              key={teamMemberIndex}
            >
              <FormControl className="flex-grow">
                <InputLabel id="team-member-label">Select Member</InputLabel>
                <Select
                  labelId="team-member-label"
                  id="team-member"
                  label="Team Member"
                  value={teamMember.id ?? ""}
                  onChange={(e) => {
                    setTeamMembers((currentTeamMembers) => {
                      const newTeamMembers = [...currentTeamMembers];
                      newTeamMembers[teamMemberIndex].id = e.target.value;
                      return newTeamMembers;
                    });
                  }}
                >
                  {companyUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id} selected={teamMember.id === user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <span
                onClick={() => handleDeleteTeamMember(teamMemberIndex)}
                className="h-max self-center"
              >
                <ClearIcon className="cursor-pointer hover:text-red-500 w-8 h-8" />
              </span>
            </Stack>
          ))}
          <Button variant="outlined" onClick={addNewMemberFields}>
            Add a Member
          </Button>
        </FormControl>
        <Box marginBlock={2}>
          <Button variant="contained" color="primary" type="submit">
            {team ? "Update" : "Add"} Team
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
