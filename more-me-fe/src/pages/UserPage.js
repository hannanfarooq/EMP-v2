
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Divider,
  ListItemText,
  ListItem,
  List,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TableHead,
  Modal,
  Box,
  TextField,
  useMediaQuery,
  FormControl,
  Select,
  useTheme,
} from "@mui/material";

import DatePicker from '@mui/lab/DatePicker';
// components
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  UpdateCompanyUser,
  getAllCompanyUser,
  getAlldepartmentuser,

  getTeamMembersbyuser,
  getTeamuser,

 
  getUsersByFunctionStructure,

 
  handleDeleteCompanyUser,
} from "src/api";
import UpdateUserDataForm from "src/components/company/UpdateUserModal";
import QuestionShow from "src/components/company/QuestionShow";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AccountCircle, LocationCity, Person2, PersonPinCircle } from '@mui/icons-material';
import { format } from 'date-fns';
import { ClosedCaption } from "@mui/icons-material";
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "firstName", label: "Name", alignRight: false },
  { id: "department", label: "Department Name", alignRight: false },
  { id: "team", label: "Team Name", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "gam_points", label: "Gamification Points", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  if (!array || array.length === 0) return []; // Return an empty array if input is null/undefined or empty

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return stabilizedThis
      .map((el) => el[0])
      .filter(
        (item) =>
          item.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          item.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
  }

  return stabilizedThis.map((el) => el[0]);
}



