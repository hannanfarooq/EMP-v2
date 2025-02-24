// // import React, { useEffect, useState } from "react";
// // import { ToastContainer, toast } from "react-toastify";
// // import {
// //   Button,
// //   Card,
// //   Divider,
// //   FormControl,
// //   FormGroup,
// //   Input,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   TextareaAutosize,
// //   Typography,
// // } from "@mui/material";
// // import { createDynamicQuestion } from "src/api";
// // import { useAuth } from "src/context/AuthContext";
// // import { question_emojies } from "src/utils/baseURL";
// // import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
// // import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

// // const CreateNewQuestion = ({ categoryId }) => {
// //   const [question, setQuestion] = useState({
// //     question: "",
// //     question_options_attributes: [],
// //   });
// //   const [options, setOptions] = useState([""]);
// //   const [image, setImage] = useState(null);
// //   const [optionImages, setOptionImages] = useState([]);
// //   const [imageURL, setImageURL] = useState("");
// //   const { userData } = useAuth();
// //   const [loading, setLoading] = useState(false);
// //   const [type, setType] = useState("multiple-choice");

// //   const handleTypeChange2 = (event) => {
// //     setType(event.target.value);
// //   };

// //   const handleQuestionChange = (e) => {
// //     const name = e.target.name;
// //     const value = e.target.value;
// //     setQuestion((values) => ({ ...values, [name]: value }));
// //   };

// //   const handleOptionChange = (e, index) => {
// //     const { value } = e.target;
// //     const list = [...options];
// //     list[index] = value;
// //     setOptions(list);
// //   };

// //   const handleAdd = () => {
// //     setOptions([...options, ""]);
// //   };

// //   const handleRemove = (index) => {
// //     const list = [...options];
// //     list.splice(index, 1);
// //     setOptions(list);
// //     if (type === "multiple-img-choice") {
// //       const list = [...optionImages];
// //       list.splice(index, 1);
// //       setOptionImages(list);
// //     }
// //   };

// //   const handleImageChange = (e, index) => {
// //     if (type === "multiple-img-choice") {
// //       const list = [...optionImages];
// //       list[index] = e.target.files[0];
// //       setOptionImages(list);
// //     } else {
// //       setImage(e.target.files[0]);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (type === "multiple-img-choice" && optionImages.length !== options.length) {
// //       toast.error(`All options with image required`);
// //       return;
// //     }
    
// //     const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
// //     setLoading(true);
// //     let optionWithImages = [];
// //     let img = '';
// //     if (type === "multiple-img-choice") {
// //       for (let i = 0; i < optionImages.length; i++ ) {
// //         const url = await uploadImageAndGetURL(optionImages[i]);
// //         const option = JSON.stringify({
// //           text: options[i],
// //           img: url
// //         });
// //         optionWithImages.push(option);
// //       }
// //     } else {
// //       img = await uploadImageAndGetURL(image);
// //     }
// //     const data = {
// //       text: question.question,
// //       options: type === "multiple-img-choice" ? optionWithImages : options,
// //       companyId: userData?.company.id,
// //       type: type,
// //       image: img ? img : "",
// //       questionnaireId: categoryId,
// //     };
// //     console.log("createDynamicQuestion from model", data);
// //     await createDynamicQuestion([data], storedUserData.token).then(
// //       (response) => {
// //         if (response.code === 200) {
// //           window.location.reload();
// //           toast.success(`Question added successfully!`);

// //           setQuestion({ question: "" });
// //           setOptions([""]);
// //         } else {
// //           toast.error(`Some error occurred`);
// //         }
// //       }
// //     );
// //     setLoading(false);
// //   };

// //   return (
// //     <StyledQuestion>
// //       <div className="main">
// //         <form className="register-form" onSubmit={handleSubmit}>
// //           <TextareaAutosize
// //             type="text"
// //             name="question"
// //             value={question.question || ""}
// //             onChange={handleQuestionChange}
// //             placeholder="Enter Question Headline"
// //             required="required"
// //             minRows={5}
// //           />

