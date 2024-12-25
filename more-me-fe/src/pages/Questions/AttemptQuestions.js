import React, { useState, useEffect } from "react";
import { StyledQuestion } from "./Question.styled";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { getCompanyQuestions, updateUserQuestionnaire } from "src/api";
import { useNavigate } from "react-router-dom";
import { QUESTIONS_ANSWERED, question_emojies } from "src/utils/baseURL";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const AttemptQuestions = (props) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  const fetchCompanyQuestions = async () => {
    try {
      const questionsResponse = await getCompanyQuestions(
        storedUserData.token,
        storedUserData.user.companyId
      );
      if (!questionsResponse?.data?.questions?.length) {
        goToDashboard();
      }
      setQuestions(questionsResponse?.data?.questions);
      localStorage.setItem('categories', JSON.stringify(questionsResponse.data.categories))
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  useEffect(() => {
    fetchCompanyQuestions();
  }, []);

  const handleOnChange = (position) => {
    const updatedOption = selectedOptions.map((item, index) =>
      index === position ? !item : item
    );
    setSelectedOptions(updatedOption);
  };

  const submitAnswer = async (answer1) => {
    if (questions[questionCount].type === "multiple-choice" || questions[questionCount].type === "multiple-img-choice") {
      if (selectedAnswer.length === 0) {
        toast.error("Please select at least one option.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    if (questions[questionCount].type === "single-choice") {
      if (selected === null) {
        toast.error("Please select at least one option.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      answer1 = selected;
      setSelected(null);
    }

    const currentQuestion = questions[questionCount];
    const answer = {
      id: currentQuestion.id,
      type: currentQuestion.type,
      title: currentQuestion.text,
      selectedOption: answer1 ? answer1 : selectedAnswer,
    };

    userAnswers.push(answer);
    // setUserAnswers((prevAnswers) => ({
    //   ...prevAnswers,
    //   [currentQuestion.id]: answer,
    // }));

    setQuestionCount(questionCount + 1);

    if (questions?.length - 1 <= questionCount) {
      try {
        const data = {
          ...storedUserData.user,
          questionare: {
            answer: userAnswers,
          },
        };
        const questionsResponse = updateUserQuestionnaire(
          data,
          storedUserData.token
        );
        goToDashboard();
        return;
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
      goToDashboard();
    }
  };

  const goToDashboard = () => {
    localStorage.setItem(QUESTIONS_ANSWERED, true);
    navigate("/dashboard/app");
  };

  const otherQuestionsType = (type, option = null) => {
    return (
      <>
        {type === "emoji" && (
          <>
            <FormGroup className="justify-center flex-nowrap flex flex-row">
              {question_emojies.map((emoji) => (
                <Card
                  key={emoji.name}
                  onClick={() => {
                    setSelectedAnswer([emoji.name]);
                    submitAnswer(emoji.name);
                  }}
                  className="flex justify-center px-4 py-4 m-2 cursor-pointer border-solid border-slate-400"
                >
                  <Typography className="m-0 text-3xl">{emoji.name}</Typography>
                </Card>
              ))}
            </FormGroup>
          </>
        )}

        {type === "yes-no" && (
          <>
            <FormGroup className="justify-center flex-nowrap flex flex-row">
              {["✅ Yes", "❌ No"].map((emoji) => (
                <Card
                  key={emoji}
                  onClick={() => {
                    setSelectedAnswer([emoji]);
                    submitAnswer(emoji);
                  }}
                  className="flex justify-center px-4 py-4 m-2 cursor-pointer border-solid border-slate-400"
                >
                  <Typography className="m-0 text-3xl">{emoji}</Typography>
                </Card>
              ))}
            </FormGroup>
          </>
        )}

        {(type == "multiple-img-choice") && (
          <div className='w-[358px]'>
            {(
              <Card className='flex items-center p-4 m-2' >
                <img width={'50px'} height='50px' className='rounded-full' src={JSON.parse(option)?.img} />
                <Typography className='ml-4'>{JSON.parse(option)?.text}</Typography>
                <FormControlLabel
                  onChange={(event) => {
                    const answer = selectedAnswer.find(
                      (element) => element === option
                    );
                    if (!answer) {
                      const previous = [...selectedAnswer];
                      previous.push(option);
                      setSelectedAnswer(previous);
                    }
                  }}
                  value={option}
                  className='ml-auto'
                  control={<Checkbox />}
                />
              </Card>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <StyledQuestion>
      {!questions.length ? (
        <div className="no-content">No question</div>
      ) : (
        <>
          <div
            cardSize="50%"
            margin="10px auto"
            cursor="default"
            className="text-center mt-5"
          >
            {questions[questionCount]?.image && (
              <div className="w-4/12 m-auto">
                <img src={questions[questionCount]?.image} alt="Question" width="50%" />
              </div>
            )}

            <div className="mt-5">
              <span>
                <Typography variant="h3">
                  {questions[questionCount].text}
                </Typography>
              </span>
            </div>

            <div className="options">
              <h5>Options:</h5>

              <div className="grid justify-center">
                {questions[questionCount].options.map((item, index) => {
                  if (questions[questionCount].type === "multiple-choice") {
                    return (
                      <FormControl key={index}>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue={item}
                          name="radio-buttons-group"
                        >
                          <FormControlLabel
                            onChange={(event) => {
                              const answer = selectedAnswer.find(
                                (element) => element === item
                              );
                              if (!answer) {
                                const previous = [...selectedAnswer];
                                previous.push(item);
                                setSelectedAnswer(previous);
                              }
                            }}
                            className="text-s"
                            value={item}
                            control={<Checkbox />}
                            label={item}
                          />
                        </RadioGroup>
                      </FormControl>
                    );
                  } else if (
                    questions[questionCount].type === "single-choice"
                  ) {
                    return (
                      <div key={index}>
                        <label>
                          <input
                            type="radio"
                            name="options"
                            value={item}
                            checked={selected === item}
                            onChange={() => {
                              setSelected(item);
                            }}
                          />
                          {item}
                        </label>
                      </div>
                    );
                  } else {
                    return otherQuestionsType(questions[questionCount].type, item);
                  }
                })}

                {(questions[questionCount].type === "multiple-choice" || questions[questionCount].type === "multiple-img-choice" ||
                  questions[questionCount].type === "single-choice") && (
                    <Button
                      variant="contained"
                      className="m-2 mt-2 p-1"
                      onClick={() => submitAnswer()}
                      float="right"
                    >
                      Next
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </>
      )}
    </StyledQuestion>
  );
};

export default AttemptQuestions;
