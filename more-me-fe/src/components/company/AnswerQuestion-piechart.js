import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

// Register necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AnswerQuestionModal = ({ openModal, handleCloseModal, selectedAnnouncement }) => {

  return (
    <Dialog open={openModal} onClose={handleCloseModal}>
      <DialogTitle>Question Feedback</DialogTitle>
      <DialogContent>
        {selectedAnnouncement &&
          selectedAnnouncement.map((question, index) => {
            // Check if question.counts is valid
            if (!question.counts) {
              return null; // If counts is not valid, skip rendering this question
            }

            // Extract labels (keys) and data (values) from the counts object
            const labels = Object.keys(question.counts);
            const dataValues = Object.values(question.counts);

            // Check if all counts are zero
            const allZero = dataValues.every(value => value === 0);

            // Prepare the data for the pie chart
            const data = {
              labels: labels,
              datasets: [
                {
                  data: dataValues, // Use the values directly as data
                  backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                  ], // Pie slice colors
                  hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                  ], // Hover colors
                },
              ],
            };

            return (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h6">{question.question}</Typography>
                {allZero ? (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    No response yet.
                  </Typography>
                ) : (
                  <Box sx={{ width: "100%", maxWidth: "400px", mx: "auto", mt: 2 }}>
                    <Pie data={data} />
                  </Box>
                )}
              </Box>
            );
          })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerQuestionModal;