// //           <div className="question-type" style={{ marginTop: "10px", marginBottom: "10px" }}>
// //             <FormControl fullWidth>
// //               <InputLabel id="type-label">Select Type</InputLabel>
// //               <Select
// //                 labelId="type-label"
// //                 id="type-select"
// //                 value={type}
// //                 onChange={handleTypeChange2}
// //                 required
// //               >
// //                 <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
// //                 <MenuItem value="single-choice">Single Choice</MenuItem>
// //                 <MenuItem value="emoji">Emoji</MenuItem>
// //                 <MenuItem value="yes-no">Yes/No</MenuItem>
// //                 <MenuItem value="multiple-img-choice">Options with Image</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </div>

// //           {type !== "multiple-img-choice" && <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />}
// //           {imageURL && (
// //             <img src={imageURL} alt="Uploaded" width="200px" height="200px" />
// //           )}

// //           {(type === "multiple-choice" || type === "single-choice") && (
// //             <div>
// //               <div className="question-option">
// //                 {options.map((value, index) => (
// //                   <div className="" key={index}>
// //                     <Input
// //                       type="text"
// //                       name="option"
// //                       value={value || ""}
// //                       onChange={(e) => handleOptionChange(e, index)}
// //                       placeholder="Question option text"
// //                       required="required"
// //                       width="30%"
// //                       radius="5px"
// //                     />

// //                     <div className="options-btn">
// //                       {options.length !== 1 && (
// //                         <Button onClick={() => handleRemove(index)}>
// //                           Remove
// //                         </Button>
// //                       )}

// //                       {options.length - 1 === index && (
// //                         <Button variant="outlined" onClick={() => handleAdd()}>
// //                           Add New
// //                         </Button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {type === "multiple-img-choice" && (
// //             <div>
// //               <div className="question-option">
// //                 {options.map((value, index) => (
// //                   <div className="" key={index}>
// //                     <Input
// //                       type="text"
// //                       name="option"
// //                       value={value || ""}
// //                       onChange={(e) => handleOptionChange(e, index)}
// //                       placeholder="Question option text"
// //                       required="required"
// //                       width="30%"
// //                       radius="5px"
// //                     />

// //                     <input required type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageChange(e, index)} />

// //                     <div className="options-btn">
// //                       {options.length !== 1 && (
// //                         <Button onClick={() => handleRemove(index)}>
// //                           Remove
// //                         </Button>
// //                       )}

// //                       {options.length - 1 === index && (
// //                         <Button variant="outlined" onClick={() => handleAdd()}>
// //                           Add New
// //                         </Button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {type === "emoji" && (
// //             <>
// //               <Divider className="m-3"/>
// //               <Typography className="m-0 text-xl">Options visible to user:</Typography>
// //               <FormGroup className="justify-center flex-nowrap flex flex-row">
// //                 {question_emojies.map((emoji, index) => (
// //                   <Card
// //                     key={index}
// //                     className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
// //                   >
// //                     <Typography className="m-0 text-3xl">{emoji.name}</Typography>
// //                   </Card>
// //                 ))}
// //               </FormGroup>
// //             </>
// //           )}

// //           {type === "yes-no" && (
// //             <>
// //               <Divider className="m-3"/>
// //               <Typography className="m-0 text-xl">Options visible to user:</Typography>
// //               <FormGroup className="justify-center flex-nowrap flex flex-row">
// //                 {["✅ Yes", "❌ No"].map((emoji, index) => (
// //                   <Card
// //                     key={index}
// //                     className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
// //                   >
// //                     <Typography className="m-0 text-3xl">{emoji}</Typography>
// //                   </Card>
// //                 ))}
// //               </FormGroup>
// //             </>
// //           )}