export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [schedule, setSchedule] = useState(null); // Initialize as null

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("firstName");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userData, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [editingCardOpen, setEditingCardOpen] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, settotalpages] = useState(0);
  const [paginatedData, setprocessseddata] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([

  ]);
  const itemsPerPage = 1
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fetchCompanyUser = async () => {
    const companyData = await getAllCompanyUser(
      storedUserData.token,
      storedUserData.company.id
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
    setData(sortedData);
  };
  const fetchFunctionUser = async () => {
    const companyData = await getUsersByFunctionStructure(
      storedUserData.token,
      storedUserData.user.id
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
    setData(sortedData);
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
    setData(sortedData);
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
    setData(sortedData);
  };
  const fetchTeamMemebers = async () => {
    const companyData = await getTeamMembersbyuser(
      storedUserData.token,
      storedUserData.user.id
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
    setData(sortedData);
  };

  const groupByDate = (data) => {
    const grouped = data.reduce((acc, record) => {
      const dateKey = new Date(record.check_in_time).toLocaleDateString(); // Group by date
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      return acc;
    }, {});

    return Object.keys(grouped)
      .map(date => ({
        date,
        records: grouped[date],
        totalHours: grouped[date].reduce((total, curr) => {
          if (curr.check_in_time && curr.check_out_time) {
            const checkIn = new Date(curr.check_in_time);
            const checkOut = new Date(curr.check_out_time);
            const diff = (checkOut - checkIn) / 3600000; // Convert milliseconds to hours
            return total + diff;
          }
          return total;
        }, 0).toFixed(2)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  };




  useEffect(() => {
    (async () => {
      if (storedUserData.company) {
        if ( storedUserData.user.role === "company-super-admin" ) {

          fetchCompanyUser();
        }
        else if (storedUserData.user.role === "admin")
        {
          fetchFunctionUser();
                }
        else if (storedUserData.user.role === "manager") {
          fetchDepartmentUser();
        }
        else if (storedUserData.user.role === "lead") {
          fetchTeamUser();
        }
        else if (storedUserData.user.role === "user") {
          fetchTeamMemebers();
        }


      }
    })();
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteUser = async () => {
    const response = await handleDeleteCompanyUser(
      userData.id,
      storedUserData.token
    );
    if (response) {
      setUserData({});
      handleCloseMenu();
      fetchCompanyUser();
    }
  };

  const handleSelectAllClick = (event) => {
    if (!data) {
      setSelected([]);
      return;
    }
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.firstName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const generateDateOptions = () => {
    const dates = [];
    let today = new Date();
    for (let i = 0; i < 30; i++) {
      dates.push(new Date(today));
      today.setDate(today.getDate() - 1);
    }
    return dates;
  };
  const [selectedDate, setSelectedDate] = useState(new Date()); // Defaults to today
  const [dateOptions, setDateOptions] = useState(generateDateOptions());
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // const filteredUsers = applySortFilter(
  //   data,
  //   getComparator(order, orderBy),
  //   filterName
  // );
  // Sorting logic
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  // Apply sorting and filtering
  function applySortFilter(array, comparator, query) {
    if (!array || array.length === 0) return []; // Return an empty array if input is null/undefined or empty

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    if (query) {
      return stabilizedThis
        .map((el) => el[0])
        .filter(
          (item) =>
            item.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            item.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }

    return stabilizedThis.map((el) => el[0]);
  }


  // Example Usage
  const filteredUsers = applySortFilter(
    data,
    getComparator('desc', 'createdAt'), // Descending order by 'createdAt'
    filterName // Optional search filter
  );

  console.log(filteredUsers);
  console.log("filteredUsers", filteredUsers);

 
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    setprocessseddata(attendanceData.slice(currentPage, currentPage + itemsPerPage));
  };
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    setprocessseddata(attendanceData.slice(currentPage, currentPage + itemsPerPage));
  };


  const getDayData = () => {
    // Normalize selected date to remove time information
    const normalizedSelectedDate = selectedDate.setHours(0, 0, 0, 0);

    // Filter attendance records for the selected date
    const records = attendanceData.filter((record) => {
      const recordDate = new Date(record.check_in_time).setHours(0, 0, 0, 0);
      return recordDate === normalizedSelectedDate;
    });

    // Check if the user is on leave for the selected date
    const userLeaveRequests = leaveRequests.filter(
      (request) =>
        request.user_id == userData.id &&
        request.approval_status.toLowerCase() === "approved"
    );

    const isOnLeave = userLeaveRequests.some((leave) => {
      const startDate = new Date(leave.start_date).setHours(0, 0, 0, 0);
      const endDate = new Date(leave.end_date).setHours(0, 0, 0, 0);
      return normalizedSelectedDate >= startDate && normalizedSelectedDate <= endDate;
    });

    // If the user is on leave
    if (isOnLeave) {
      return {
        records: [],
        totalWorkedHours: 0,
        scheduledWorkHours: 0,
        overtime: 0,
        arrivalStatus: "On Leave",
        departureStatus: "On Leave",
      };
    }

    // If there are no attendance records and the user is not on leave
    if (records.length === 0) {
      return {
        records: [],
        totalWorkedHours: 0,
        scheduledWorkHours: 0,
        overtime: 0,
        arrivalStatus: "Absent",
        departureStatus: "Absent",
      };
    }

    // Calculate total worked hours
    let totalWorkedHours = records.reduce((total, curr) => {
      if (curr.check_out_time) {
        const checkIn = new Date(curr.check_in_time);
        const checkOut = new Date(curr.check_out_time);
        return total + (checkOut - checkIn) / (1000 * 60 * 60); // Convert milliseconds to hours
      }
      return total;
    }, 0);

    // Get the scheduled work hours from the global schedule
    const workStart = new Date(schedule?.workStartTime); // Start of workday
    const workEnd = new Date(schedule?.workEndTime); // End of workday
    const scheduledWorkHours = (workEnd - workStart) / (1000 * 60 * 60); // Convert milliseconds to hours

    // Calculate overtime (if any)
    const overtime = Math.max(totalWorkedHours - scheduledWorkHours, 0);
    totalWorkedHours = Math.min(totalWorkedHours, scheduledWorkHours);

    // Get arrival and departure status
    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];

    const arrivalStatus = firstRecord
      ? new Date(firstRecord.check_in_time) <= workStart
        ? "ON_TIME"
        : "LATE"
      : "No Arrival";

    const departureStatus =
      lastRecord && lastRecord.check_out_time
        ? new Date(lastRecord.check_out_time) >= workEnd
          ? "ON_TIME"
          : "EARLY"
        : "No Departure";

    return {
      records,
      totalWorkedHours,
      scheduledWorkHours,
      overtime,
      arrivalStatus,
      departureStatus,
    };
  };




  const isNotFound = !filteredUsers.length && !!filterName;
  function calculateWorkHours(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 'N/A'; // Return 'N/A' if either time is missing

    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const milliseconds = checkOutTime - checkInTime;
    const hours = milliseconds / 3600000; // Convert milliseconds to hours

    return `${hours.toFixed(2)} hrs`; // Format the hours to two decimal places
  }


  const escapeCSV = (str) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`; // Escape double quotes and wrap the string in double quotes
    }
    return str;
  };

  const generateSummaryCSV = () => {
    const rows = [["Date", "Total Work Hours"]];
    let grandTotalHours = 0;

    // Group attendance data by date and sum the total hours per date
    const summaryData = attendanceData.reduce((acc, record) => {
      const date = format(new Date(record.check_in_time), 'dd-MMM-yyyy');
      if (record.check_out_time) { // Check if checkout time is provided
        const checkIn = new Date(record.check_in_time);
        const checkOut = new Date(record.check_out_time);
        const hours = (checkOut - checkIn) / 3600000;
        if (!acc[date]) acc[date] = 0;
        acc[date] += hours;
      }
      return acc;
    }, {});

    // Convert summary data to rows
    for (const [date, hours] of Object.entries(summaryData)) {
      rows.push([date, hours.toFixed(2)]);
      grandTotalHours += hours;
    }

    // Add total hours row at the end
    rows.push(["Total", grandTotalHours.toFixed(2)]);

    // Convert rows to CSV format, escaping necessary fields
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(escapeCSV).join(",")).join("\n");
    return encodeURI(csvContent);
  };



  // Generate CSV for detailed report
  const generateDetailedCSV = () => {
    const rows = [["Date", "Check In", "Check Out", "Duration (hrs)", "Check In Address", "Check Out Address"]];
    let grandTotalDuration = 0;

    attendanceData.forEach((record) => {
      const date = format(new Date(record.check_in_time), 'dd-MMM-yyyy');
      const checkIn = format(new Date(record.check_in_time), 'HH:mm'); // 24-hour format
      let checkOut = 'Still working';
      let checkOutAddress = 'No checkout address'; // Default text if check out address is empty
      let duration = 0;

      if (record.check_out_time) { // Check if checkout time is provided
        checkOut = format(new Date(record.check_out_time), 'HH:mm'); // 24-hour format
        duration = ((new Date(record.check_out_time) - new Date(record.check_in_time)) / 3600000).toFixed(2);
        grandTotalDuration += parseFloat(duration);
        checkOutAddress = record.check_out_address ? escapeCSV(record.check_out_address) : 'No checkout address'; // Escape CSV for addresses
      }

      rows.push([
        date,
        checkIn,
        checkOut,
        duration ? duration : 'Still working',
        escapeCSV(record.check_in_address), // Escape CSV for addresses
        checkOutAddress
      ]);
    });

    // Add total duration row at the end
    rows.push(["Total", "", "", grandTotalDuration.toFixed(2), "", ""]);

    // Convert rows to CSV format, escaping necessary fields
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(escapeCSV).join(",")).join("\n");
    return encodeURI(csvContent);
  };


  return (
    <>
      <Helmet>
        <title> User | Hr.System </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              padding="10px"
              sx={{
                background: "#2065D1", // Gradient background
                borderRadius: "12px",
                color: "white",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "330px",
                margin: "auto",
              }}
            >
              <Person2 sx={{ fontSize: "30px", color: "inherit" }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "1.0px",
                  color: "inherit",
                  textAlign: "center",
                }}
              >
                {storedUserData.user.role == "user" ? "TEAM MEMBERS" : "COMPANY USERS"}

              </Typography>
            </Box>

          </Stack>
        </Stack>


        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
        

        </Stack>
        <Card>
          {storedUserData.user.role != "user" ? (<UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />) : (<></>)}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {/* Table Head */}
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data?.length || 0} // Safeguard for empty data
                  numSelected={selected?.length || 0} // Safeguard for selection count
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                {/* Table Body */}
                <TableBody>
                  {filteredUsers?.length > 0 ? (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          id,
                          firstName,
                          lastName,
                          role,
                          teams,
                          departments,
                          isVerified = true,
                          points,
                          profilePic,
                        } = row;
                        const selectedUser = selected.indexOf(firstName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedUser}
                          >
                            {/* Checkbox for selection */}
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedUser}
                                onChange={(event) => handleClick(event, firstName)}
                              />
                            </TableCell>

                            {/* User Name */}
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={firstName} src={profilePic || null} />
                                <Typography variant="subtitle2" noWrap>
                                  {firstName} {lastName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            {/* Department Name */}
                            <TableCell align="left">
                              {/* {departments.length > 0 ? departments : "N/A"} */}
                              {departments.length > 0 && departments[0] !== "None" ? departments : "N/A"}

                            </TableCell>

                            {/* Team Name */}
                            <TableCell align="left">
                              {/* {teams?.length > 0 ? teams : "N/A"} */}
                              {teams.length > 0 && teams[0] !== "None" ? teams : "N/A"}
                            </TableCell>

                            {/* Role */}
                            <TableCell align="left">{role=="admin"?"Function Head":role}</TableCell>

                            {/* Status */}
                            <TableCell align="left">
                              <Label color={"success"}>
                                {sentenceCase("active")}
                              </Label>
                            </TableCell>

                            {/* Gamification Points */}
                            <TableCell align="left">{points}</TableCell>

                            {/* Action Button */}
                            {storedUserData.user.role != "user" && <TableCell align="right">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={(event) => {
                                  setUserData(row);
                                  handleOpenMenu(event);
                                }}
                              >
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </TableCell>}
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="subtitle1">No users found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                {/* If No Results */}
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Modal
            open={editingCardOpen}
            onClose={() => setEditingCardOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                p: 4,
                minWidth: 400,
              }}
            >
              <UpdateUserDataForm
                onClose={fetchCompanyUser}
                userData={userData}
                setEditingCardOpen={setEditingCardOpen}
              />
            </Box>
          </Modal>
          <Modal open={showQuestion} onClose={() => setShowQuestion(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                p: 4,
                minWidth: 400,
              }}
            >
              <QuestionShow
                onClose={fetchCompanyUser}
                userData={userData}
                setEditingCardOpen={setShowQuestion}
              />
            </Box>
          </Modal>

          <Modal
            open={attendanceModalOpen}
            onClose={() => setAttendanceModalOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflowY: "auto",
                maxHeight: "90vh",
              }}
            >
              <Typography variant="h6" component="h2">
                Attendance for {userData?.firstName} {userData?.lastName}
              </Typography>

              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <Select
                  value={selectedDate.toISOString().substring(0, 10)}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                >
                  {dateOptions.map((date, index) => (
                    <MenuItem key={index} value={date.toISOString().substring(0, 10)}>
                      {format(date, "MM/dd/yyyy")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Arrival and Departure Status */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Arrival Status: <strong>{getDayData().arrivalStatus}</strong>
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Departure Status: <strong>{getDayData().departureStatus}</strong>
              </Typography>

              {getDayData().arrivalStatus === "On Leave" ? (
                <Typography variant="h6" sx={{ color: "error.main", mt: 2 }}>
                  User is on leave for the selected day.
                </Typography>
              ) : (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                    Total Work: {getDayData().totalWorkedHours.toFixed(2)} hrs
                  </Typography>
                  {getDayData().overtime > 0 && (
                    <Typography variant="subtitle2" sx={{ mb: 2, color: "error.main" }}>
                      Overtime: {getDayData().overtime.toFixed(2)} hrs
                    </Typography>
                  )}
                </>
              )}

              {/* Check-in/Check-out Records */}
              {getDayData().records.length > 0 ? (
                <Paper elevation={2} sx={{ p: 2, bgcolor: "grey.100" }}>
                  <List dense>
                    {getDayData().records.map((record, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText
                          primary={
                            <>
                              <AccessTimeIcon
                                sx={{ mr: 0.5, verticalAlign: "bottom" }}
                              />
                              {format(new Date(record.check_in_time), "HH:mm")} -
                              {record.check_out_time
                                ? format(new Date(record.check_out_time), "HH:mm")
                                : "Not checked out"}
                            </>
                          }
                          secondary={
                            <>
                              <div>
                                <LocationCity
                                  sx={{ verticalAlign: "bottom", mr: 0.5 }}
                                />
                                <strong>Check-in Address:</strong>{" "}
                                {record.check_in_address}
                              </div>
                              <div>
                                <LocationCity
                                  sx={{ verticalAlign: "bottom", mr: 0.5 }}
                                />
                                <strong>Check-out Address:</strong>{" "}
                                {record.check_out_address || "No checkout address"}
                              </div>
                              <div>
                                {record.check_out_time
                                  ? `Duration: ${(
                                    (new Date(record.check_out_time) -
                                      new Date(record.check_in_time)) /
                                    3600000
                                  ).toFixed(2)} hrs`
                                  : "Still working"}
                              </div>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  No check-in/check-out on this day. Work hours: 0
                </Typography>
              )}

              {/* Button Group */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => {
                    const csvContent = generateSummaryCSV();
                    const link = document.createElement("a");
                    link.setAttribute("href", csvContent);
                    link.setAttribute(
                      "download",
                      `${userData?.firstName || "user"}_summary_report.csv`
                    );
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  sx={{ fontWeight: "bold", flex: 1, mr: 1 }}
                >
                  Download Summary
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => {
                    const csvContent = generateDetailedCSV();
                    const link = document.createElement("a");
                    link.setAttribute("href", csvContent);
                    link.setAttribute(
                      "download",
                      `${userData?.firstName || "user"}_detailed_report.csv`
                    );
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  sx={{ fontWeight: "bold", flex: 1, ml: 1 }}
                >
                  Download Details
                </Button>
              </Box>
            </Box>
          </Modal>









        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
       {
  storedUserData.user.role=="company-super-admin" &&
        <MenuItem
          onClick={() => {
            setEditingCardOpen(true);
          }}
        >
          <EditIcon sx={{ mr: 2 }} />
          Edit
        </MenuItem>
}
        <MenuItem
          onClick={() => {
            setShowQuestion(true);
          }}
        >
          <QuestionAnswerIcon sx={{ mr: 2 }} />
          Show Question
        </MenuItem>

{
  storedUserData.user.role=="company-super-admin" &&
  <MenuItem sx={{ color: "error.main" }} onClick={handleDeleteUser}>
  <DeleteIcon sx={{ mr: 2 }} />
  Delete
</MenuItem>
}
       
      </Popover>
    </>
  );
}
