import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Group, SupervisorAccount } from '@mui/icons-material'; // Import Material UI icons
import Button from '@mui/material/Button';
import { fShortenNumber } from 'src/utils/formatNumber';
import Scrollbar from 'src/components/scrollbar/Scrollbar';

// ----------------------------------------------------------------------

export function AppTopManagers({ title, subheader, list, sx, ...other }) {
  // Show all managers (you can slice for limiting if needed)
  const managers = list.filter((item) => item.role === 'manager');

  return (
    <Card
      sx={{
     
        border: '1px solid #dddd',
       
      
      }}
      {...other}
    >
      <CardHeader title={title} subheader={subheader}  />

      <Scrollbar
        sx={{
          
        
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexDirection: 'row', // Align managers in a row
           
            p: 2,
          }}
        >
          {managers.map((item, index) => (
            <ManagerItem key={item.id} item={item} index={index} />
          ))}
        </Box>
          {/* "View All" button */}
   
     
      </Scrollbar>

    
    </Card>
  );
}

// ----------------------------------------------------------------------

function ManagerItem({ item, index, sx, ...other }) {
  
  return (
    <Box
      sx={[
        {
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          width: 'calc(33.33% - 16px)', // Adjust width for row layout with gaps
          minWidth: '150px', // Ensure a reasonable minimum size
         
        
        
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Avatar alt={item.firstName + ' ' + item.lastName} src={item.profilePic} />

      <Box flexGrow={1}>
        <Typography variant="subtitle2">{item.firstName + ' ' + item.lastName}</Typography>

        <Box
          sx={{
            gap: 0.5,
            mt: 0.5,
            alignItems: 'center',
            typography: 'caption',
            display: 'inline-flex',
            color: 'text.secondary',
          }}
        >
        
          <Typography variant="body2">{"Manager"}</Typography>
        </Box>

        <Box
          sx={{
            gap: 0.5,
            mt: 0.5,
            alignItems: 'center',
            typography: 'caption',
            display: 'inline-flex',
            color: 'text.secondary',
          }}
        >
        
        </Box>
      </Box>
    </Box>
  );
}