// //           {!loading && (
// //             <input
// //               type="submit"
// //               className="submit mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
// //               style={{cursor: "pointer"}}
// //             />
// //           )}
// //         </form>
// //       </div>
// //       <ToastContainer
// //         position="top-right"
// //         autoClose={5000}
// //         hideProgressBar={false}
// //         newestOnTop={false}
// //         closeOnClick
// //         rtl={false}
// //         pauseOnFocusLoss
// //         draggable
// //         pauseOnHover
// //       />
// //     </StyledQuestion>
// //   );
// // };

// // export default CreateNewQuestion;

// import React, { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import {
//   Button,
//   Card,
//   Divider,
//   FormControl,
//   FormGroup,
//   Input,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextareaAutosize,
//   Typography,
// } from "@mui/material";
// import { createDynamicQuestion } from "src/api";
// import { useAuth } from "src/context/AuthContext";
// import { question_emojies } from "src/utils/baseURL";
// import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
// import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

// const CreateNewQuestion = ({ categoryId }) => {
//   const [question, setQuestion] = useState({
//     question: "",
//     question_options_attributes: [],
//   });
//   const [options, setOptions] = useState([""]);
//   const [image, setImage] = useState(null);
//   const [optionImages, setOptionImages] = useState([]);
//   const [imageURL, setImageURL] = useState("");
//   const { userData } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [type, setType] = useState("multiple-choice");
//   const [errors, setErrors] = useState({}); // State for holding errors

//   const handleTypeChange2 = (event) => {
//     setType(event.target.value);
//   };

//   const handleQuestionChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setQuestion((values) => ({ ...values, [name]: value }));
//   };

//   const handleOptionChange = (e, index) => {
//     const { value } = e.target;
//     const list = [...options];
//     list[index] = value;
//     setOptions(list);

//     // Clear error if user changes the value
//     if (errors[index]) {
//       setErrors((prevErrors) => {
//         const newErrors = { ...prevErrors };
//         delete newErrors[index];
//         return newErrors;
//       });
//     }
//   };

//   const handleAdd = () => {
//     const optionErrors = validateOptions(options);
//     if (Object.keys(optionErrors).length > 0) {
//       setErrors(optionErrors);
//       toast.error("Options must be unique and non-empty");
//       return;
//     }

//     setOptions([...options, ""]);
//   };

//   const handleRemove = (index) => {
//     const list = [...options];
//     list.splice(index, 1);
//     setOptions(list);
//     if (type === "multiple-img-choice") {
//       const imgList = [...optionImages];
//       imgList.splice(index, 1);
//       setOptionImages(imgList);
//     }
//     setErrors((prevErrors) => {
//       const newErrors = { ...prevErrors };
//       delete newErrors[index];
//       return newErrors;
//     });
//   };

//   const handleImageChange = (e, index) => {
//     if (type === "multiple-img-choice") {
//       const list = [...optionImages];
//       list[index] = e.target.files[0];
//       setOptionImages(list);
//     } else {
//       setImage(e.target.files[0]);
//     }
//   };

//   const validateOptions = (options) => {
//     const error = {};
//     const optionSet = new Set();
//     options.forEach((option, index) => {
//       if (!option.trim()) {
//         error[index] = "Option cannot be empty";
//       } else if (optionSet.has(option)) {
//         error[index] = "Option must be unique";
//       } else {
//         optionSet.add(option);
//       }
//     });
//     return error;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate options
//     const optionErrors = validateOptions(options);
//     if (Object.keys(optionErrors).length > 0) {
//       setErrors(optionErrors);
//       toast.error(`Options must be unique and non-empty`);
//       return;
//     }

//     if (type === "multiple-img-choice" && optionImages.length !== options.length) {
//       toast.error(`All options with image required`);
//       return;
//     }

