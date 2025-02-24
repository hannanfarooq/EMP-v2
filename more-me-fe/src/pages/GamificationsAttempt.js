import { useState } from "react";

import { Box, Button } from "@mui/material";
import AttemptGamifications from "././Gamifications/AttemptGamifications";

const GamificationAttempt = () => {
  const [questionNum, setQuestionNum] = useState(0);
  const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
  const logo = 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Imran_Ahmed_Khan_Niazi_-_UNGA_%2848784380531%29_%28cropped%29.jpg'
  const handleNext = () => setQuestionNum(questionNum + 1);

  const InitialQuestion = () => (
    <>
      <Box sx={{ px: 2.5, py: 3, mb: 1, display: "inline-flex" }}>
        <img
          src={storedUserData.company?.logo}
          alt="Logo"
          style={{ width: 200, height: 200, borderRadius: 10 }}
        />
      </Box>

      <div className="text-center">
        <h2 className="text-3xl font-semibold">Welcome to {storedUserData.company?.name || 'Ali'}</h2>
        <p className="text-lg text-gray-600 mt-4">Please provide your responses to these gamifications.</p>
        <Button className="mt-8 px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300" variant="contained" onClick={handleNext}>
          Let's Get Started
        </Button>
      </div>

    </>
  );

  const renderQuestionnaire = () => {
    switch (questionNum) {
      case 0:
        return <InitialQuestion />;
      case 1:
        return <AttemptGamifications />;

      // case 1:
      //   return <Q1 handleNext={handleNext} />
      //   case 2:
      //     return <Q2 handleNext={handleNext} />
      //   case 3:
      //     return <Q3 handleNext={handleNext} />
      //   case 4:
      //     return <Q4 handleNext={handleNext} />
      //   case 5:
      //     return <Q5 handleNext={handleNext} />
      //   case 6:
      //     return <Q6 handleNext={handleNext} />
      //   case 7:
      //     return <Q7 handleNext={handleNext} />
      //   case 8:
      //     return <Q8 handleNext={handleNext} />

      default:
        return <InitialQuestion />;
    }
  };

  return (
    <div
      style={{ background: "rgba(247, 243, 239, 0.2)" }}
      className="w-full h-full flex flex-col items-center justify-center"
    >
      {renderQuestionnaire()}
    </div>
  );
};

export default GamificationAttempt;
