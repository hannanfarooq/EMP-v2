import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { createCompanyAnnouncement, getCompanyFunctions,   getDepartmentTeams,   getFunctionDepartments  } from "src/api";
import { toast } from "react-toastify";
import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addMinutes, format } from "date-fns";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function validateForm(name, description, reward) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!description.trim()) errors.description = "Description is required";
  if (isNaN(reward) || reward === "") errors.reward = "Reward must be a valid number";
  if (reward < 1) errors.reward = "Reward must be a positive number";
  return errors;
}

export default function AddAnnouncement({ fetchCompanyAnnouncements, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reward: "",
    announcementDate: null,
    questions: [],
    announcementType: "global",
    functionId: "",
    departmentId: "",
    teamId: "",
  });
  const today = new Date();
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [companyFunctions, setCompanyFunctions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [datePart, setDatePart] = useState(null);
  const [timePart, setTimePart] = useState("12:00");
  
  const [error, setError] = useState(false);

  useEffect(() => {
    getCompanyFunctions(storedUserData.token, storedUserData?.company.id)
      .then((response) => {
        setCompanyFunctions(response.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch company functions");
      });
  }, []);

  useEffect(() => {
    if (datePart && timePart) {
      const [hours, minutes] = timePart.split(":").map(Number);
      const combined = new Date(datePart);
      combined.setUTCHours(hours);
      combined.setUTCMinutes(minutes);
      combined.setUTCSeconds(0);
      combined.setUTCMilliseconds(0);
  
      // Format to: YYYY-MM-DD HH:mm:ss.SSS +00:00
      const formatted = combined.toISOString().replace("T", " ").replace("Z", " +00:00");
  
      setFormData((prevData) => ({
        ...prevData,
        announcementDate: formatted,
      }));
    }
  }, [datePart, timePart]);
  
  useEffect(() => {
    if (formData.functionId) {
      getFunctionDepartments(storedUserData.token, formData.functionId)
             .then((response) => {
               console.log("DEPARTMENTS", response);
               setDepartments(response.data);
             })
             .catch((error) => {
               toast.error("Failed to fetch departments");
             });
    }
  }, [formData.functionId]);

  useEffect(() => {
    if (formData.departmentId) {
     getDepartmentTeams(storedUserData.token, formData.departmentId)
            .then((response) => {
              console.log("TEAMS", response);
              setTeams(response.data);
            })
            .catch((error) => {
              toast.error("Failed to fetch teams");
            });
    }
  }, [formData.departmentId]);

  const handleFileInput = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "documents") {
      setSelectedDocuments((prev) => [...prev, ...files]);
    } else if (type === "images") {
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (type, index) => {
    if (type === "documents") {
      setSelectedDocuments((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "images") {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, reward, announcementDate, questions, announcementType, functionId, departmentId, teamId } = formData;
  
    const formErrors = validateForm(name, description, reward);
    setErrors(formErrors);
  
    if (!name || !description || !reward || !announcementDate) {
      toast.error("All fields are required! Please fill out all the fields.");
      return;
    }
  
    // Check required fields based on announcementType
    if (announcementType === "function" && !functionId) {
      toast.error("Function ID is required for function type announcements.");
      return;
    }
    if (announcementType === "department" && !departmentId) {
      toast.error("Department ID is required for department type announcements.");
      return;
    }
    if (announcementType === "team" && !teamId) {
      toast.error("Team ID is required for team type announcements.");
      return;
    }
  
    if (Object.keys(formErrors).length === 0) {
      const uploadToastId = toast.info("Uploading files...", { autoClose: false, isLoading: true });
  
      try {
        const documentUrls = await Promise.all(
          selectedDocuments.map((file) => uploadPDFAndGetURL(file))
        );
  
        const imageUrls = await Promise.all(
          selectedImages.map((file) => uploadImageAndGetURL(file))
        );
  
        toast.dismiss(uploadToastId);
  
        const data = {
          name,
          description,
          rewardPoints: reward,
          companyId: storedUserData?.company.id,
          documentUrls,
          imageUrls,
          announcementDate,
          questions,
          announcementType,
          functionId,
          departmentId,
          teamId,
        };
  
        setSubmitting(true);
        await createCompanyAnnouncement(data, storedUserData.token);
        fetchCompanyAnnouncements();
        setSubmitting(false);
        toast.success("Announcement created successfully!");
  
        setFormData({
          name: "",
          description: "",
          reward: "",
          announcementDate: null,
          questions: [],
          announcementType: "global",
          functionId: "",
          departmentId: "",
          teamId: "",
        });
        setSelectedDocuments([]);
        setSelectedImages([]);
  
        if (onClose) {
          onClose();
        }
      } catch (error) {
        toast.dismiss(uploadToastId);
        toast.error("Error uploading files. Please try again.");
      }
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (newValue) => {
    setFormData({
      ...formData,
      announcementDate: newValue,
    });
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][event.target.name] = event.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: [""] },
      ],
    });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const currentDate = new Date();
  const minDateTime = addMinutes(currentDate, -5);


  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <BusinessIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add new Announcement
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
               {/* Announcement Type Dropdown */}
               <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="announcementType-label">Announcement Type</InputLabel>
                  <Select
                    labelId="announcementType-label"
                    id="announcementType"
                    name="announcementType"
                    value={formData.announcementType}
                    onChange={handleInputChange}
                    label="Announcement Type"
                  >
                    <MenuItem value="global">Global</MenuItem>
                    <MenuItem value="function">Function</MenuItem>
                    <MenuItem value="department">Department</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
               {/* Function Dropdown (if announcementType is function, department or team) */}
               {formData.announcementType !== "global" && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="functionId-label">Function</InputLabel>
                    <Select
                      labelId="functionId-label"
                      id="functionId"
                      name="functionId"
                      value={formData.functionId}
                      onChange={handleInputChange}
                      label="Function"
                    >
                      {companyFunctions.map((func) => (
                        <MenuItem key={func.id} value={func.id}>
                          {func.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
               {/* Department Dropdown (if announcementType is department or team) */}
               {formData.announcementType !== "global" && formData.announcementType !== "function" && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="departmentId-label">Department</InputLabel>
                    <Select
                      labelId="departmentId-label"
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      label="Department"
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                          {department.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
               {/* Team Dropdown (if announcementType is team) */}
               {formData.announcementType === "team" && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="teamId-label">Team</InputLabel>
                    <Select
                      labelId="teamId-label"
                      id="teamId"
                      name="teamId"
                      value={formData.teamId}
                      onChange={handleInputChange}
                      label="Team"
                    >
                      {teams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Announcement Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  multiline
                  rows={6}
                  label="Announcement Summary"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="reward"
                  label="Reward Points"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  error={!!errors.reward}
                  helperText={errors.reward}
                />
              </Grid>
              <Grid item xs={12}>
                <span>Select announcement document files (.pdf/.docx)</span>
                <input
                  type="file"
                  accept=".pdf, .docx"
                  multiple
                  onChange={(e) => handleFileInput(e, "documents")}
                />
                <ul>
                  {selectedDocuments.map((file, index) => (
                    <li key={index}>
                      {file.name}{" "}
                      <Button size="small" onClick={() => removeFile("documents", index)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </Grid>
              <Grid item xs={12} sx={{ pb: 3, pl: 2 }}>
                <span>Select announcement images (.png, .jpg, .jpeg)</span>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  multiple
                  onChange={(e) => handleFileInput(e, "images")}
                />
                <ul>
                  {selectedImages.map((file, index) => (
                    <li key={index}>
                      {file.name}{" "}
                      <Button size="small" onClick={() => removeFile("images", index)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </Grid>
              <Grid container spacing={4} sx={{ pt: 3, pl: 2 }}>
      {/* 📅 Date Picker */}
      <Grid item xs={12} sm={6}>
     
      <DatePicker
  selected={datePart}
  onChange={(date) => {
    setDatePart(date);
    setError(false);
  }}
  dateFormat="dd/MM/yyyy"
  minDate={today}
  customInput={
    <TextField
      label="Announce Date"
      value={datePart ? format(datePart, "dd/MM/yyyy") : ""}
      error={error && !datePart}
      helperText={error && !datePart ? "Date is required" : ""}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: <span role="img" aria-label="calendar">📅</span>,
      }}
      inputProps={{
        placeholder: "DD/MM/YYYY", // ✅ This makes the placeholder visible
      }}
    />
  }
/>
      </Grid>

      {/* ⏰ Time Picker */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Announce Time"
          type="time"
          value={timePart}
          onChange={(e) => setTimePart(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min steps
          }}
        />
      </Grid>

      
    </Grid>

              {/* Questions Section */}
              <Grid item xs={12}>
                <Typography variant="h6">Add Questions</Typography>
                {formData.questions.map((question, questionIndex) => (
                  <Box key={questionIndex} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label={`Question ${questionIndex + 1}`}
                      name="question"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, e)}
                    />
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <TextField
                          fullWidth
                          label={`Option ${optionIndex + 1}`}
                          name="option"
                          value={option}
                          onChange={(e) => {
                            const updatedQuestions = [...formData.questions];
                            updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
                            setFormData({ ...formData, questions: updatedQuestions });
                          }}
                        />
                        <Button size="small" onClick={() => handleRemoveOption(questionIndex, optionIndex)}>
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button size="small" onClick={() => handleAddOption(questionIndex)}>
                      Add Option
                    </Button>
                    <Button size="small" onClick={() => handleRemoveQuestion(questionIndex)}>
                      Remove Question
                    </Button>
                  </Box>
                ))}
                <Button size="small" onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }} disabled={submitting}>
              {submitting ? "Submitting..." : "Create"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
