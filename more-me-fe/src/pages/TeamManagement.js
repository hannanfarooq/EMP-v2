import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { Grid, Stack, Typography,Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
// components
import AddTeam from "src/components/department/AddTeam";
import TransitionsModal from "src/components/modal";

import { getDepartmentTeams, deleteTeam, UpdateCompanyUser, getDepartmentTeamsbyLead, getTeamMembers, getAllCompanyUser } from "src/api";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function TeamLeadManagementPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openTeamCreateModal, setOpenTeamCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // Added loading state
  const [teamMembers, setTeamMembers] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [companyUsers, setCompanyUsers] = useState([]);
  useEffect(() => {
    if (storedUserData && isLoading) {
      // Fetch the teams based on the logged-in user's role
      getDepartmentTeamsbyLead(storedUserData.token, storedUserData.user.teamid)
        .then((response) => {
          if (storedUserData.user.role === "lead") {
            console.log("RESPONSE : _________________________ ", response);
            // If the user is a team lead, only show their team
            const leadTeam = response.data.filter((team) => team.Lead?.id === storedUserData.user.id);
            setTeams(leadTeam);
          } else {
            // For admin and other roles, show all teams
            setTeams(response.data);
          }
          setIsLoading(false);  // Set loading to false after the request completes
        })
        .catch((error) => {
          toast.error("Failed to fetch teams");
          setIsLoading(false);  // Ensure loading is turned off even if there's an error
        });
    }
  }, [storedUserData, isLoading]);  // Only trigger effect when `storedUserData` changes and `isLoading` is true
  useEffect(() => {
    const fetchUsersAndTeamMembers = async () => {
      if (!selectedTeam) {
        setTeamMembers([]); // Clear team members if no team is selected
        return;
      }
  
      try {
        // Fetch all company users
        const companyUsersResponse = await getAllCompanyUser(
          storedUserData?.token,
          storedUserData?.company.id
        );
        console.log("COMPANY USERS", companyUsersResponse.data);
  
        const allUsers = companyUsersResponse.data;
  
        // Fetch team member IDs
        const teamMembersResponse = await getTeamMembers(
          storedUserData.token,
          selectedTeam.id
        );
        console.log("TEAM MEMBERS IDs", teamMembersResponse.data);
  
        // Filter users by IDs in teamMembersResponse.data
        if (teamMembersResponse.data) {
          const memberIds = teamMembersResponse.data; // Assuming this is an array of IDs
          const matchingMembers = allUsers.filter((user) =>
            memberIds.includes(user.id)
          );
  
          setTeamMembers(
            matchingMembers.map((member) => ({
              profilePic:member.profilePic,
              firstName: member.firstName,
              lastName: member.lastName,
              id: member.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching users or team members:", error);
        toast.error("Failed to fetch users or team members");
      }
    };
  
    fetchUsersAndTeamMembers();
  }, [selectedTeam, storedUserData?.token, storedUserData?.company?.id]);
  
  async function handleDeleteTeam(teamId) {
    if (window.confirm("Are you sure you want to delete this team?")) {
      deleteTeam(teamId, storedUserData.token)
        .then((response) => {
          console.log("TEAM DELETED", response);
          setTeams((prev) => prev.filter((team) => team.id !== teamId));
          setSelectedTeam(null);
          toast.success("Team deleted successfully");
        })
        .catch((error) => {
          toast.error("Failed to delete team");
        });
    }
  }

  return (
    <>
      <Helmet>
        <title>Company Employee Management | Hr.System</title>
      </Helmet>

      <Grid container spacing={2}>
  <Grid item xs={12}>
    <Item>
      <Stack spacing={2} paddingInline={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" align="left">
            Teams
          </Typography>
          <TransitionsModal
            open={openTeamCreateModal}
            handleClose={() => setOpenTeamCreateModal(false)}
            handleOpen={() => setOpenTeamCreateModal(true)}
            title={"Create New Team"}
            component={
              <AddTeam
                team={selectedTeam}
                handleClose={() => setOpenTeamCreateModal(false)}
              />
            }
            disabled={storedUserData.user.role === "lead"}
          />
        </Stack>
        <Stack spacing={2}>


        {selectedTeam && (
  <Grid item xs={12}>
    <Item>
      <Stack spacing={2}>
        <Typography variant="h6" align="left">
          Members of {selectedTeam.name}
        </Typography>
        {teamMembers.length === 0 ? (
          <Typography variant="caption" align="center" sx={{ padding: 4 }}>
            No members in this team
          </Typography>
        ) : (
          <Paper elevation={2} sx={{ padding: 2 }}>
            <Stack spacing={2}>
              {teamMembers.map((member) => (
                <Stack
                  key={member.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    padding: 2,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  <Avatar
                    alt={`${member.firstName} ${member.lastName}`}
                    src={member.profilePic || null} // Ensure `profilePicture` is a valid URL or use null
                    sx={{ width: 48, height: 48 }}
                  >
                    {member.firstName[0]}
                  </Avatar>
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {member.firstName} {member.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {member.role || "Team Member"}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Item>
  </Grid>
)}
          {teams?.length === 0 && (
            <Typography variant="caption" align="center" paddingBlock={8}>
              There are no teams available
            </Typography>
          )}
          {teams &&
            teams.map((team) => (
              <Stack
                key={team.id}
                direction={"row"}
                justifyContent="space-between"
                alignItems={"center"}
                className="px-4 bg-gray-100 rounded-md cursor-pointer text-lg font-semibold hover:bg-gray-200"
                onClick={() => {
                  
                  getDepartmentTeamsbyLead(storedUserData.token, storedUserData.user.teamid)
                  .then((response) => {
                    if (storedUserData.user.role === "lead") {
                      console.log("RESPONSE : _________________________ ", response);
                      // If the user is a team lead, only show their team
                      const leadTeam = response.data.filter((team) => team.Lead?.id === storedUserData.user.id);
                      setTeams(leadTeam);
                    } else {
                      // For admin and other roles, show all teams
                      setTeams(response.data);
                    }
                    setIsLoading(false);  // Set loading to false after the request completes
                  })
                  .catch((error) => {
                    toast.error("Failed to fetch teams");
                    setIsLoading(false);  // Ensure loading is turned off even if there's an error
                  });
                  setSelectedTeam(team)}}
              >
                <div className="text-left">
                  <Typography variant="h5" marginBlock={1}>
                    {team.name}
                  </Typography>
                  {team.Lead && (
                    <Typography variant="subtitle1" marginBlockEnd={1}>
                      <span>Lead: </span>
                      {team.Lead?.firstName} {team.Lead?.lastName}
                    </Typography>
                  )}
                </div>
                <Stack direction="row" spacing={2}>
                  <span
                    onClick={(e) => {
                  
                      setSelectedTeam(team);
                      setOpenTeamCreateModal(true);
                    }}
                  >
                    <EditIcon className="cursor-pointer hover:text-lime-500" />
                  </span>
                  {(storedUserData.user.role === "admin" ||
                    storedUserData.user.role === "company-super-admin" ||
                    storedUserData.user.role === "manager") && (
                    <>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTeam(team.id);
                        }}
                      >
                        <DeleteOutlineIcon className="cursor-pointer hover:text-red-500" />
                      </span>
                    </>
                  )}
                </Stack>
              </Stack>
            ))}
        </Stack>
      </Stack>
    </Item>
  </Grid>

 

</Grid>

    </>
  );
}
