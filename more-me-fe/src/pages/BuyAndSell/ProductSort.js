import PropTypes from 'prop-types';
// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

// BlogPostsSort.propTypes = {
//   options: PropTypes.array,
//   onSort: PropTypes.func,
// };

export default function ProductSort({ options, onSort, selected }) {
  const onChangeHandler = (e) => {
    const value = e.target.value;
    if (value !== 'All Products') {
      onSort(value)
    } else {
      onSort('')
    }
  }

  console.log("options",options)
  return (
    <TextField select size="small" value={selected || 'All Products'} onChange={onChangeHandler}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.value}
        </MenuItem>
      ))}
    </TextField>
  );
}
