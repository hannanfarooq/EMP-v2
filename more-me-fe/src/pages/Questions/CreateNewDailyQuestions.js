// import React, { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import {
//   Button,
//   FormControl,
//   Input,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextareaAutosize,
// } from "@mui/material";
// import { createDailyQuestionnaire } from "src/api";
// import { useAuth } from "src/context/AuthContext";
// import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

// const CreateNewDailyQuestion = () => {
//   const [question, setQuestion] = useState({
//     question: "",
//     options: [],
//   });
//   const [options, setOptions] = useState([""]);
//   const [type, setType] = useState("single-choice"); // Default type is single-choice
//   const { userData } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(""); // State to store error message for duplicate options

//   const handleTypeChange = (event) => {
//     setType(event.target.value);
//   };

//   const handleQuestionChange = (e) => {
//     setQuestion((prev) => ({ ...prev, question: e.target.value }));
//   };

//   const handleOptionChange = (e, index) => {
//     const { value } = e.target;
//     const list = [...options];
//     list[index] = value;
//     setOptions(list);
//     checkForDuplicateOptions(list); // Check for duplicates every time the option is updated
//   };

//   const handleAddOption = () => {
//     const newOptions = [...options, ""];
//     setOptions(newOptions);
//     checkForDuplicateOptions(newOptions); // Check for duplicates when a new option is added
//   };

//   const handleRemoveOption = (index) => {
//     const list = [...options];
//     list.splice(index, 1);
//     setOptions(list);
//     checkForDuplicateOptions(list); // Check for duplicates after removing an option
//   };

//   // Function to check for duplicate options
//   const checkForDuplicateOptions = (optionsList) => {
//     const uniqueOptions = new Set(optionsList.filter((option) => option.trim() !== ""));
//     if (uniqueOptions.size !== optionsList.filter((option) => option.trim() !== "").length) {
//       setErrorMessage("Multiple same options are not allowed.");
//     } else {
//       setErrorMessage(""); // Reset error if no duplicates
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!question.question) {
//       toast.error("Question is required.");
//       return;
//     }

//     if (type !== "textfield" && options.some((option) => !option.trim())) {
//       toast.error("All options must be filled.");
//       return;
//     }

//     if (errorMessage) {
//       toast.error(errorMessage); // Show the error message if there are duplicate options
//       return;
//     }

//     setLoading(true);
//     const data = {
//       questionText: question.question,
//       options: type === "textfield" ? [] : options, // Only include options for types other than 'textfield'
//       answer: "", // No answer field included in submission for any question type
//       companyId: userData?.company.id,
//       type: type,
//     };

//     try {
//       const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//       const response = await createDailyQuestionnaire([data], storedUserData.token);
//       if (response.code === 200) {
//         toast.success("Question added successfully!!"); 
//         setQuestion({ question: "", options: [] });
//         setOptions([""]);
//       } else {
//         toast.error("Error occurred while creating the question.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong.");
//     }
//     setLoading(false);
//   };

//   // Check if there are duplicates and disable the submit button accordingly
//   const isSubmitDisabled = errorMessage || options.some(option => options.indexOf(option) !== options.lastIndexOf(option));

//   return (
//     <StyledQuestion>
//       <div className="main">
//         <form className="register-form" onSubmit={handleSubmit}>
//           <TextareaAutosize
//             type="text"
//             name="question"
//             value={question.question || ""}
//             onChange={handleQuestionChange}
//             placeholder="Enter Question Headline"
//             required
//             minRows={5}
//           />

//           <div className="question-type" style={{ marginTop: "10px", marginBottom: "10px" }}>
//             <FormControl fullWidth>
//               <InputLabel id="type-label">Select Type</InputLabel>
//               <Select
//                 labelId="type-label"
//                 id="type-select"
//                 value={type}
//                 onChange={handleTypeChange}
//                 required
//               >
//                 <MenuItem value="single-choice">Question Single Choice</MenuItem>
//                 <MenuItem value="dropdown">Question with Dropdown</MenuItem>
//                 <MenuItem value="textfield">Question Text Field</MenuItem>
//               </Select>
//             </FormControl>
//           </div>

//           {/* Render options for 'single-choice' or 'dropdown' */}
//           {(type === "single-choice" || type === "dropdown") && (
//             <div>
//               <div className="question-option">
//                 {options.map((value, index) => (
//                   <div key={index}>
//                     <Input
//                       type="text"
//                       value={value || ""}
//                       onChange={(e) => handleOptionChange(e, index)}
//                       placeholder="Option text"
//                       required
//                     />
//                     <div className="options-btn">
//                       {options.length > 1 && (
//                         <Button onClick={() => handleRemoveOption(index)}>Remove</Button>
//                       )}
//                       {options.length - 1 === index && (
//                         <Button variant="outlined" onClick={handleAddOption}>
//                           Add New Option
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} {/* Display error message */}
//             </div>
//           )}

