import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, LinearProgress, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function BoardProgressChart({ data }) {
  if (!data || data.length === 0) return <Typography>No progress data available.</Typography>;
console.log("DATA OF CHART : ",data);
  return (
    <Stack spacing={2}>
      {data.map((board, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{board.boardName} — {board.totalTasks} Task(s)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {board.tasks.length === 0 ? (
              <Typography variant="body2">No tasks found.</Typography>
            ) : (
              board.tasks.map((task, i) => (
                <Box key={i} mb={2}>
                  <Typography variant="subtitle1">{task.title}</Typography>
                  <Typography variant="caption">
                    {task.completedSubtasks}/{task.totalSubtasks} Subtasks — {task.progress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={task.progress} sx={{ height: 10, borderRadius: 5, mt: 0.5 }} />
                </Box>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
