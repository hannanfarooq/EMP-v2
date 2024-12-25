import React, { useState, useEffect } from "react";
import { StyledQuestion } from "./Question.styled";
import Slider from "react-slick";
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
import { getCompanyGamifications, updateUserGamification, getUserGamifications } from "src/api";
import { Navigate, useNavigate } from "react-router-dom";
import { QUESTIONS_ANSWERED, question_emojies } from "src/utils/baseURL";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryCards from './CategoryCards';
import './SliderStyles.css';
import Icon from "src/components/color-utils/Icon";
import Iconify from "src/components/iconify";
import ColumnMatching from "./ColumnMatching";
import Questions from "../Questions";

const AttemptGamifications = (props) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [points, setPoints] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [retryTime, setRetryTime] = useState(null);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();
  const [completedCategories, setCompletedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  const fetchCompanyQuestions = async () => {
    try {
      const questionsResponse = await getCompanyGamifications(storedUserData.token, storedUserData.user.companyId);

      const categories = questionsResponse.data.categories;
      setCategories(categories);
      const userGamificationResponse = await getUserGamifications(storedUserData.token, storedUserData.user.id);
      const completedCategoriesFromServer = userGamificationResponse.data.gamification || [];
      setPoints(userGamificationResponse.data.points);
      console.log("userGamificationResponse.data.points", userGamificationResponse.data.points);
      setCompletedCategories(completedCategoriesFromServer);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  useEffect(() => {
    const storedRetryTime = localStorage.getItem(storedUserData.user.id);

    if (storedRetryTime) {
      setRetryTime(new Date(storedRetryTime));
    }
    fetchCompanyQuestions();
  }, []);

  useEffect(() => {

    if (retryTime && new Date() < retryTime && !toastShown) {
      const remainingMinutes = Math.ceil((retryTime - new Date()) / 60000);
      toast.error(`Please wait for ${remainingMinutes} minutes before trying again.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setToastShown(true);
    }
    if (retryTime) {
      const interval = setInterval(() => {
        if (new Date() >= retryTime) {
          setRetryTime(null);
          localStorage.removeItem('retryTime');
          toast.success("You can now attempt the questions again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [retryTime]);

  const handleCategorySelect = async (categoryId) => {
    if (retryTime && new Date() < retryTime) {
      const remainingMinutes = Math.ceil((retryTime - new Date()) / 60000);
      toast.error(`Please wait for ${remainingMinutes} minutes before trying again.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setSelectedCategory(categoryId);
    setIsAnswering(true);
    const questionsResponse = await getCompanyGamifications(storedUserData.token, storedUserData.user.companyId);
    const questions = questionsResponse.data.gamifications.filter(
      (question) => question.questionCategoryId === categoryId
    );
    console.log("questions", questions);
    setQuestions(questions);
  };

  const handleOnChange = (position) => {
    const updatedOption = selectedOptions.map((item, index) =>
      index === position ? !item : item
    );
    setSelectedOptions(updatedOption);
  };

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const submitAnswer = async (answer1) => {
    console.log("answer1", answer1);
    const currentQuestion = questions[questionCount];
    console.log("questions", questions[questionCount])

    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "multiple-img-choice") {
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

    if (currentQuestion.type === "single-choice") {
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

    const answer = {
      id: currentQuestion.id,
      type: currentQuestion.type,
      title: currentQuestion.text,
      selectedOption: answer1 ? answer1 : selectedAnswer,
    };

    console.log("selectedAnswer", selectedAnswer);
    console.log("answer1", answer1);
    console.log("currentQuestion.correctOption", currentQuestion.correctOption);

    let updatedPoints = points;
    let wrongAnswers = 0;

    // Calculate points
    if (currentQuestion.type === "multiple-choice") {
      selectedAnswer.forEach((obj) => {
        if (isJsonString(obj)) {
          let jsonString = JSON.parse(obj);
          if (currentQuestion.correctOption.toLowerCase() === jsonString?.text.toLowerCase()) {
            updatedPoints += 10;

          } else {
            updatedPoints -= 10;
            wrongAnswers += 1;
          }
        } else {
          if (currentQuestion.correctOption.toLowerCase() === obj.toLowerCase()) {
            updatedPoints += 10;
          } else {
            updatedPoints -= 10;
            wrongAnswers += 1;
          }
        }
      });
    } else if (currentQuestion.type === "single-choice") {
      console.log("ur ans:", answer1);
      console.log("correct ans: ", currentQuestion.correctOption)
      if (answer1 !== undefined) {
        if (answer1.toLowerCase() === currentQuestion.correctOption.toLowerCase()) {
          updatedPoints += 10;
        } else {
          updatedPoints -= 10;
          wrongAnswers += 1;
        }
      }
    } else if (currentQuestion.type === "multiple-img-choice") {
      console.log("IMG CHOICE ", selectedAnswer);
      selectedAnswer.forEach((obj) => {
        if (isJsonString(obj)) {
          let jsonString = JSON.parse(obj);
          if (currentQuestion.correctOption.toLowerCase() === jsonString?.text.toLowerCase()) {
            updatedPoints += 10;
          } else {
            updatedPoints -= 10;
            wrongAnswers += 1;
          }
        } else {
          if (currentQuestion.correctOption.toLowerCase() === obj.toLowerCase()) {
            updatedPoints += 10;
          } else {
            updatedPoints -= 10;
            wrongAnswers += 1;
          }
        }
      });
    } else if (currentQuestion.type === "yes-no") {
      if (answer1 !== undefined) {
        if (answer1.toLowerCase() === currentQuestion.correctOption.toLowerCase()) {
          updatedPoints += 10;
        } else {
          updatedPoints -= 10;
          wrongAnswers += 1;
        }
      }
    } else if (currentQuestion.type === "column-matching") {
      console.log("REAL ANWSER", currentQuestion.columnMatching);
      console.log("SELECTED AWNSER", answer1);

      let isCorrect = true;
      for (const key in currentQuestion.columnMatching) {
        if (answer1[key] !== currentQuestion.columnMatching[key]) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect) {
        console.log("AWNSER IS CORRECT");
        updatedPoints += 10;
      } else {
        updatedPoints -= 10;
        wrongAnswers += 1;
      }
    }

    setPoints(updatedPoints);
    setWrongAnswersCount(wrongAnswers);
    userAnswers.push(answer);

    const halfQuestions = Math.ceil(questions.length / 2);

    if (wrongAnswers >= halfQuestions) {
      const retryAfterMinutes = 15;
      const retryDate = new Date();
      retryDate.setMinutes(retryDate.getMinutes() + retryAfterMinutes);
      setRetryTime(retryDate);
      localStorage.setItem(storedUserData.user.id, retryDate);


      toast.error(`You have answered Half of questions incorrectly. Please wait for ${retryAfterMinutes} minute(s) before trying again.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsAnswering(false);
      setSelectedCategory(null);
      return;
    }
    console.log("Running");
    setSelectedAnswer([]);
    setQuestionCount(questionCount + 1);
    if (questions?.length - 1 <= questionCount) {
      try {
        console.log("Running");
        console.log("POINTS IN TOTAL", points);
        console.log("SELECTED CATEGORY", selectedCategory);
        console.log("completedCategories", completedCategories)
        setCompletedCategories([completedCategories, selectedCategory]);
        console.log("SELECTED CATEGORY", selectedCategory);
        await updateUserGamification(selectedCategory, updatedPoints);

        toast.success("Category completed successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setQuestionCount(0);
        setSelectedAnswer([]);
        setIsAnswering(false);
        setSelectedCategory(null);
      } catch (error) {
        console.log("Error");
        console.error("Error updating user gamification: ", error);
        toast.error("Failed to update user gamification. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setQuestionCount(0);
      setSelectedAnswer([]);
      setIsAnswering(false);
      setSelectedCategory(null);
    }
  };
  const goToDashboard = () => {
    localStorage.setItem(QUESTIONS_ANSWERED, true);
    navigate("/dashboard/app");
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <StyledQuestion>
      {
        !isAnswering && (
          <Typography className="points-display" variant="h6">
            Points: {points}
          </Typography>
        )
      }
      {!isAnswering ? (

        <CategoryCards
          categories={categories}
          completedCategories={completedCategories}
          handleCategorySelect={handleCategorySelect}
        />
      ) : (
        <div>
          <center>
            <Typography className="points-display" variant="h6">
              Points: {points}
            </Typography>
            <Typography className="question-text" variant="h4">{questions[questionCount] && questions[questionCount].text}</Typography>
          </center>
          {questions[questionCount] && questions[questionCount]?.media ? (
            <video className="video-container" width="800" height="200" controls>
              <source src={questions[questionCount].media} />
              Your browser does not support the video tag.
            </video>
          ) : questions[questionCount] && questions[questionCount].image.length > 1 ? (
            <div className="slider-container">
              <Slider {...settings}>
                {questions[questionCount].image.map((img, index) => (
                  <div key={index} className="slider-item">
                    <img src={img} />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (

            <img className="question-image" src={questions[questionCount] && questions[questionCount].image} alt="Question" />

          )}
          {questions[questionCount] && questions[questionCount].type === "single-choice" && (
            <Card>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {questions[questionCount].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option || "No Label"}
                    />
                  ))}
                </RadioGroup>
                <Button className="answer-button" variant="contained" onClick={() => submitAnswer(selected)}>
                  Submit Answer
                </Button>
              </FormControl>
            </Card>
          )}

          {questions[questionCount] && questions[questionCount].type === "multiple-choice" && (
            <Card>
              <FormGroup>
                {questions[questionCount].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedOptions[index]}
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
                        value={JSON.stringify(option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
              <div>
                <Button className="answer-button" variant="contained" onClick={() => submitAnswer(selectedOptions.map((option, index) => option && JSON.stringify(questions[questionCount].options[index])).filter(Boolean))}>
                  Submit Answer
                </Button>
              </div>
            </Card>
          )}

          {questions[questionCount] && questions[questionCount].type === "multiple-img-choice" && (
            <Card>
              <FormGroup>
                {questions[questionCount].options.map((option, index) => (
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
                ))}
              </FormGroup>
              <div>


                <Button className="answer-button" variant="contained" onClick={() => submitAnswer(selectedOptions.map((option, index) => option && JSON.stringify(questions[questionCount].options[index])).filter(Boolean))}>
                  Submit Answer
                </Button>
              </div>
            </Card>
          )}

          {questions[questionCount] && questions[questionCount].type === "yes-no" &&
            <Card>
              <center>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="quiz"
                    name="quiz"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
                <div>
                  <Button className="answer-button" variant="contained" onClick={() => submitAnswer(selected)}>
                    Submit Answer
                  </Button>

                </div>
              </center>
            </Card>
          }

          {questions[questionCount] && questions[questionCount].type === "column-matching" && (
            <ColumnMatching
              question={questions[questionCount]}
              submitAnswer={submitAnswer} // Ensure this line is correct
            />
          )}

        </div>
      )}
    </StyledQuestion>
  );
};

export default AttemptGamifications;
