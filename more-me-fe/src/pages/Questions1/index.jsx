
// import { useState, useEffect } from "react";
// import { Box, Button } from "@mui/material";
// import { useNavigate } from 'react-router-dom';
// import { createStartUpQuestions, UpdateUserFromStartUpQuestions } from "src/api";
// import Q1 from "./Q1";
// import Q2 from "./Q2";
// import Q3 from "./Q3";
// import Q4 from "./Q4";
// import Q5 from "./Q5";
// import Q6 from "./Q6";
// import Q7 from "./Q7";
// import Q8 from "./Q8";
// import Q9 from "./Q9";
// import Q10 from "./Q10";
// import Q11 from "./Q11";
// import Q12 from "./Q12";
// import Q13 from "./Q13";
// import Q14 from "./Q14";
// import Q15 from "./Q15";
// import ProgressBar from './ProgressBar';
// import Logo from "../../assets/mainLogo.png";
// import { keyframes } from "@mui/system";
// import { ToastContainer, toast } from 'react-toastify';

// const zoomIn = keyframes`
//   from {
//     transform: scale(1);
//   }
//   to {
//     transform: scale(1.1);
//   }
// `;
// const validateDate = (date) => {
//   return !isNaN(Date.parse(date)) ? new Date(date).toISOString() : null;
// };
// const formatDate = (date) => {
//   return date ? new Date(date).toISOString() : null;
// };
// const Questions = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(0);
//   const totalSteps = 16;
//   const [questionNum, setQuestionNum] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

//   useEffect(() => {
//     console.log("Updated answers object outside setAnswers:", answers);
//     console.log("questionNum", questionNum);

//     if (questionNum === totalSteps) {
//       // Split answers into two separate objects
//       const prepareDataForUpdate = (answers) => ({
//         ...answers,
//         ageRange: answers.ageRange.replace(/\s+/g, ''), // Remove extra spaces for enum
//         dateOfBirth: formatDate(answers.dateOfBirth),
//         spouseDOB: formatDate(answers.spouseDOB),
//         hasChild: answers.hasChild === "yes",
//         userId: storedUserData.user.id,
//         companyId: storedUserData.user.companyId,
//       });
      
//       const finalAnswersPreference = prepareDataForUpdate(answers.preference);

//       const finalAnswerPersona = {
//         ...answers.persona,
//         userId: storedUserData.user.id,
//         companyId: storedUserData.user.companyId,
//       };
//       //console.log("finalAnswersPreference",finalAnswerPersona);
//       console.log("finalAnswerPersona",finalAnswersPreference);

//       const submitAnswers = async () => {
//         try {
//           await createStartUpQuestions(finalAnswerPersona, storedUserData.token);
//           await UpdateUserFromStartUpQuestions(finalAnswersPreference, storedUserData.token);
          
//           toast.success("Startup questions added successfully");
//           navigate('/DashBoard/app');
//         } catch (error) {
//           console.error("Failed to save answers", error);
//           toast.error("Failed to save answers");
//         }
//       };

//       submitAnswers();
//     }
//   }, [answers, questionNum, totalSteps, storedUserData, navigate]);

//   const handleNext = (newAnswer = null) => {
//     setAnswers((prevAnswers) => {
//       const updatedAnswers = { ...prevAnswers, ...newAnswer };
//       console.log("Updated answers object inside setAnswers:", updatedAnswers);
//       return updatedAnswers;
//     });

//     setQuestionNum((prevQuestionNum) => prevQuestionNum + 1);
//     setCurrentStep((prevStep) => prevStep + 1); // Update the progress step
//   };

//   const handleAnswerChange = (answer, category) => {
//     setAnswers(prevAnswers => ({
//       ...prevAnswers,
//       [category]: {
//         ...prevAnswers[category],
//         ...answer
//       }
//     }));
//   };

//   const logo = storedUserData?.company?.logo || Logo;

//   const InitialQuestion = () => (
//     <>
//       <Box sx={{ px: 2.5, py: 3, mb: 1, display: "inline-flex" }}>
//         <img
//           src={logo}
//           alt="Logo"
//           style={{ width: 200, height: 200, borderRadius: 10 }}
//           sx={{ animation: `${zoomIn} 1s ease-in-out forwards` }}
//         />
//       </Box>

//       <h2 className="text-3xl font-semibold">Welcome to {storedUserData?.company?.name}</h2>
//       <p className="text-l text-slate-500 mt-2">
//         Your personal development plan to become More!!!
//       </p>
//       <Button className="mt-10 w-60" variant="outlined" onClick={() => handleNext()}>
//         Let's Go!
//       </Button>
//     </>
//   );

//   const renderQuestionnaire = () => {
//     switch (questionNum) {
//       case 0:
//         return <InitialQuestion />;
//       case 1:
//         return <Q1 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
//       case 2:
//         return <Q2 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
//       case 3:
//         return <Q3 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
//       case 4:
//         return <Q4 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
//       case 5:
//         return <Q5 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
//       case 6:
//         return <Q6 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 7:
//         return <Q7 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 8:
//         return <Q8 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 9:
//         return <Q9 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 10:
//         return <Q10 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 11:
//         return <Q11 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 12:
//         return <Q12 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 13:
//         return <Q13 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 14:
//         return <Q14 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       case 15:
//         return <Q15 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
//       default:
//         return <InitialQuestion />;
//     }
//   };

