import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UpdateCompanyUser } from "src/api"; // Import your API function for updating user data

export default function QuestionShow({
  userData,
  onClose,
  setEditingCardOpen,
}) {
  const defaultTheme = createTheme();
  const questionData = userData?.questionnaire?.answer
    ? userData?.questionnaire?.answer
    : [];
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {questionData === 0 ? (
          <div>No data</div>
        ) : (
          questionData.map((item) => (
            <div key={item.id}>
              <Typography variant="h6">Question ID: {item.id}</Typography>
              <Typography variant="body1">Type: {item.type}</Typography>
              {item.type === "single-choice" ? (
                <div>
                  <Typography variant="body1">Selected Option:</Typography>
                  <ul>
                    {item.selectedOption.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <Typography variant="body1">Selected Option:</Typography>
                  <Typography variant="body2">
                    {item.selectedOption === "✅ Yes"
                      ? "Yes"
                      : item.selectedOption === "❌ No"
                      ? "No"
                      : "Unknown"}
                  </Typography>
                </div>
              )}
            </div>
          ))
        )}
      </Container>
    </ThemeProvider>
  );
}
