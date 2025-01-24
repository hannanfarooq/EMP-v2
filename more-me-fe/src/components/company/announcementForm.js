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
import { useState } from "react";
import { createCompanyAnnouncement } from "src/api";
import { toast } from "react-toastify";
import { uploadPDFAndGetURL } from "src/utils/uploadPDFAndGetURL";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addMinutes } from "date-fns";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  });

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

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
    const { name, description, reward, announcementDate, questions } = formData;

    const formErrors = validateForm(name, description, reward);
    setErrors(formErrors);

    if (!name || !description || !reward || !announcementDate) {
      toast.error("All fields are required! Please fill out all the fields.");
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
          questions, // Send questions to the API
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
  const minDateTime = addMinutes(currentDate, 1);

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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDateTimePicker
                    label="Announcement Date and Time"
                    value={formData.announcementDate}
                    onChange={handleDateChange}
                    minDateTime={minDateTime}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
