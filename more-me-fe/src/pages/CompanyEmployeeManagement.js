import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { Grid, Button, Container, Stack, Typography,Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
// components
import Iconify from "../components/iconify";
import AddFunction from "src/components/department/AddFunction";
import AddDepartment from "src/components/department/AddDepartment";
import AddTeam from "src/components/department/AddTeam";
import TransitionsModal from "src/components/modal";


import {
  getFunctionDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
  deleteTeam,
  getCompanyFunctions,
  getDepartmentTeams,
  deleteFunction,
  UpdateCompanyUser,
  getAllCompanyUser,
  getTeamMembers,
  getCompanyFunctionsbyuserid
} from "src/api";
import { toast } from "react-toastify";
import { set } from "lodash";

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CompanyEmployeeManagementPage() {
  const [companyFunctions, setCompanyFunctions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);

  const [selectedFunction, setSelectedFunction] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [openFunctionCreateModal, setOpenFunctionCreateModal] = useState(false);
  const [openDepartmentCreateModal, setOpenDepartmentCreateModal] =
    useState(false);
  const [openTeamCreateModal, setOpenTeamCreateModal] = useState(false);

  // const { UserData } = useAuth();
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (selectedFunction !== null) {
      getFunctionDepartments(storedUserData.token, selectedFunction.id)
        .then((response) => {
          console.log("DEPARTMENTS", response);
          setDepartments(response.data);
        })
        .catch((error) => {
          toast.error("Failed to fetch departments");
        });
    }
  }, [selectedFunction, openDepartmentCreateModal]);

  useEffect(() => {
    if(storedUserData.user.role=="company-super-admin")
    {
      getCompanyFunctions(storedUserData.token, storedUserData?.company.id)
      .then((response) => {
      
        setCompanyFunctions(response.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch company functions");
      });
    }
    else if (storedUserData.user.role==="admin")
    {
      getCompanyFunctionsbyuserid(storedUserData.token, storedUserData?.user.id)
      .then((response) => {
      
        setCompanyFunctions(response.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch company functions");
      });
    }
  
  }, [openFunctionCreateModal]);

  useEffect(() => {
    if (selectedDepartment !== null) {
      getDepartmentTeams(storedUserData.token, selectedDepartment.id)
        .then((response) => {
          console.log("TEAMS", response);
          setTeams(response.data);
        })
        .catch((error) => {
          toast.error("Failed to fetch teams");
        });
    }
  }, [selectedDepartment, openTeamCreateModal])

  
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
  
  async function handleDeleteDepartment(departmentId) {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteDepartment(departmentId, storedUserData.token)
        .then((response) => {
          console.log("DEPARTMENT DELETED", response);
          console.log(
            "REMAINING",
            departments.filter((department) => department.id !== departmentId)
          );
          setDepartments((prev) =>
            prev.filter((department) => department.id !== departmentId)
          );
          setSelectedDepartment(null);
          toast.success("Department deleted successfully");
        })
        .catch((error) => {
          toast.error("Failed to delete department");
        });
    }
  }

  async function handleDeleteFunction(functionId) {
    let updatedUserId;
    if (window.confirm("Are you sure you want to delete this function?")) {
      getCompanyFunctions(storedUserData.token, storedUserData?.company.id)
      .then((response) => {
        console.log("COMPANY FUNCTIONS", response);
        const functionData = response.data.find((func) => func.id === functionId);
        if (functionData) {
          console.log("Function found:", functionData);
          // You can now use functionData for your logic
          updatedUserId = functionData.headId;
        } else {
          console.log("Function not found");
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch company functions");
      });
      deleteFunction(functionId, storedUserData.token)
        .then((response) => {
          console.log("FUNCTION DELETED", response);
          setCompanyFunctions((prev) =>
            prev.filter((func) => func.id !== functionId)
          );
          setSelectedFunction(null);
          setSelectedDepartment(null);
          toast.success("Function deleted successfully");
          
          const updatedUserData = {
            id: updatedUserId,
            is_function_head : false
            // Add any other fields you want to update here
          };
          UpdateCompanyUser(
            updatedUserData,
            storedUserData.token,
            storedUserData?.user?.role === "super-admin"
          );
        })
        .catch((error) => {
          toast.error("Failed to delete function");
        });
    }
  }

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
        <title> Company Employee Management | More.Me </title>
      </Helmet>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div>
            <Grid container direction={"column"} spacing={2}>
              <Grid item>
                <Item>
                  <Stack spacing={2} paddingInline={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" align="left">
                        Functions
                      </Typography>
                      {
                        storedUserData.user.role=="company-super-admin" &&
                        <TransitionsModal
                        open={openFunctionCreateModal}
                        variant="outlined"
                        handleClose={() => setOpenFunctionCreateModal(false)}
                        handleOpen={() => {
                          setOpenFunctionCreateModal(true);
                          setSelectedFunction(null);
                        }}
                        title={"Create New Function"}
                        component={
                          <AddFunction
                            functionF={selectedFunction}
                            handleClose={() =>
                              setOpenFunctionCreateModal(false)
                            }
                          />
                        }
                      />
                      }
                     
                    </Stack>
                    <Stack spacing={2}>
                      {companyFunctions &&
                        companyFunctions.map((functionF) => (
                          <Stack
                            key={functionF.id}
                            direction={"row"}
                            justifyContent="space-between"
                            alignItems={"center"}
                            className={`px-4 rounded-md cursor-default text-lg font-semibold
                                  ${
                                    selectedFunction?.id === functionF.id
                                      ? "bg-emerald-200 hover:bg-emerald-200"
                                      : "bg-gray-100 hover:bg-emerald-100"
                                  }
                                `}
                            onClick={() => {
                              setSelectedFunction(functionF);
                              setSelectedDepartment(null);
                              setSelectedTeam(null);

                              setTeams([]);
                            }}
                          >
                            <div className="text-left">
                              <Typography variant="h5" marginBlock={1}>
                                {functionF.name}
                              </Typography>
                              {functionF.Head && (
                                <Typography
                                  variant="subtitle1"
                                  marginBlockEnd={1}
                                >
                                  <span>Head: </span>
                                  {functionF.Head?.firstName}{" "}
                                  {functionF.Head?.lastName}
                                </Typography>
                              )}
                            </div>

                          {storedUserData.user.role!="admin" &&  <Stack direction="row" spacing={2}>
                              <span
                                onClick={() => {
                                  setSelectedFunction(functionF);
                                  setOpenFunctionCreateModal(true);
                                }}
                              >
                                <EditIcon  className="cursor-pointer hover:text-lime-500" />
                              </span>
                              <span
                                onClick={() =>
                                  handleDeleteFunction(functionF.id)
                                }
                              >
                                <DeleteOutlineIcon className="cursor-pointer hover:text-red-500 text-xl" />
                              </span>
                            </Stack>}
                          
                          </Stack>
                        ))}
                    </Stack>
                  </Stack>
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  <Stack spacing={2} paddingInline={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" align="left">
                        Departments
                      </Typography>
                      <TransitionsModal
                        open={openDepartmentCreateModal}
                        handleClose={() => setOpenDepartmentCreateModal(false)}
                        handleOpen={() => {
                          setOpenDepartmentCreateModal(true);
                          setSelectedDepartment(null);
                        }}
                        title={"Create New Department"}
                        component={
                          <AddDepartment
                            functionF={selectedFunction}
                            department={selectedDepartment}
                            handleClose={() =>
                              setOpenDepartmentCreateModal(false)
                            }
                          />
                        }
                        disabled={selectedFunction === null}
                      />
                    </Stack>
                    <Stack spacing={2}>
                      {selectedFunction === null && (
                        <Typography
                          variant="caption"
                          align="center"
                          paddingBlock={8}
                        >
                          Select a function to view its departments
                        </Typography>
                      )}
                      {selectedFunction !== null &&
                        departments?.length === 0 && (
                          <Typography
                            variant="caption"
                            align="center"
                            paddingBlock={8}
                          >
                            There are no departments under this function
                          </Typography>
                        )}
                      {selectedFunction !== null &&
                        departments &&
                        departments.map((department) => (
                          <Stack
                            key={department.id}
                            direction={"row"}
                            justifyContent="space-between"
                            alignItems={"center"}
                            className={`px-4 rounded-md
                                  cursor-default text-lg font-semibold 
                                  ${
                                    selectedDepartment?.id === department.id
                                      ? "bg-cyan-100 hover:bg-cyan-100"
                                      : "bg-gray-100 hover:bg-cyan-50"
                                  }
                                `}
                            onClick={() => {setSelectedDepartment(department)
                              setSelectedTeam(null);
                            }}
                          >
                            <div className="text-left">
                              <Typography variant="h5" marginBlock={1}>
                                {department.name}
                              </Typography>
                              {department.Head && (
                                <Typography
                                  variant="subtitle1"
                                  marginBlockEnd={1}
                                >
                                  <span>Head: </span>
                                  {department.Head?.firstName}{" "}
                                  {department.Head?.lastName}
                                </Typography>
                              )}
                            </div>
                            <Stack direction="row" spacing={2}>
                              <span
                                onClick={() => {
                                  setSelectedDepartment(department);
                                  setOpenDepartmentCreateModal(true);
                                }}
                              >
                                <EditIcon className="cursor-pointer hover:text-lime-500" />
                              </span>
                              <span
                                onClick={() =>
                                  handleDeleteDepartment(department.id)
                                }
                              >
                                <DeleteOutlineIcon className="cursor-pointer hover:text-red-500" />
                              </span>
                            </Stack>
                          </Stack>
                        ))}
                    </Stack>
                  </Stack>
                </Item>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={6}>
          <Item>
            <Stack spacing={2} paddingInline={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" align="left">
                  Teams{" "}
                  {selectedDepartment?.name && `in ${selectedDepartment?.name}`}
                </Typography>
                <TransitionsModal
                  open={openTeamCreateModal}
                  handleClose={() => setOpenTeamCreateModal(false)}
                  handleOpen={() => {
                    setSelectedTeam(null);
                    setOpenTeamCreateModal(true);
                  }}
                  title={"Create New Team"}
                  component={
                    <AddTeam
                      department={selectedDepartment}
                      team={selectedTeam}
                      handleClose={() => setOpenTeamCreateModal(false)}
                    />
                  }
                  disabled={selectedDepartment === null}
                />
              </Stack>
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
              <Stack spacing={2}>
                {selectedDepartment === null && (
                  <Typography variant="caption" align="center" paddingBlock={8}>
                    Select a department to view its teams
                  </Typography>
                )}
                {selectedDepartment !== null && teams?.length === 0 && (
                  <Typography variant="caption" align="center" paddingBlock={8}>
                    There are no teams under this department
                  </Typography>
                )}
                {selectedDepartment !== null &&
                  teams &&
                  teams.map((team) => (
                    <Stack
                      key={team.id}
                      direction={"row"}
                      justifyContent="space-between"
                      alignItems={"center"}
                      className={`px-4 bg-gray-100 rounded-md
                                  cursor-default text-lg font-semibold hover:bg-gray-200
                                `}
                                onClick={() => setSelectedTeam(team)}
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
                          onClick={() => {
                            setSelectedTeam(team);
                            setOpenTeamCreateModal(true);
                          }}
                        >
                          <EditIcon className="cursor-pointer hover:text-lime-500" />
                        </span>
                        <span
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <DeleteOutlineIcon className="cursor-pointer hover:text-red-500" />
                        </span>
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
