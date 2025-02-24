// import React, { useState, useEffect } from "react";
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
// import { updateDailyQuestionnaire } from "src/api"; // Assuming this API function exists
// import { useAuth } from "src/context/AuthContext";
// import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

// const EditDailyQuestionForCompany = ({ handleClose, currentQuestion }) => {
//   const [question, setQuestion] = useState({
//     question: currentQuestion?.questionText || "",
//     options: currentQuestion?.options || [],
//   });
//   const [options, setOptions] = useState(currentQuestion?.options || [""]);
//   const [type, setType] = useState(currentQuestion?.type || "single-choice"); // Set default type from existing data
//   const { userData } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(""); // State to store error message for duplicate options

//   useEffect(() => {
//     // Update state if currentQuestion changes
//     if (currentQuestion) {
//       setQuestion({
//         question: currentQuestion.questionText,
//         options: currentQuestion.options || [],
//       });
//       setOptions(currentQuestion.options || [""]);
//       setType(currentQuestion.type || "single-choice");
//     }
//   }, [currentQuestion]);

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
//       const response = await updateDailyQuestionnaire(currentQuestion.id, data, storedUserData.token); // Assuming the ID is passed to update
//       if (response.code === 200) {
//         toast.success("Question updated successfully!!");
//         handleClose(); // Close the modal after successful question update
//       } else {
//         toast.error("Error occurred while updating the question.");
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
//           {/* Question Text Area */}
//           <TextareaAutosize
//             type="text"
//             name="question"
//             value={question.question || ""}
//             onChange={handleQuestionChange}
//             placeholder="Enter Question Headline"
//             required
//             minRows={5}
//           />

//           {/* Question Type Selector */}
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

//           {/* Conditional Rendering for Options (single-choice and dropdown) */}
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

//           {/* Text Field Rendering for Textfield Type */}
//           {type === "textfield" && (
//             <div className="textfield-answer" style={{ marginTop: "10px" }}>
//               <Input
//                 type="text"
//                 placeholder="User will fill this"
//                 disabled
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={loading || isSubmitDisabled} // Disable the button if there are duplicate options
//             style={{ marginTop: "20px" }}
//           >
//             {loading ? "Updating..." : "Update Question"}
//           </Button>
//         </form>
//       </div>

//       {/* Toast Container */}
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

// export default EditDailyQuestionForCompany;

import React, { useState, useEffect } from "react";
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
import { updateDailyQuestionForCompany } from "src/api"; // Assuming this API function exists
import { useAuth } from "src/context/AuthContext";
import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

const EditDailyQuestionForCompany = ({ handleClose, currentQuestion }) => {
  const [question, setQuestion] = useState({
    question: currentQuestion?.questionText || "",
    options: currentQuestion?.options || [],
  });
  console.log("currentQuestion", currentQuestion);
  const [options, setOptions] = useState(currentQuestion?.options || [""]);
  const [type, setType] = useState(currentQuestion?.type || "single-choice"); // Set default type from existing data
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message for duplicate options

  useEffect(() => {
    // Update state if currentQuestion changes
    if (currentQuestion) {
      setQuestion({
        question: currentQuestion.questionText,
        options: currentQuestion.options || [],
      });
      setOptions(currentQuestion.options || [""]);
      setType(currentQuestion.type || "single-choice");
    }
  }, [currentQuestion]);

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
      const response = await updateDailyQuestionForCompany(currentQuestion.id, data, storedUserData.token); // Assuming the ID is passed to update
      console.log("response", response);
    
      if (response.message === "Question updated successfully") {
        toast.success("Question updated successfully!!");
        handleClose(); // Close the modal after successful question update
      } else {
        toast.error("Error occurred while updating the question.");
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
          {/* Question Text Area */}
          <TextareaAutosize
            type="text"
            name="question"
            value={question.question || ""}
            onChange={handleQuestionChange}
            placeholder="Enter Question Headline"
            required
            minRows={5}
          />

          {/* Question Type Selector */}
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

          {/* Conditional Rendering for Options (single-choice and dropdown) */}
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

          {/* Text Field Rendering for Textfield Type */}
          {type === "textfield" && (
            <div className="textfield-answer" style={{ marginTop: "10px" }}>
              <Input
                type="text"
                placeholder="User will fill this"
                disabled
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || isSubmitDisabled} // Disable the button if there are duplicate options
            style={{ marginTop: "20px" }}
          >
            {loading ? "Updating..." : "Update Question"}
          </Button>
        </form>
      </div>

      {/* Toast Container */}
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

export default EditDailyQuestionForCompany;