//     const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//     setLoading(true);
//     let optionWithImages = [];
//     let img = "";
//     if (type === "multiple-img-choice") {
//       for (let i = 0; i < optionImages.length; i++) {
//         const url = await uploadImageAndGetURL(optionImages[i]);
//         const option = JSON.stringify({
//           text: options[i],
//           img: url,
//         });
//         optionWithImages.push(option);
//       }
//     } else {
//       img = await uploadImageAndGetURL(image);
//     }
//     const data = {
//       text: question.question,
//       options: type === "multiple-img-choice" ? optionWithImages : options,
//       companyId: userData?.company.id,
//       type: type,
//       image: img ? img : "",
//       questionnaireId: categoryId,
//     };
//     console.log("createDynamicQuestion from model", data);
//     await createDynamicQuestion([data], storedUserData.token).then((response) => {
//       if (response.code === 200) {
//         window.location.reload();
//         toast.success(`Question added successfully!`);

//         setQuestion({ question: "" });
//         setOptions([""]);
//       } else {
//         toast.error(`Some error occurred`);
//       }
//     });
//     setLoading(false);
//   };

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
//             required="required"
//             minRows={5}
//           />

//           <div className="question-type" style={{ marginTop: "10px", marginBottom: "10px" }}>
//             <FormControl fullWidth>
//               <InputLabel id="type-label">Select Type</InputLabel>
//               <Select
//                 labelId="type-label"
//                 id="type-select"
//                 value={type}
//                 onChange={handleTypeChange2}
//                 required
//               >
//                 <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
//                 <MenuItem value="single-choice">Single Choice</MenuItem>
//                 <MenuItem value="emoji">Emoji</MenuItem>
//                 <MenuItem value="yes-no">Yes/No</MenuItem>
//                 <MenuItem value="multiple-img-choice">Options with Image</MenuItem>
//               </Select>
//             </FormControl>
//           </div>

//           {type !== "multiple-img-choice" && <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />}
//           {imageURL && <img src={imageURL} alt="Uploaded" width="200px" height="200px" />}

//           {(type === "multiple-choice" || type === "single-choice") && (
//             <div>
//               <div className="question-option">
//                 {options.map((value, index) => (
//                   <div className="" key={index}>
//                     <Input
//                       type="text"
//                       name="option"
//                       value={value || ""}
//                       onChange={(e) => handleOptionChange(e, index)}
//                       placeholder="Question option text"
//                       required="required"
//                       width="30%"
//                       radius="5px"
//                     />
//                     {errors[index] && (
//                       <Typography color="error" variant="caption">
//                         {errors[index]}
//                       </Typography>
//                     )}
//                     <div className="options-btn">
//                       {options.length !== 1 && (
//                         <Button onClick={() => handleRemove(index)}>Remove</Button>
//                       )}

