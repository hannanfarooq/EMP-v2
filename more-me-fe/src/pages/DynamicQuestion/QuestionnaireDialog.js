import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControl, RadioGroup, FormControlLabel, Checkbox, Card, FormGroup } from '@mui/material';
import { createUserAttemptQuestionnaire } from 'src/api';
import { toast } from 'react-toastify';
import { QUESTIONS_ANSWERED, question_emojies } from "src/utils/baseURL";
import { StyledQuestion } from "../Questions/Question.styled";

const QuestionnaireDialog = ({ open, onClose, storedUserData, questions, questionnaireId, setCompletedQuestionnaires }) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) {
      setQuestionCount(0);
      setUserAnswers([]);
      setSelectedOptions(new Array(questions.length).fill(false));
      setSelectedAnswer([]);
      setSelected(null);
    }

  }, [open, questions]);

  const handleOnChange = (position) => {
    const updatedOption = selectedOptions.map((item, index) => index === position ? !item : item);
    setSelectedOptions(updatedOption);
  };

  const handleCheckboxChange = (option) => {
    const isSelected = selectedAnswer.includes(option);
    const updatedAnswers = isSelected
      ? selectedAnswer.filter(item => item !== option)
      : [...selectedAnswer, option];

    setSelectedAnswer(updatedAnswers);

    if (updatedAnswers.length === 0) {
      toast.error("Please select at least one option.", { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true });
    }
  };

  const submitAnswer = async (answer1) => {
    const currentQuestion = questions[questionCount];

    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "multiple-img-choice") {
      if (selectedAnswer.length === 0) {
        toast.error("Please select at least one option.", { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true });
        return;
      }
    } else if (currentQuestion.type === "single-choice") {
      if (selected === null) {
        toast.error("Please select at least one option.", { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true });
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

    setUserAnswers([...userAnswers, answer]);

    if (questionCount + 1 < questions.length) {
      setQuestionCount(questionCount + 1);
      setSelectedAnswer([]);
    } else {
      try {
        const data = {
          ...storedUserData.user,
          questionare: { answers: [...userAnswers, answer] },
        };
        const questionnareData = data.questionare;
        
        questionnareData.answers = questionnareData.answers.map((answer, index) => ({
            ...answer,
            id: index + 1,
        }));
        
        const jsonString = JSON.stringify(questionnareData, null, 2);
        await createUserAttemptQuestionnaire(storedUserData.company.id, storedUserData.user.id, questionnaireId, storedUserData.token, questionnareData);
        
        setCompletedQuestionnaires(prev => [...prev, questionnaireId]);
        //handleClose();
        window.location.reload();
      } catch (error) {
        console.error("Error submitting questionnaire: ", error);
      }
    }
  };

  const handleOptionSelect = (option) => {
    if (questions[questionCount].type === "emoji" || questions[questionCount].type === "yes-no") {
      submitAnswer(option);
    } else {
      setSelected(option);
    }
  };

  const otherQuestionsType = (type, option = null) => {
    return (
      <>
        {type === "emoji" && (
          <FormGroup className="justify-center flex-nowrap flex flex-row">
            {question_emojies.map((emoji) => (
              <Card key={emoji.name} onClick={() => handleOptionSelect(emoji.name)} className="flex justify-center px-4 py-4 m-2 cursor-pointer border-solid border-slate-400">
                <Typography className="m-0 text-3xl">{emoji.name}</Typography>
              </Card>
            ))}
          </FormGroup>
        )}
        {type === "yes-no" && (
          <FormGroup className="justify-center flex-nowrap flex flex-row">
            {["✅ Yes", "❌ No"].map((option) => (
              <Card key={option} onClick={() => handleOptionSelect(option)} className="flex justify-center px-4 py-4 m-2 cursor-pointer border-solid border-slate-400">
                <Typography className="m-0 text-3xl">{option}</Typography>
              </Card>
            ))}
          </FormGroup>
        )}
        {type === "multiple-img-choice" && (
          <div className="w-[358px]">
            <Card className="flex items-center p-4 m-2">
              <img width={"50px"} height="50px" className="rounded-full" src={JSON.parse(option)?.img} alt="option" />
              <Typography className="ml-4">{JSON.parse(option)?.text}</Typography>
              <FormControlLabel
                onChange={(event) => handleCheckboxChange(option)}
                checked={selectedAnswer.includes(option)}
                value={option}
                className="ml-auto"
                control={<Checkbox />}
              />
            </Card>
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h3">Fill the Questionnaire</DialogTitle>
      <DialogContent>
        <StyledQuestion>
          {!questions.length ? (
            <div className="no-content">No questions available</div>
          ) : (
            <div className="text-center mt-5">
              {questions[questionCount]?.image && (
                <div className="w-4/12 m-auto">
                  <img src={questions[questionCount]?.image} alt="Question" width="50%" />
                </div>
              )}
              <div className="mt-5">
                <Typography variant="h5" style={{ textAlign: 'left' }}>{questions[questionCount].text}</Typography>
              </div>
              <div className="options mt-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {questions[questionCount].options.map((item, index) => {
                  if (questions[questionCount].type === "multiple-choice") {
                    return (
                      <FormControl key={index} style={{ width: '100%' }}>
                        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue={item} name="radio-buttons-group" style={{ flexDirection: 'column' }}>
                          <FormControlLabel
                            onChange={(event) => handleCheckboxChange(item)}
                            checked={selectedAnswer.includes(item)}
                            className="text-s"
                            value={item}
                            control={<Checkbox />}
                            label={<Typography style={{ textAlign: 'left', width: '100%' }}>{item}</Typography>}
                          />
                        </RadioGroup>
                      </FormControl>
                    );
                  } else if (questions[questionCount].type === "single-choice") {
                    return (
                      <div key={index} style={{ width: '100%' }}>
                        <label style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <input style={{ cursor: "pointer" }} type="radio" name="options" value={item} checked={selected === item} onChange={() => handleOptionSelect(item)} />
                          <Typography style={{ textAlign: 'left', marginLeft: '8px' }}>{item}</Typography>
                        </label>
                      </div>
                    );
                  } else {
                    return otherQuestionsType(questions[questionCount].type, item);
                  }
                })}
                {(questions[questionCount].type === "multiple-choice" || questions[questionCount].type === "multiple-img-choice" || questions[questionCount].type === "single-choice") && (
                  <Button className="m-2 mt-2 p-1" onClick={() => submitAnswer()} float="right">
                    {questionCount + 1 < questions.length ? "Next" : "Submit"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </StyledQuestion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionnaireDialog;