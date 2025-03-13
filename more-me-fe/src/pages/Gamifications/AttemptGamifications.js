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
import { getCompanyGamifications, updateUserGamification, getUserGamifications, getAllCategories, getSubCategories, getGamesBySubCategory } from "src/api";
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
import { Divider } from "@mui/material";


const AttemptGamifications = (props) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryData,setSelectCategoryData]=useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [points, setPoints] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [retryTime, setRetryTime] = useState(null);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();
  const [completedCategories, setCompletedCategories] = useState([]);
  const [gamesBySubCategory, setGamesBySubCategory] = useState({}); // Store games by subcategory ID
  const [categories, setCategories] = useState([]);
  const [QuestionCategories, setQuestionCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const fetchCompanyQuestions = async () => {
    try {
      const questionsResponse = await getCompanyGamifications(storedUserData.token, storedUserData.user.companyId);
      console.log("questionsResponse : ", questionsResponse);
      setQuestionCategories(questionsResponse?.data?.categories);

      const userGamificationResponse = await getUserGamifications(storedUserData.token, storedUserData.user.id);
      const completedCategoriesFromServer = userGamificationResponse.data.gamification || [];
      setPoints(userGamificationResponse.data.points);
      console.log("userGamificationResponse.data.points", userGamificationResponse.data.points);
      setCompletedCategories(completedCategoriesFromServer);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

   const fetchGamesForSubCategory = async (subCategoryId) => {
          try {
            const response = await getGamesBySubCategory(subCategoryId);
            if (response?.data) {
              console.log("getGamesBySubCategory : ", response);
              setGamesBySubCategory((prevState) => ({
                ...prevState,
                [subCategoryId]: response.data, // Save games by subcategory ID
              }));
            }
          } catch (error) {
            console.error('Failed to fetch games for subcategory:', error);
          }
        };
  const fetchCategories = async () => {
      try {
        const response = await getAllCategories(storedUserData.company.id);
        if (response?.data) {
          setCategories(response.data);
          for (const category of response.data) {
            fetchSubCategories(category.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

     const fetchSubCategories = async (categoryId) => {
        try {
          const response = await getSubCategories(categoryId);
          for (const subcategory of response.data) {
            await  fetchGamesForSubCategory(subcategory.id);
            }
          console.log("getSubCategories : ", response);
          setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));
        } catch (err) {
          console.error("Failed to fetch subcategories");
        }
      };
    

  useEffect(() => {
    fetchCategories();
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
    const selectedCategoryData = QuestionCategories.find(category => category.id == categoryId);
    setSelectCategoryData(selectedCategoryData);
    console.log("selectedCategoryData : ",selectedCategoryData);
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
    console.log("questions", questions[questionCount]);
  
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
  
    // Calculate points based on the selected answers
    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "multiple-img-choice") {
      let find = false;
      selectedAnswer.forEach((selected) => {
        const optionPoint = currentQuestion.optionPoints[selected] || 0; // Get points for selected option
    
        if (Array.isArray(currentQuestion.correctOption)) {
          // Check if selected answer is in the correct options list
          if (currentQuestion.correctOption.some((correct) => correct.toLowerCase() === selected.toLowerCase())) {
            updatedPoints += optionPoint; // Add dynamic points
            find =true;
          }
        } else {
          if (currentQuestion.correctOption.toLowerCase() === selected.toLowerCase()) {
            updatedPoints += optionPoint;
            find =true;
          }
        }
      });
      if(!find)
      {
        wrongAnswers += 1;
      }
    } else if (currentQuestion.type === "single-choice") {
      if (answer1 !== undefined) {
        const optionPoint = currentQuestion.optionPoints[answer1] || 0; // Get points from optionPoints
    
        if (Array.isArray(currentQuestion.correctOption)) {
          // If multiple correct options exist
          if (currentQuestion.correctOption.some((correct) => correct.toLowerCase() === answer1.toLowerCase())) {
            updatedPoints += optionPoint; // Add dynamic points
          }
          else
        {
          wrongAnswers += 1;
        }
        } else {
          if (answer1.toLowerCase() === currentQuestion.correctOption.toLowerCase()) {
            updatedPoints += optionPoint;
          }
          else
        {
          wrongAnswers += 1;
        }
        }
      }
    }
    else if (currentQuestion.type === "yes-no") {
      if (selected !== undefined) {
        const optionPoint = currentQuestion.optionPoints[selected] || 0; // Get points from optionPoints
    
        if (currentQuestion.correctOption.includes(selected)) {
          updatedPoints += optionPoint; // Add dynamic points from optionPoints
         
        }
        else
        {
          toast.error("Wrong Answer : ",selected);
          wrongAnswers += 1;
        }
      }
    }
     else if (currentQuestion.type === "column-matching") {
      let isCorrect = true;
      for (const key in currentQuestion.columnMatching) {
        if (answer1[key] !== currentQuestion.columnMatching[key]) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect) {
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
    setShowCorrectAnswer(true); // Show correct answer
  
    setTimeout(() => {
      setShowCorrectAnswer(false); // Hide correct answer when moving to next question
    }, 2000);
  
    if (wrongAnswers >= halfQuestions && !selectedCategoryData.canProceedToNextLevel) {
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
  
    setSelectedAnswer([]);
    setTimeout(() => {
      setQuestionCount(questionCount + 1);
      setShowCorrectAnswer(false);
    }, 2000);
  
    if (questions?.length - 1 <= questionCount) {
      try {
        setCompletedCategories([completedCategories, selectedCategory]);
        await updateUserGamification(selectedCategory, updatedPoints);
        await fetchCompanyQuestions();
        toast.success("Category completed successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const userGamificationResponse = await getUserGamifications(storedUserData.token, storedUserData.user.id);
        const completedCategoriesFromServer = userGamificationResponse.data.gamification || [];
        setPoints(userGamificationResponse.data.points);
        setCompletedCategories(completedCategoriesFromServer);
        setTimeout(() => {
          setQuestionCount(0);
          setSelectedAnswer([]);
          setIsAnswering(false);
          setSelectedCategory(null);
        }, 2000);
      } catch (error) {
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
    }
  };
  
  const goToDashboard = () => {
    localStorage.setItem(QUESTIONS_ANSWERED, true);
    navigate("/dashboard/app");
  };
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
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
          subcategories={subcategories}
          QuestionCategories= {QuestionCategories}
          Games ={gamesBySubCategory}
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

          {
  questions.length == 0 ? (
    <div 
      style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h7" style={{ whiteSpace: 'pre-line' }}>
        No Question Available for this Level, Coming Soon
      </Typography>
    </div>
  ) : (
    <>
      {
        questions[questionCount]?.media ? (
          // Display video if media is available
          <video className="video-container" width="800" height="200" controls>
            <source src={questions[questionCount].media} />
            Your browser does not support the video tag.
          </video>
        ) : questions[questionCount]?.image?.length > 0 ? (
          // If images are available, check if there are multiple images or just one
          questions[questionCount].image.length > 1 ? (
            <div className="slider-container">
              <Slider {...settings}>
                {questions[questionCount].image.map((img, index) => (
                  <div key={index} className="slider-item" style={{ height: 500 }}>
                    <img height={500} src={img} alt={`Question Image ${index}`} />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <img
              className="question-image"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid #4CAF50", // ✅ Green border
                borderRadius: "10px",
                padding: "10px", // ✅ Add some space inside the border
                maxWidth: "1200px",
                margin: "auto",
              }}
              src={questions[questionCount]?.image[0]} // Assuming `image` is an array
              alt="Question"
            />
          )
        ) : selectedCategoryData?.video ? (
          <video className="video-container" width="800" height="200" controls>
            <source src={selectedCategoryData.video} />
            Your browser does not support the video tag.
          </video>
        ) : (() => {
          let images = selectedCategoryData?.images || "[]";
          try {
            images = JSON.parse(images);
            if (!Array.isArray(images)) {
              images = [images]; // Convert single string to an array
            }
          } catch (error) {
            images = []; // Default to an empty array if parsing fails
          }

          return images.length > 1 ? (
            <div className="slider-container">
              <Slider {...settings}>
                {images.map((img, index) => (
                  <div key={index} className="slider-item" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img
                      src={img}
                      alt={`Category Image ${index}`}
                      style={{ maxWidth: "400px", width: "50%", height: "50%", margin: "auto", borderRadius: "10px" }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : images.length === 1 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid #4CAF50", // ✅ Green border
                borderRadius: "10px",
                padding: "10px", // ✅ Add some space inside the border
                maxWidth: "1200px",
              }}
            >
              <img
                src={images[0]}
                alt="Category Image"
                style={{
                  maxWidth: "100%",
                  width: "50%",
                  height: "auto",
                  borderRadius: "10px",
                }}
              />
            </div>
          ) : null;
        })()
      }

      {/* Description Section */}
      <div 
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h7" style={{ whiteSpace: 'pre-line' }}>
          {questions[questionCount]?.description?.trim()
            ? questions[questionCount].description
            : selectedCategoryData?.description || ""}
        </Typography>
      </div>
    </>
  )
}

    

           <Divider sx={{ m: 3 }} />  {/* This adds a margin around the divider */}
          {questions[questionCount] && questions[questionCount].type === "single-choice" && (
            <Card sx={{ m: 3 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {questions[questionCount].options.map((option, index) => (
                    <FormControlLabel
                    sx={{ m: 3 }}
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option || "No Label"}
                    />
                  ))}
                </RadioGroup>

                {showCorrectAnswer && (
  <Typography variant="h6" sx={{ color: "green", fontWeight: "bold", mt: 2 }}>
    ✅ Correct Answer: {questions[questionCount]?.correctOption}
  </Typography>
)}
                <Button sx={{ m: 3 }} className="answer-button" variant="contained" onClick={() => submitAnswer(selected)}>
                {questionCount === questions.length - 1?" Submit Answer":"Next Question"} 
                </Button>
              </FormControl>
            </Card>
          )}

          {questions[questionCount] && questions[questionCount].type === "multiple-choice" && (
            <Card sx={{ m: 3 }}>
              <FormGroup>
                {questions[questionCount].options.map((option, index) => (
                  <FormControlLabel
                  sx={{ m: 3 }}
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
              {showCorrectAnswer && (
  <Typography variant="h6" sx={{ color: "green", fontWeight: "bold", mt: 2 }}>
    ✅ Correct Answer: {questions[questionCount]?.correctOption}
  </Typography>
)}
                <Button sx={{ m: 3 }} className="answer-button" variant="contained" onClick={() => submitAnswer(selectedOptions.map((option, index) => option && JSON.stringify(questions[questionCount].options[index])).filter(Boolean))}>
                {questionCount === questions.length - 1?" Submit Answer":"Next Question"} 
                </Button>
              </div>
            </Card>
          )}

          {questions[questionCount] && questions[questionCount].type === "multiple-img-choice" && (
            <Card sx={{ m: 3 }} >
              <FormGroup sx={{ m: 3 }}>
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

              {showCorrectAnswer && (
  <Typography variant="h6" sx={{ color: "green", fontWeight: "bold", mt: 2 }}>
    ✅ Correct Answer: {questions[questionCount]?.correctOption}
  </Typography>
)}
                <Button className="answer-button" variant="contained" onClick={() => submitAnswer(selectedOptions.map((option, index) => option && JSON.stringify(questions[questionCount].options[index])).filter(Boolean))}>
                {questionCount === questions.length - 1?" Submit Answer":"Next Question"} 
                </Button>
              </div>
            </Card>
          )}

          {questions[questionCount] && questions[questionCount].type === "yes-no" &&
            <Card sx={{ m: 3 }}>
              <center>
                <FormControl sx={{ m: 3 }} component="fieldset">
                  <RadioGroup
                    aria-label="quiz"
                    name="quiz"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
                <div>
                {showCorrectAnswer && (
  <Typography variant="h6" sx={{ color: "green", fontWeight: "bold", mt: 2 }}>
    ✅ Correct Answer: {questions[questionCount]?.correctOption}
  </Typography>
)}
                  <Button className="answer-button" variant="contained" onClick={() => submitAnswer(selected)}>
                  {questionCount === questions.length - 1?" Submit Answer":"Next Question"} 
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