//                       {options.length - 1 === index && (
//                         <Button variant="outlined" onClick={() => handleAdd()}>
//                           Add New
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {type === "multiple-img-choice" && (
//             <div>
//               <div className="question-option">
//                 {options.map((value, index) => (
//                   <div className="" key={index}>
//                     <Input
//                       type="text"
//                       name="option"
//                       value={value || ""}
//                       onChange={(e) => handleOptionChange(e, index)}
//                       placeholder="Question option text"
//                       required="required"
//                       width="30%"
//                       radius="5px"
//                     />

//                     <input required type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageChange(e, index)} />
//                     {errors[index] && (
//                       <Typography color="error" variant="caption">
//                         {errors[index]}
//                       </Typography>
//                     )}

//                     <div className="options-btn">
//                       {options.length !== 1 && (
//                         <Button onClick={() => handleRemove(index)}>Remove</Button>
//                       )}

//                       {options.length - 1 === index && (
//                         <Button variant="outlined" onClick={() => handleAdd()}>
//                           Add New
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {type === "emoji" && (
//             <>
//               <Divider className="m-3" />
//               <Typography className="m-0 text-xl">Options visible to user:</Typography>
//               <FormGroup className="justify-center flex-nowrap flex flex-row">
//                 {question_emojies.map((emoji, index) => (
//                   <Card
//                     key={index}
//                     className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
//                   >
//                     <Typography className="m-0 text-3xl">{emoji.name}</Typography>
//                   </Card>
//                 ))}
//               </FormGroup>
//             </>
//           )}

//           {type === "yes-no" && (
//             <>
//               <Divider className="m-3" />
//               <Typography className="m-0 text-xl">Options visible to user:</Typography>
//               <FormGroup className="justify-center flex-nowrap flex flex-row">
//                 {["✅ Yes", "❌ No"].map((emoji, index) => (
//                   <Card
//                     key={index}
//                     className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
//                   >
//                     <Typography className="m-0 text-3xl">{emoji}</Typography>
//                   </Card>
//                 ))}
//               </FormGroup>
//             </>
//           )}

//           {!loading && (
//             <input
//               type="submit"
//               className="submit mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               style={{ cursor: "pointer" }}
//             />
//           )}
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

// export default CreateNewQuestion;

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Card,
  Divider,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { createDynamicQuestion } from "src/api";
import { useAuth } from "src/context/AuthContext";
import { question_emojies } from "src/utils/baseURL";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { StyledQuestion } from "./Question.styled"; // Ensure the correct path to your styled component

const CreateNewQuestion = ({ categoryId }) => {
  const [question, setQuestion] = useState({
    question: "",
    question_options_attributes: [],
  });
  const [options, setOptions] = useState([""]);
  const [image, setImage] = useState(null);
  const [optionImages, setOptionImages] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("multiple-choice");
  const [errors, setErrors] = useState({});

  const handleTypeChange2 = (event) => {
    setType(event.target.value);
    setErrors({}); // Clear errors when changing the type
  };

  const handleQuestionChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuestion((values) => ({ ...values, [name]: value }));
  };

  const handleOptionChange = (e, index) => {
    const { value } = e.target;
    const list = [...options];
    list[index] = value;
    setOptions(list);

    if (errors[index]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleAdd = () => {
    if (["single-choice", "multiple-choice", "multiple-img-choice"].includes(type)) {
      const optionErrors = validateOptions(options);
      if (Object.keys(optionErrors).length > 0) {
        setErrors(optionErrors);
        toast.error("Options must be unique and non-empty");
        return;
      }
    }

    setOptions([...options, ""]);
  };

  const handleRemove = (index) => {
    const list = [...options];
    list.splice(index, 1);
    setOptions(list);
    if (type === "multiple-img-choice") {
      const imgList = [...optionImages];
      imgList.splice(index, 1);
      setOptionImages(imgList);
    }
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleImageChange = (e, index) => {
    if (type === "multiple-img-choice") {
      const list = [...optionImages];
      list[index] = e.target.files[0];
      setOptionImages(list);
    } else {
      setImage(e.target.files[0]);
    }
  };

  const validateOptions = (options) => {
    const error = {};
    const optionSet = new Set();
    options.forEach((option, index) => {
      if (!option.trim()) {
        error[index] = "Option cannot be empty";
      } else if (optionSet.has(option)) {
        error[index] = "Option must be unique";
      } else {
        optionSet.add(option);
      }
    });
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (["single-choice", "multiple-choice", "multiple-img-choice"].includes(type)) {
      const optionErrors = validateOptions(options);
      if (Object.keys(optionErrors).length > 0) {
        setErrors(optionErrors);
        toast.error(`Options must be unique and non-empty`);
        return;
      }
    }

    if (type === "multiple-img-choice" && optionImages.length !== options.length) {
      toast.error(`All options with image required`);
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
    setLoading(true);
    let optionWithImages = [];
    let img = "";
    if (type === "multiple-img-choice") {
      for (let i = 0; i < optionImages.length; i++) {
        const url = await uploadImageAndGetURL(optionImages[i]);
        const option = JSON.stringify({
          text: options[i],
          img: url,
        });
        optionWithImages.push(option);
      }
    } else {
      img = await uploadImageAndGetURL(image);
    }
    const data = {
      text: question.question,
      options: type === "multiple-img-choice" ? optionWithImages : options,
      companyId: userData?.company.id,
      type: type,
      image: img ? img : "",
      questionnaireId: categoryId,
    };
    console.log("createDynamicQuestion from model", data);
    await createDynamicQuestion([data], storedUserData.token).then((response) => {
      if (response.code === 200) {
        window.location.reload();
        toast.success(`Question added successfully!`);

        setQuestion({ question: "" });
        setOptions([""]);
      } else {
        toast.error(`Some error occurred`);
      }
    });
    setLoading(false);
  };

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
            required="required"
            minRows={5}
          />

          <div className="question-type" style={{ marginTop: "10px", marginBottom: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Select Type</InputLabel>
              <Select
                labelId="type-label"
                id="type-select"
                value={type}
                onChange={handleTypeChange2}
                required
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="single-choice">Single Choice</MenuItem>
                <MenuItem value="emoji">Emoji</MenuItem>
                <MenuItem value="yes-no">Yes/No</MenuItem>
                <MenuItem value="multiple-img-choice">Options with Image</MenuItem>
              </Select>
            </FormControl>
          </div>

          {type !== "multiple-img-choice" && <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />}
          {imageURL && <img src={imageURL} alt="Uploaded" width="200px" height="200px" />}

          {(type === "multiple-choice" || type === "single-choice") && (
            <div>
              <div className="question-option">
                {options.map((value, index) => (
                  <div className="" key={index}>
                    <Input
                      type="text"
                      name="option"
                      value={value || ""}
                      onChange={(e) => handleOptionChange(e, index)}
                      placeholder="Question option text"
                      required="required"
                      width="30%"
                      radius="5px"
                    />
                    {errors[index] && (
                      <Typography color="error" variant="caption">
                        {errors[index]}
                      </Typography>
                    )}
                    <div className="options-btn">
                      {options.length !== 1 && (
                        <Button onClick={() => handleRemove(index)}>Remove</Button>
                      )}

                      {options.length - 1 === index && (
                        <Button variant="outlined" onClick={() => handleAdd()}>
                          Add New
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === "multiple-img-choice" && (
            <div>
              <div className="question-option">
                {options.map((value, index) => (
                  <div className="" key={index}>
                    <Input
                      type="text"
                      name="option"
                      value={value || ""}
                      onChange={(e) => handleOptionChange(e, index)}
                      placeholder="Question option text"
                      required="required"
                      width="30%"
                      radius="5px"
                    />

                    <input required type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageChange(e, index)} />
                    {errors[index] && (
                      <Typography color="error" variant="caption">
                        {errors[index]}
                      </Typography>
                    )}

                    <div className="options-btn">
                      {options.length !== 1 && (
                        <Button onClick={() => handleRemove(index)}>Remove</Button>
                      )}

                      {options.length - 1 === index && (
                        <Button variant="outlined" onClick={() => handleAdd()}>
                          Add New
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === "emoji" && (
            <>
              <Divider className="m-3" />
              <Typography className="m-0 text-xl">Options visible to user:</Typography>
              <FormGroup className="justify-center flex-nowrap flex flex-row">
                {question_emojies.map((emoji, index) => (
                  <Card
                    key={index}
                    className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
                  >
                    <Typography className="m-0 text-3xl">{emoji.name}</Typography>
                  </Card>
                ))}
              </FormGroup>
            </>
          )}

          {type === "yes-no" && (
            <>
              <Divider className="m-3" />
              <Typography className="m-0 text-xl">Options visible to user:</Typography>
              <FormGroup className="justify-center flex-nowrap flex flex-row">
                {["✅ Yes", "❌ No"].map((emoji, index) => (
                  <Card
                    key={index}
                    className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
                  >
                    <Typography className="m-0 text-3xl">{emoji}</Typography>
                  </Card>
                ))}
              </FormGroup>
            </>
          )}

          {!loading && (
            <input
              type="submit"
              className="submit mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              style={{ cursor: "pointer" }}
            />
          )}
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

export default CreateNewQuestion;