//   return (
//     <div
//       style={{ background: "rgba(247, 243, 239, 0.2)" }}
//       className="w-full h-full flex flex-col items-center justify-center"
//     >
//       {questionNum > 0 && <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />}
//       {renderQuestionnaire()}
//     </div>
//   );
// };

// export default Questions;


import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { createStartUpQuestions, UpdateUserFromStartUpQuestions } from "src/api";
import ProgressBar from './ProgressBar';
import Logo from "../../assets/mainLogo.png";
import { keyframes } from "@mui/system";
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Q1 from "./Q1";
import Q2 from "./Q2";
import Q3 from "./Q3";
import Q4 from "./Q4";
import Q5 from "./Q5";
import Q6 from "./Q6";
import Q7 from "./Q7";
import Q8 from "./Q8";
import Q9 from "./Q9";
import Q10 from "./Q10";
import Q11 from "./Q11";
import Q12 from "./Q12";
import Q13 from "./Q13";
import Q14 from "./Q14";
import Q15 from "./Q15";

const zoomIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;
const validateDate = (date) => {
  return !isNaN(Date.parse(date)) ? new Date(date).toISOString() : null;
};
const formatDate = (date) => {
  return date ? new Date(date).toISOString() : null;
};

const Questions = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 16;
  const [questionNum, setQuestionNum] = useState(0);
  const [answers, setAnswers] = useState({});
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (questionNum === totalSteps) {
      console.log("answers:", answers);
      const prepareDataForUpdate = (answers) => ({
        ...answers,
        ageRange: answers.ageRange.replace(/\s+/g, ''),
        dateOfBirth: formatDate(answers.dateOfBirth),
        spouseDOB: formatDate(answers.spouseDOB),
        hasChild: answers.hasChild === "yes",
        userId: storedUserData.user.id,
        companyId: storedUserData.user.companyId,
      });

      const finalAnswersPreference = prepareDataForUpdate(answers.preference);
      const finalAnswerPersona = {
        ...answers.persona,
        userId: storedUserData.user.id,
        companyId: storedUserData.user.companyId,
      };

      const submitAnswers = async () => {
        try {
          await createStartUpQuestions(finalAnswerPersona, storedUserData.token);
          await UpdateUserFromStartUpQuestions(finalAnswersPreference, storedUserData.token);
          toast.success("Startup questions added successfully");
          navigate('/DashBoard/app');
        } catch (error) {
          console.error("Failed to save answers", error);
          toast.error("Failed to save answers");
        }
      };

      submitAnswers();
    }
  }, [answers, questionNum, totalSteps, storedUserData, navigate]);

  const handleNext = (newAnswer = null) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, ...newAnswer }));
    setQuestionNum((prevQuestionNum) => prevQuestionNum + 1);
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Handle Previous Button Click
  const handlePrevious = () => {
    if (questionNum > 0) {
      setQuestionNum((prevQuestionNum) => prevQuestionNum - 1);
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleAnswerChange = (answer, category) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [category]: {
        ...prevAnswers[category],
        ...answer,
      },
    }));
  };

  const InitialQuestion = () => (
    <>
      <Box sx={{ px: 2.5, py: 3, mb: 1, display: "inline-flex" }}>
        <img
          src={storedUserData?.company?.logo || Logo}
          alt="Logo"
          style={{ width: 200, height: 200, borderRadius: 10 }}
          sx={{ animation: `${zoomIn} 1s ease-in-out forwards` }}
        />
      </Box>

      <h2 className="text-3xl font-semibold">Welcome to {storedUserData?.company?.name}</h2>
      <p className="text-l text-slate-500 mt-2">
        Your personal development plan to become More!!!
      </p>
      <Button className="mt-10 w-60" variant="outlined" onClick={() => handleNext()}>
        Let's Go!
      </Button>
    </>
  );

  const renderQuestionnaire = () => {
    switch (questionNum) {
      case 0:
        return <InitialQuestion />;
      case 1:
        return <Q1 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
      case 2:
        return <Q2 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
      case 3:
        return <Q3 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
      case 4:
        return <Q4 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
      case 5:
        return <Q5 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'preference')} />;
      case 6:
        return <Q6 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 7:
        return <Q7 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 8:
        return <Q8 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 9:
        return <Q9 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 10:
        return <Q10 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 11:
        return <Q11 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 12:
        return <Q12 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 13:
        return <Q13 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 14:
        return <Q14 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      case 15:
        return <Q15 handleNext={handleNext} handleAnswerChange={(answer) => handleAnswerChange(answer, 'persona')} />;
      default:
        return <InitialQuestion />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: "rgba(247, 243, 239, 0.2)" }}>
      {questionNum > 0 && <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />}
      {renderQuestionnaire()}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 600, marginTop: 3 }}>
        {questionNum > 1 && (
          <Button
          style={{ marginTop: '0', marginLeft: 'auto', marginRight: 'auto' }}
          className="mt-10 w-60"
          onClick={handlePrevious}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Previous
        </Button>
        )}
        {/* {questionNum < totalSteps - 1 && (
          <Button onClick={handleNext} variant="contained" color="primary">
            Next
          </Button>
        )} */}
      </Box>
    </div>
  );
};

export default Questions;
