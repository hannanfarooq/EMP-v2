import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, Grid } from '@mui/material';

const ViewAnswersDialog = ({ open, onClose, questionnaire, answers = [] }) => {
  const answersArray = Array.isArray(answers) ? answers : [];
  console.log("answersArray", answersArray);
  let count = 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`Responses for ${questionnaire?.questionnaireTitle}`}</DialogTitle>
      <DialogContent>
        <List dense={true}>
          {answersArray.map((answer, index) => (
            <ListItem key={index} alignItems="flex-start">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textPrimary">
                    {`Question No ${++count}: ${answer.title}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`Answer: ${Array.isArray(answer.selectedOption) ? answer.selectedOption.join(', ') : answer.selectedOption}`}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
          {answersArray.length === 0 && (
            <ListItem>
              <Typography variant="h6">No answers submitted yet.</Typography>
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAnswersDialog;