//           {/* Render a text input field if type is 'textfield' */}
//           {type === "textfield" && (
//             <div className="textfield-answer" style={{ marginTop: "10px" }}>
//               <Input
//                 type="text"
//                 placeholder="User will fill this"
//                 disabled
//               />
//             </div>
//           )}

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={loading || isSubmitDisabled} // Disable the button if there are duplicate options
//             style={{ marginTop: "20px" }}
//           >
//             {loading ? "Adding..." : "Add Question"}
//           </Button>
//         </form>
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </StyledQuestion>
//   );
// };

// export default CreateNewDailyQuestion;

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { createDailyQuestionnaire } from "src/api";
import { useAuth } from "src/context/AuthContext";
import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

const CreateNewDailyQuestion = ({ handleClose }) => {
  const [question, setQuestion] = useState({
    question: "",
    options: [],
  });
  const [options, setOptions] = useState([""]);
  const [type, setType] = useState("single-choice"); // Default type is single-choice
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message for duplicate options

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestion((prev) => ({ ...prev, question: e.target.value }));
  };

  const handleOptionChange = (e, index) => {
    const { value } = e.target;
    const list = [...options];
    list[index] = value;
    setOptions(list);
    checkForDuplicateOptions(list); // Check for duplicates every time the option is updated
  };

  const handleAddOption = () => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
    checkForDuplicateOptions(newOptions); // Check for duplicates when a new option is added
  };

  const handleRemoveOption = (index) => {
    const list = [...options];
    list.splice(index, 1);
    setOptions(list);
    checkForDuplicateOptions(list); // Check for duplicates after removing an option
  };

  // Function to check for duplicate options
  const checkForDuplicateOptions = (optionsList) => {
    const uniqueOptions = new Set(optionsList.filter((option) => option.trim() !== ""));
    if (uniqueOptions.size !== optionsList.filter((option) => option.trim() !== "").length) {
      setErrorMessage("Multiple same options are not allowed.");
    } else {
      setErrorMessage(""); // Reset error if no duplicates
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.question) {
      toast.error("Question is required.");
      return;
    }

    if (type !== "textfield" && options.some((option) => !option.trim())) {
      toast.error("All options must be filled.");
      return;
    }

    if (errorMessage) {
      toast.error(errorMessage); // Show the error message if there are duplicate options
      return;
    }

    setLoading(true);
    const data = {
      questionText: question.question,
      options: type === "textfield" ? [] : options, // Only include options for types other than 'textfield'
      answer: "", // No answer field included in submission for any question type
      companyId: userData?.company.id,
      type: type,
    };

    try {
      const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
      const response = await createDailyQuestionnaire([data], storedUserData.token);
      if (response.code === 200) {
        toast.success("Question added successfully!!"); 
        setQuestion({ question: "", options: [] });
        setOptions([""]);
        handleClose(); // Close the modal after successful question submission
      } else {
        toast.error("Error occurred while creating the question.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  // Check if there are duplicates and disable the submit button accordingly
  const isSubmitDisabled = errorMessage || options.some(option => options.indexOf(option) !== options.lastIndexOf(option));

  return (
    <StyledQuestion>
      <div className="main">
        <form className="register-form" onSubmit={handleSubmit}>
          <TextareaAutosize
            type="text"
            name="question"
            value={question.question || ""}
            onChange={handleQuestionChange}
            placeholder="Enter Question Headline"
            required
            minRows={5}
          />

          <div className="question-type" style={{ marginTop: "10px", marginBottom: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Select Type</InputLabel>
              <Select
                labelId="type-label"
                id="type-select"
                value={type}
                onChange={handleTypeChange}
                required
              >
                <MenuItem value="single-choice">Question Single Choice</MenuItem>
                <MenuItem value="dropdown">Question with Dropdown</MenuItem>
                <MenuItem value="textfield">Question Text Field</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Render options for 'single-choice' or 'dropdown' */}
          {(type === "single-choice" || type === "dropdown") && (
            <div>
              <div className="question-option">
                {options.map((value, index) => (
                  <div key={index}>
                    <Input
                      type="text"
                      value={value || ""}
                      onChange={(e) => handleOptionChange(e, index)}
                      placeholder="Option text"
                      required
                    />
                    <div className="options-btn">
                      {options.length > 1 && (
                        <Button onClick={() => handleRemoveOption(index)}>Remove</Button>
                      )}
                      {options.length - 1 === index && (
                        <Button variant="outlined" onClick={handleAddOption}>
                          Add New Option
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} {/* Display error message */}
            </div>
          )}

          {/* Render a text input field if type is 'textfield' */}
          {type === "textfield" && (
            <div className="textfield-answer" style={{ marginTop: "10px" }}>
              <Input
                type="text"
                placeholder="User will fill this"
                disabled
              />
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || isSubmitDisabled} // Disable the button if there are duplicate options
            style={{ marginTop: "20px" }}
          >
            {loading ? "Adding..." : "Add Question"}
          </Button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </StyledQuestion>
  );
};

export default CreateNewDailyQuestion;
