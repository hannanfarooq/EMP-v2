import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function SimpleSnackbar({ show }) {
  const [open, setOpen] = React.useState(show);
  const [selectedValue, setSelectedValue] = React.useState('opt1'); // State to hold the selected radio button value

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value); // Update state with the selected radio button value
    console.log('Selected Value:', event.target.value); // Log the selected value to console
    handleClose(event); // Optionally close the Snackbar when a selection is made
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label" sx={{ color: 'white' }}>
              How are you feeling today?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={selectedValue} // Controlled component
              name="radio-buttons-group"
              onChange={handleRadioChange} // Update state and log value on change
            >
              <FormControlLabel value="awesome" control={<Radio />} label="Awesome" />
              <FormControlLabel value="good" control={<Radio />} label="Good" />
              <FormControlLabel value="fine" control={<Radio />} label="Fine" />
              <FormControlLabel value="awful" control={<Radio />} label="Awful" />
              <FormControlLabel value="awful" control={<Radio />} label="Awful" />
            </RadioGroup>
          </FormControl>
        }
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}
