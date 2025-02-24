import {
  Stack,
  Container,
  Typography,
} from "@mui/material";
import KanbanBoard from '../components/Task-Management-Components/KanbanBoard.js';


export default function TaskManagement() {
  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Task Management
        </Typography>
      </Stack>
      <div>
          <KanbanBoard />
        </div>
    </Container>
  );
}
