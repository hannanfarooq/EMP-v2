import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

const Image = styled('img')({
  width: '100%',
});

function Skeleton(props) {
  const { loading = false } = props;

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ margin: 1 }}>
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Skeleton width="100%">
            <Typography>.</Typography>
          </Skeleton>

        </Box>
      </Box>
      <Skeleton variant="rectangular" width="100%">
        <div style={{ paddingTop: '57%' }} />
      </Skeleton>

    </div>
  );
}

export default Skeleton;