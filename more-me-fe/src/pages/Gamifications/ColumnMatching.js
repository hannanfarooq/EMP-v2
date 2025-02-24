import React, { useState } from "react";
import { Button, Card, Typography, MenuItem, FormControl, Select } from "@mui/material";
import "./SliderStyles.css"; // Import the CSS file

const ColumnMatching = ({ question, submitAnswer }) => {
  const [selectedPairs, setSelectedPairs] = useState({});

  const handleSelection = (item, value) => {
    setSelectedPairs((prevSelectedPairs) => {
      const newSelectedPairs = { ...prevSelectedPairs, [item]: value };
      console.log("Updated selected pairs:", newSelectedPairs);
      return newSelectedPairs;
    });
  };

  const handleSubmit = () => {
    console.log("Final selected pairs:", selectedPairs);
    submitAnswer(selectedPairs); // Correctly call the submitAnswer function
  };

  return (
    <div>
      <Typography variant="h5">Match the following:</Typography>
      <div className="column-matching-container">
        <div className="column column-a">
          <Typography variant="h6">Column A</Typography>
          {question.columnA.map((item, index) => (
            <Card key={index} className="option-card">
              {item}
            </Card>
          ))}
        </div>
        <div className="column column-b">
          <Typography variant="h6">Column B</Typography>
          {question.columnB.map((item, index) => (
            <Card key={index} className="option-card">
              {item}
            </Card>
          ))}
        </div>
      </div>
      <div className="dropdown-container">
        {question.columnA.map((item, index) => (
          <div key={index} className="matching-pair">
            <FormControl variant="outlined" className="dropdown">
            <Typography variant="h6">{"Select Correct Option for "+item +" : "}</Typography>
              <Select
                value={selectedPairs[item] || ""}
                onChange={(e) => handleSelection(item, e.target.value)}
              >
                {question.columnB.map((option, idx) => (
                  <MenuItem key={idx} value={option} disabled={Object.values(selectedPairs).includes(option)}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ))}
      </div>
      <Button variant="contained" onClick={handleSubmit} disabled={Object.keys(selectedPairs).length !== question.columnA.length}>
        Submit
      </Button>
    </div>
  );
};

export default ColumnMatching;
