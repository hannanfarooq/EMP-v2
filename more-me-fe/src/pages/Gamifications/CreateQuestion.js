import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { StyledQuestion } from "./Question.styled";
import {
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  FormLabel,
  TextareaAutosize,
  Typography,
  RadioGroup,
  Radio,
} from "@mui/material";
import { createCompanyGamification, getQuestionCategories } from "src/api";
import { useAuth } from "src/context/AuthContext";
import { areas, question_emojies } from "src/utils/baseURL";
import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
import { useQuery } from "react-query";

const CreateGamification = (props) => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      question_options_attributes: [],
      options: [""],
      images: [],
      video: null,
      optionImages: [],
      imageURLs: [],
      mediaType: "image",
      questionType: "",
      correctAnswer: "",
      type: "",
      columnA: [""],
      columnB: [""],
      columnMatch: {},
    },
  ]);

  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const getMessages = async () => await getQuestionCategories();
  const { data, isLoading, error } = useQuery(["questionCategories"], getMessages);

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;

  const handleQuestionChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...questions];
    list[index][name] = value;

    if (name === "type" && value === "yes-no") {
      list[index].options = ["Yes", "No"];
    } else if (name === "type" && value === "column-matching") {
      list[index].columnA = [""];
      list[index].columnB = [""];
      list[index].columnMatch = {};
    } else if (name === "type" ){
      list[index].options = [""];
    }

    setQuestions(list);
  };
  const setcorrectquestion = (e,index)=>
  {
    const { name, value } = e.target;
    const list = [...questions];
    list[index][name] = value;
    setQuestions(list);
  }

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const { value } = e.target;
    const list = [...questions];
    list[questionIndex].options[optionIndex] = value;
    setQuestions(list);
  };

  const handleAddOption = (questionIndex) => {
    const list = [...questions];
    list[questionIndex].options.push("");
    setQuestions(list);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const list = [...questions];
    list[questionIndex].options.splice(optionIndex, 1);
    setQuestions(list);
    if (list[questionIndex].type === "multiple-img-choice") {
      list[questionIndex].optionImages.splice(optionIndex, 1);
    }
  };

  const handleImageChange = (e, questionIndex, optionIndex) => {
    const list = [...questions];
    if (list[questionIndex].type === "multiple-img-choice") {
      list[questionIndex].optionImages[optionIndex] = e.target.files[0];
    } else {
      if (list[questionIndex].mediaType === "image") {
        list[questionIndex].images = Array.from(e.target.files);
        list[questionIndex].video = null;
      } else {
        list[questionIndex].images = null;
        list[questionIndex].video = e.target.files[0];
      }
    }
    setQuestions(list);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        question_options_attributes: [],
        options: [""],
        images: [],
        video: null,
        optionImages: [],
        imageURLs: [],
        mediaType: "image",
        questionType: "",
        correctAnswer: "",
        type: "",
        columnA: [""],
        columnB: [""],
        columnMatch: {},
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const list = [...questions];
    list.splice(index, 1);
    setQuestions(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting:", e)

    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
    setLoading(true);

    const questionsData = await Promise.all(
      questions.map(async (question) => {
        let optionWithImages = [];
        let imgURLs = [];
        let mediaURL = null;

        if (question.type === "multiple-img-choice") {
          for (let i = 0; i < question.optionImages.length; i++) {
            const url = await uploadImageAndGetURL(question.optionImages[i]);
            const option = JSON.stringify({
              text: question.options[i],
              img: url,
            });
            optionWithImages.push(option);
          }
        } else {
          if (question.mediaType === "image") {
            for (const image of question.images) {
              const url = await uploadImageAndGetURL(image);
              imgURLs.push(url);
              console.log(" URL :", url);
            }
          } else {
            mediaURL = await uploadImageAndGetURL(question.video);
            console.log("MEDIA URL :", mediaURL);
          }
        }

        return {
          text: question.question,
          options:
            question.type === "multiple-img-choice"
              ? optionWithImages
              : question.options,
          companyId: userData?.company.id,
          type: question.type,
          questionCategoryId: question.questionType,
          image: imgURLs.length > 0 ? imgURLs : [],
          media: mediaURL ? mediaURL : "",
          correctOption: question.correctAnswer,
          columnA:question.columnA,
          columnB:question.columnB,
          columnMatch: question.columnMatch,
        };
      })
    );

    await createCompanyGamification(questionsData, storedUserData.token).then(
      (response) => {
        if (response.code === 200) {
          window.location.reload();
        } else {
          toast.error(`Some error occurred`);
        }
      }
    );
    setLoading(false);
  };

  const handleAddColumnA = (questionIndex) => {
    const list = [...questions];
    list[questionIndex].columnA.push("");
    setQuestions(list);
  };

  const handleAddColumnB = (questionIndex) => {
    const list = [...questions];
    list[questionIndex].columnB.push("");
    setQuestions(list);
  };

  const handleRemoveColumnA = (questionIndex, columnIndex) => {
    const list = [...questions];
    const removedItem = list[questionIndex].columnA.splice(columnIndex, 1)[0];
    if (list[questionIndex].columnMatch[removedItem]) {
      delete list[questionIndex].columnMatch[removedItem];
    }
    setQuestions(list);
  };

  const handleRemoveColumnB = (questionIndex, columnIndex) => {
    const list = [...questions];
    const removedItem = list[questionIndex].columnB.splice(columnIndex, 1)[0];
    Object.keys(list[questionIndex].columnMatch).forEach((key) => {
      if (list[questionIndex].columnMatch[key] === removedItem) {
        delete list[questionIndex].columnMatch[key];
      }
    });
    setQuestions(list);
  };

  const handleColumnAChange = (e, questionIndex, columnIndex) => {
    const { value } = e.target;
    const list = [...questions];
    const oldKey = list[questionIndex].columnA[columnIndex];
    list[questionIndex].columnA[columnIndex] = value;

    if (list[questionIndex].columnMatch[oldKey]) {
      list[questionIndex].columnMatch[value] =
        list[questionIndex].columnMatch[oldKey];
      delete list[questionIndex].columnMatch[oldKey];
    }
    setQuestions(list);
  };

  const handleColumnBChange = (e, questionIndex, columnIndex) => {
    const { value } = e.target;
    const list = [...questions];
    list[questionIndex].columnB[columnIndex] = value;
    setQuestions(list);
  };

  const handleColumnMatchChange = (e, questionIndex, columnAItem) => {
    const { value } = e.target;
    const list = [...questions];
    list[questionIndex].columnMatch[columnAItem] = value;
    setQuestions(list);
  };

  return (
    <StyledQuestion>
      <div className="main">
        <p className="form-title text-center text-xl font-semibold">
          Add Gamification
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-section">
              <TextareaAutosize
                type="text"
                name="question"
                value={question.question}
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                placeholder="Enter Gamification Headline"
                required="required"
                minRows={3}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />

              <div className="mb-2 mt-2">
                <FormControl
                  fullWidth
                  sx={{ fieldset: { legend: { maxWidth: "100%" } } }}
                >
                  <InputLabel
                    id={`category-select-${questionIndex}`}
                    inputlabelprops={{ shrink: true }}
                  >
                    Select Category
                  </InputLabel>
                  <Select
                    labelId={`category-select-${questionIndex}`}
                    id={`category-select-${questionIndex}`}
                    value={question.questionType}
                    label="Category"
                    onChange={(e) => handleQuestionChange(e, questionIndex)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    name="questionType"
                  >
                    {data?.data?.map((area, index) => (
                      <MenuItem key={index} value={area.id}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div
                className="question-type"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <FormControl fullWidth>
                  <InputLabel id={`type-select-${questionIndex}`}>
                    Select Type
                  </InputLabel>
                  <Select
                    labelId={`type-select-${questionIndex}`}
                    id={`type-select-${questionIndex}`}
                    value={question.type}
                    onChange={(e) => handleQuestionChange(e, questionIndex)}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    name="type"
                  >
                    <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                    <MenuItem value="single-choice">Single Choice</MenuItem>
                    <MenuItem value="yes-no">Yes/No</MenuItem>
                    <MenuItem value="multiple-img-choice">
                      Options with Image
                    </MenuItem>
                    <MenuItem value="column-matching">
                      Column Matching
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
{(question.type!='column-matching')&&

  <div className="mb-2 mt-2">
                <FormControl
                  fullWidth
                  sx={{ fieldset: { legend: { maxWidth: "100%" } } }}
                >
                  <InputLabel
                    id={`correct-option-select-${questionIndex}`}
                    inputlabelprops={{ shrink: true }}
                  >
                    Select Correct Option
                  </InputLabel>
                  <Select
                    labelId={`correct-option-select-${questionIndex}`}
                    id={`correct-option-select-${questionIndex}`}
                    value={question.correctAnswer}
                    onChange={(e) =>{
                      
                      setcorrectquestion(e, questionIndex)
                    } }
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    name="correctAnswer"
                  >
                    {question.options.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

}
            

              <div className="add-question-options">
                {question.type === "yes-no" ? (
                  <>
                    <Divider className="m-3" />
                    <Typography className="m-0 text-xl">
                      Options visible to user:
                    </Typography>
                    <FormGroup className="justify-center flex-nowrap flex flex-row">
                      {["✅ Yes", "❌ No"].map((emoji, index) => (
                        <Card
                          key={index}
                          className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
                        >
                          <Typography className="m-0 text-3xl">
                            {emoji}
                          </Typography>
                        </Card>
                      ))}
                    </FormGroup>
                  </>
                ) : question.type === "column-matching" ? (
                  <>
                    <h3 className="text-xl font-medium text-gray-800 mb-4">
                      Column Matching
                    </h3>
                    <div className="column-matching">
                      <div className="column-a">
                        <h4>Column A</h4>
                        {question.columnA.map((item, index) => (
                          <FormGroup key={index}>
                            <Input
                              type="text"
                              placeholder={`Column A ${index + 1}`}
                              value={item}
                              onChange={(e) =>
                                handleColumnAChange(e, questionIndex, index)
                              }
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                            />
                            {question.columnA.length > 1 && (
                              <Button
                                type="button"
                                onClick={() =>
                                  {handleRemoveColumnA(questionIndex, index)
                                  
                                    handleRemoveColumnB(questionIndex, index)
                                  }}
                                className="remove-btn bg-red-500 text-white font-semibold py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 mb-2"
                              >
                                Remove
                              </Button>
                            )}
                          </FormGroup>
                        ))}
                        <Button
                          type="button"
                          onClick={() => {handleAddColumnA(questionIndex)

                            handleAddColumnB(questionIndex)
                          }}
                          className="add-btn bg-green-500 text-white font-semibold py-1 px-4 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600 mb-2"
                        >
                          Add Column A
                        </Button>
                      </div>
                      <div className="column-b">
                        <h4>Column B</h4>
                        {question.columnB.map((item, index) => (
                          <FormGroup key={index}>
                            <Input
                              type="text"
                              placeholder={`Column B ${index + 1}`}
                              value={item}
                              onChange={(e) =>
                                handleColumnBChange(e, questionIndex, index)
                              }
                              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                            />
                           
                          </FormGroup>
                        ))}
                       
                      </div>
                    </div>
                    <h4>Match Columns</h4>
                    {question.columnA.map((itemA, indexA) => (
                      <FormGroup key={indexA}>
                        <Input
                          type="text"
                          value={itemA}
                          readOnly
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                        />
                        <Select
                          value={question.columnMatch[itemA] || ""}
                          onChange={(e) =>
                            handleColumnMatchChange(e, questionIndex, itemA)
                          }
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                        >
                          {question.columnB
                            .filter(
                              (itemB) =>
                                !Object.values(question.columnMatch).includes(
                                  itemB
                                ) || itemB === question.columnMatch[itemA]
                            )
                            .map((itemB, indexB) => (
                              <MenuItem key={indexB} value={itemB}>
                                {itemB}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormGroup>
                    ))}
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-medium text-gray-800 mb-4">
                      Options
                    </h3>
                    {question.options.map((option, optionIndex) => (
                      <FormGroup key={optionIndex}>
                        <Input
                          type="text"
                          name="option"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(e, questionIndex, optionIndex)
                          }
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                        />
                        {question.type === "multiple-img-choice" && (
                          <Input
                            type="file"
                            onChange={(e) =>
                              handleImageChange(e, questionIndex, optionIndex)
                            }
                            required
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                          />
                        )}
                        {question.options.length !== 1 && (
                          <Button
                            type="button"
                            onClick={() =>
                              handleRemoveOption(questionIndex, optionIndex)
                            }
                            className="remove-btn bg-red-500 text-white font-semibold py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 mb-2"
                          >
                            Remove
                          </Button>
                        )}
                      </FormGroup>
                    ))}
                    <Button
                      type="button"
                      onClick={() => handleAddOption(questionIndex)}
                      className="add-btn bg-green-500 text-white font-semibold py-1 px-4 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600 mb-2"
                    >
                      Add Option
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-4">
                <Typography variant="h6">
                  Upload {question.mediaType.toUpperCase()}
                </Typography>
                <RadioGroup
                  row
                  value={question.mediaType}
                  onChange={(e) => handleQuestionChange(e, questionIndex)}
                  name="mediaType"
                >
                  <FormControlLabel
                    value="image"
                    control={<Radio />}
                    label="Image"
                  />
                  <FormControlLabel
                    value="video"
                    control={<Radio />}
                    label="Video"
                  />
                </RadioGroup>
                <input
                  type="file"
                  accept={
                    question.mediaType === "image"
                      ? "image/png, image/jpeg"
                      : "video/*"
                  }
                  multiple={question.mediaType === "image"}
                  onChange={(e) => handleImageChange(e, questionIndex)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                  className="remove-question-btn bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-4"
                >
                  Remove Question
                </Button>
              </div>

              <Divider className="my-4" />
            </div>
          ))}

          <div className="text-center">
            <Button
              type="button"
              onClick={handleAddQuestion}
              className="add-question-btn bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4"
            >
              Add Another Question
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              className="submit-btn bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </StyledQuestion>
  );
};

export default CreateGamification;

// import { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { StyledQuestion } from "./Question.styled";
// import {
//   Button,
//   Card,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   FormGroup,
//   Input,
//   InputLabel,
//   LinearProgress,
//   MenuItem,
//   Select,
//   FormLabel,
//   TextareaAutosize,
//   Typography,
//   RadioGroup,
//   Radio,
// } from "@mui/material";
// import { createCompanyGamification, getQuestionCategories } from "src/api";
// import { useAuth } from "src/context/AuthContext";
// import { areas, question_emojies } from "src/utils/baseURL";
// import { uploadImageAndGetURL } from "src/utils/uploadImageAndGetURL";
// import { useQuery } from "react-query";

// const CreateGamification = (props) => {
//   const [questions, setQuestions] = useState([
//     {
//       question: "",
//       question_options_attributes: [],
//       options: [""],
//       images: [],
//       video: null,
//       optionImages: [],
//       imageURLs: [],
//       mediaType: "image",
//       questionType: areas[0].name,
//       correctAnswer: "",
//       type: "",
//       columnA: [""],
//       columnB: [""],
//       columnMatch: {},
//     },
//   ]);

//   const { userData } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const getMessages = async () => await getQuestionCategories();
//   const { data, isLoading, error } = useQuery(["questionCategories"], getMessages);

//   if (isLoading) return <LinearProgress />;
//   if (error) return <div>Something went wrong</div>;

//   const handleQuestionChange = (e, index) => {
//     const { name, value } = e.target;
//     const list = [...questions];
//     list[index][name] = value;

//     if (name === "type" && value === "yes-no") {
//       list[index].options = ["Yes", "No"];
//     } else if (name === "type" && value === "column-matching") {
//       list[index].columnA = [""];
//       list[index].columnB = [""];
//       list[index].columnMatch = {};
//     } else {
//       list[index].options = [""];
//     }

//     setQuestions(list);
//   };
//   const setcorrectquestion = (e,index)=>
//   {
//     const { name, value } = e.target;
//     const list = [...questions];
//     list[index][name] = value;
//     setQuestions(list);
//   }

//   const handleOptionChange = (e, questionIndex, optionIndex) => {
//     const { value } = e.target;
//     const list = [...questions];
//     list[questionIndex].options[optionIndex] = value;
//     setQuestions(list);
//   };

//   const handleAddOption = (questionIndex) => {
//     const list = [...questions];
//     list[questionIndex].options.push("");
//     setQuestions(list);
//   };

//   const handleRemoveOption = (questionIndex, optionIndex) => {
//     const list = [...questions];
//     list[questionIndex].options.splice(optionIndex, 1);
//     setQuestions(list);
//     if (list[questionIndex].type === "multiple-img-choice") {
//       list[questionIndex].optionImages.splice(optionIndex, 1);
//     }
//   };

//   const handleImageChange = (e, questionIndex, optionIndex) => {
//     const list = [...questions];
//     if (list[questionIndex].type === "multiple-img-choice") {
//       list[questionIndex].optionImages[optionIndex] = e.target.files[0];
//     } else {
//       if (list[questionIndex].mediaType === "image") {
//         list[questionIndex].images = Array.from(e.target.files);
//         list[questionIndex].video = null;
//       } else {
//         list[questionIndex].images = [];
//         list[questionIndex].video = e.target.files[0];
//       }
//     }
//     setQuestions(list);
//   };

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: "",
//         question_options_attributes: [],
//         options: [""],
//         images: [],
//         video: null,
//         optionImages: [],
//         imageURLs: [],
//         mediaType: "image",
//         questionType: areas[0].name,
//         correctAnswer: "",
//         type: "",
//         columnA: [""],
//         columnB: [""],
//         columnMatch: {},
//       },
//     ]);
//   };

//   const handleRemoveQuestion = (index) => {
//     const list = [...questions];
//     list.splice(index, 1);
//     setQuestions(list);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
//     setLoading(true);

//     const questionsData = await Promise.all(
//       questions.map(async (question) => {
//         let optionWithImages = [];
//         let imgURLs = [];
//         let mediaURL = null;

//         if (question.type === "multiple-img-choice") {
//           for (let i = 0; i < question.optionImages.length; i++) {
//             const url = await uploadImageAndGetURL(question.optionImages[i]);
//             const option = JSON.stringify({
//               text: question.options[i],
//               img: url,
//             });
//             optionWithImages.push(option);
//           }
//         } else {
//           if (question.mediaType === "image") {
//             for (const image of question.images) {
//               const url = await uploadImageAndGetURL(image);
//               imgURLs.push(url);
//               console.log(" URL :", url);
//             }
//           } else {
//             mediaURL = await uploadImageAndGetURL(question.video);
//             console.log("MEDIA URL :", mediaURL);
//           }
//         }

//         return {
//           text: question.question,
//           options:
//             question.type === "multiple-img-choice"
//               ? optionWithImages
//               : question.options,
//           companyId: userData?.company.id,
//           type: question.type,
//           questionCategoryId: question.questionType,
//           image: imgURLs.length > 0 ? imgURLs : [],
//           media: mediaURL ? mediaURL : "",
//           correctOption: question.correctAnswer,
//           columnA:question.columnA,
//           columnB:question.columnB,
//           columnMatch: question.columnMatch,
//         };
//       })
//     );

//     await createCompanyGamification(questionsData, storedUserData.token).then(
//       (response) => {
//         if (response.code === 200) {
//           window.location.reload();
//         } else {
//           toast.error(`Some error occurred`);
//         }
//       }
//     );
//     setLoading(false);
//   };

//   const handleAddColumnA = (questionIndex) => {
//     const list = [...questions];
//     list[questionIndex].columnA.push("");
//     setQuestions(list);
//   };

//   const handleAddColumnB = (questionIndex) => {
//     const list = [...questions];
//     list[questionIndex].columnB.push("");
//     setQuestions(list);
//   };

//   const handleRemoveColumnA = (questionIndex, columnIndex) => {
//     const list = [...questions];
//     const removedItem = list[questionIndex].columnA.splice(columnIndex, 1)[0];
//     if (list[questionIndex].columnMatch[removedItem]) {
//       delete list[questionIndex].columnMatch[removedItem];
//     }
//     setQuestions(list);
//   };

//   const handleRemoveColumnB = (questionIndex, columnIndex) => {
//     const list = [...questions];
//     const removedItem = list[questionIndex].columnB.splice(columnIndex, 1)[0];
//     Object.keys(list[questionIndex].columnMatch).forEach((key) => {
//       if (list[questionIndex].columnMatch[key] === removedItem) {
//         delete list[questionIndex].columnMatch[key];
//       }
//     });
//     setQuestions(list);
//   };

//   const handleColumnAChange = (e, questionIndex, columnIndex) => {
//     const { value } = e.target;
//     const list = [...questions];
//     const oldKey = list[questionIndex].columnA[columnIndex];
//     list[questionIndex].columnA[columnIndex] = value;

//     if (list[questionIndex].columnMatch[oldKey]) {
//       list[questionIndex].columnMatch[value] =
//         list[questionIndex].columnMatch[oldKey];
//       delete list[questionIndex].columnMatch[oldKey];
//     }
//     setQuestions(list);
//   };

//   const handleColumnBChange = (e, questionIndex, columnIndex) => {
//     const { value } = e.target;
//     const list = [...questions];
//     list[questionIndex].columnB[columnIndex] = value;
//     setQuestions(list);
//   };

//   const handleColumnMatchChange = (e, questionIndex, columnAItem) => {
//     const { value } = e.target;
//     const list = [...questions];
//     list[questionIndex].columnMatch[columnAItem] = value;
//     setQuestions(list);
//   };

//   return (
//     <StyledQuestion>
//       <div className="main">
//         <p className="form-title text-center text-xl font-semibold">
//           Add Gamification
//         </p>

//         <form className="register-form" onSubmit={handleSubmit}>
//           {questions.map((question, questionIndex) => (
//             <div key={questionIndex} className="question-section">
//               <TextareaAutosize
//                 type="text"
//                 name="question"
//                 value={question.question}
//                 onChange={(e) => handleQuestionChange(e, questionIndex)}
//                 placeholder="Enter Gamification Headline"
//                 required="required"
//                 minRows={3}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//               />

//               <div className="mb-2 mt-2">
//                 <FormControl
//                   fullWidth
//                   sx={{ fieldset: { legend: { maxWidth: "100%" } } }}
//                 >
//                   <InputLabel
//                     id={`category-select-${questionIndex}`}
//                     inputlabelprops={{ shrink: true }}
//                   >
//                     Select Category
//                   </InputLabel>
//                   <Select
//                     labelId={`category-select-${questionIndex}`}
//                     id={`category-select-${questionIndex}`}
//                     value={question.questionType}
//                     label="Category"
//                     onChange={(e) => handleQuestionChange(e, questionIndex)}
//                     required
//                     className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                     name="questionType"
//                   >
//                     {data?.data?.map((area, index) => (
//                       <MenuItem key={index} value={area.id}>
//                         {area.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </div>

//               <div
//                 className="question-type"
//                 style={{ marginTop: "10px", marginBottom: "10px" }}
//               >
//                 <FormControl fullWidth>
//                   <InputLabel id={`type-select-${questionIndex}`}>
//                     Select Type
//                   </InputLabel>
//                   <Select
//                     labelId={`type-select-${questionIndex}`}
//                     id={`type-select-${questionIndex}`}
//                     value={question.type}
//                     onChange={(e) => handleQuestionChange(e, questionIndex)}
//                     required
//                     className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                     name="type"
//                   >
//                     <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
//                     <MenuItem value="single-choice">Single Choice</MenuItem>
//                     <MenuItem value="yes-no">Yes/No</MenuItem>
//                     <MenuItem value="multiple-img-choice">
//                       Options with Image
//                     </MenuItem>
//                     <MenuItem value="column-matching">
//                       Column Matching
//                     </MenuItem>
//                   </Select>
//                 </FormControl>
//               </div>
// {(question.type!='column-matching')&&

//   <div className="mb-2 mt-2">
//                 <FormControl
//                   fullWidth
//                   sx={{ fieldset: { legend: { maxWidth: "100%" } } }}
//                 >
//                   <InputLabel
//                     id={`correct-option-select-${questionIndex}`}
//                     inputlabelprops={{ shrink: true }}
//                   >
//                     Select Correct Option
//                   </InputLabel>
//                   <Select
//                     labelId={`correct-option-select-${questionIndex}`}
//                     id={`correct-option-select-${questionIndex}`}
//                     value={question.correctAnswer}
//                     onChange={(e) =>{
                      
//                       setcorrectquestion(e, questionIndex)
//                     } }
//                     required
//                     className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                     name="correctAnswer"
//                   >
//                     {question.options.map((option, index) => (
//                       <MenuItem key={index} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </div>

// }
            

//               <div className="add-question-options">
//                 {question.type === "yes-no" ? (
//                   <>
//                     <Divider className="m-3" />
//                     <Typography className="m-0 text-xl">
//                       Options visible to user:
//                     </Typography>
//                     <FormGroup className="justify-center flex-nowrap flex flex-row">
//                       {["✅ Yes", "❌ No"].map((emoji, index) => (
//                         <Card
//                           key={index}
//                           className="flex justify-center px-4 py-4 m-2 cursor-default border-solid border-slate-400"
//                         >
//                           <Typography className="m-0 text-3xl">
//                             {emoji}
//                           </Typography>
//                         </Card>
//                       ))}
//                     </FormGroup>
//                   </>
//                 ) : question.type === "column-matching" ? (
//                   <>
//                     <h3 className="text-xl font-medium text-gray-800 mb-4">
//                       Column Matching
//                     </h3>
//                     <div className="column-matching">
//                       <div className="column-a">
//                         <h4>Column A</h4>
//                         {question.columnA.map((item, index) => (
//                           <FormGroup key={index}>
//                             <Input
//                               type="text"
//                               placeholder={`Column A ${index + 1}`}
//                               value={item}
//                               onChange={(e) =>
//                                 handleColumnAChange(e, questionIndex, index)
//                               }
//                               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
//                             />
//                             {question.columnA.length > 1 && (
//                               <Button
//                                 type="button"
//                                 onClick={() =>
//                                   {handleRemoveColumnA(questionIndex, index)
                                  
//                                     handleRemoveColumnB(questionIndex, index)
//                                   }}
//                                 className="remove-btn bg-red-500 text-white font-semibold py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 mb-2"
//                               >
//                                 Remove
//                               </Button>
//                             )}
//                           </FormGroup>
//                         ))}
//                         <Button
//                           type="button"
//                           onClick={() => {handleAddColumnA(questionIndex)

//                             handleAddColumnB(questionIndex)
//                           }}
//                           className="add-btn bg-green-500 text-white font-semibold py-1 px-4 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600 mb-2"
//                         >
//                           Add Column A
//                         </Button>
//                       </div>
//                       <div className="column-b">
//                         <h4>Column B</h4>
//                         {question.columnB.map((item, index) => (
//                           <FormGroup key={index}>
//                             <Input
//                               type="text"
//                               placeholder={`Column B ${index + 1}`}
//                               value={item}
//                               onChange={(e) =>
//                                 handleColumnBChange(e, questionIndex, index)
//                               }
//                               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
//                             />
                           
//                           </FormGroup>
//                         ))}
                       
//                       </div>
//                     </div>
//                     <h4>Match Columns</h4>
//                     {question.columnA.map((itemA, indexA) => (
//                       <FormGroup key={indexA}>
//                         <Input
//                           type="text"
//                           value={itemA}
//                           readOnly
//                           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
//                         />
//                         <Select
//                           value={question.columnMatch[itemA] || ""}
//                           onChange={(e) =>
//                             handleColumnMatchChange(e, questionIndex, itemA)
//                           }
//                           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
//                         >
//                           {question.columnB
//                             .filter(
//                               (itemB) =>
//                                 !Object.values(question.columnMatch).includes(
//                                   itemB
//                                 ) || itemB === question.columnMatch[itemA]
//                             )
//                             .map((itemB, indexB) => (
//                               <MenuItem key={indexB} value={itemB}>
//                                 {itemB}
//                               </MenuItem>
//                             ))}
//                         </Select>
//                       </FormGroup>
//                     ))}
//                   </>
//                 ) : (
//                   <>
//                     <h3 className="text-xl font-medium text-gray-800 mb-4">
//                       Options
//                     </h3>
//                     {question.options.map((option, optionIndex) => (
//                       <FormGroup key={optionIndex}>
//                         <Input
//                           type="text"
//                           name="option"
//                           placeholder={`Option ${optionIndex + 1}`}
//                           value={option}
//                           onChange={(e) =>
//                             handleOptionChange(e, questionIndex, optionIndex)
//                           }
//                           className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
//                         />
//                         {question.type === "multiple-img-choice" && (
//                           <Input
//                             type="file"
//                             onChange={(e) =>
//                               handleImageChange(e, questionIndex, optionIndex)
//                             }
//                             required
//                             className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
//                           />
//                         )}
//                         {question.options.length !== 1 && (
//                           <Button
//                             type="button"
//                             onClick={() =>
//                               handleRemoveOption(questionIndex, optionIndex)
//                             }
//                             className="remove-btn bg-red-500 text-white font-semibold py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 mb-2"
//                           >
//                             Remove
//                           </Button>
//                         )}
//                       </FormGroup>
//                     ))}
//                     <Button
//                       type="button"
//                       onClick={() => handleAddOption(questionIndex)}
//                       className="add-btn bg-green-500 text-white font-semibold py-1 px-4 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600 mb-2"
//                     >
//                       Add Option
//                     </Button>
//                   </>
//                 )}
//               </div>

//               <div className="mt-4">
//                 <Typography variant="h6">
//                   Upload {question.mediaType.toUpperCase()}
//                 </Typography>
//                 <RadioGroup
//                   row
//                   value={question.mediaType}
//                   onChange={(e) => handleQuestionChange(e, questionIndex)}
//                   name="mediaType"
//                 >
//                   <FormControlLabel
//                     value="image"
//                     control={<Radio />}
//                     label="Image"
//                   />
//                   <FormControlLabel
//                     value="video"
//                     control={<Radio />}
//                     label="Video"
//                   />
//                 </RadioGroup>
//                 <input
//                   type="file"
//                   accept={
//                     question.mediaType === "image"
//                       ? "image/png, image/jpeg"
//                       : "video/*"
//                   }
//                   multiple={question.mediaType === "image"}
//                   onChange={(e) => handleImageChange(e, questionIndex)}
//                   className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div className="text-center">
//                 <Button
//                   type="button"
//                   onClick={() => handleRemoveQuestion(questionIndex)}
//                   className="remove-question-btn bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-4"
//                 >
//                   Remove Question
//                 </Button>
//               </div>

//               <Divider className="my-4" />
//             </div>
//           ))}

//           <div className="text-center">
//             <Button
//               type="button"
//               onClick={handleAddQuestion}
//               className="add-question-btn bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4"
//             >
//               Add Another Question
//             </Button>
//           </div>

//           <div className="text-center">
//             <Button
//               type="submit"
//               className="submit-btn bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-4"
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </Button>
//           </div>
//         </form>
//         <ToastContainer />
//       </div>
//     </StyledQuestion>
//   );
// };

// export default CreateGamification;

