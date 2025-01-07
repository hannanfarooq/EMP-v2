// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { NavLink as RouterLink } from 'react-router-dom';
// // @mui
// import { Box, List, ListItemText, Badge } from '@mui/material';
// //
// import { StyledNavItem, StyledNavItemIcon } from './styles';

// import { getUnviewedThreadsCount } from "../../api/index";

// // ----------------------------------------------------------------------

// NavSection.propTypes = {
//   data: PropTypes.array,
// };

// export default function NavSection({ data = [], ...other }) {
  
//   const [unviewedThreadsCount, setUnviewedThreadsCount] = useState(0);

//   // Fetch unviewed threads count when the component is mounted
//   useEffect(() => {
//     const fetchUnviewedThreadsCount = async () => {
//       const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//       const count = await getUnviewedThreadsCount(currentUser.user.id, currentUser.company.id);
//       setUnviewedThreadsCount(count);
//       console.log("COUNTSSSSSSSSSSS:", count);
//     };

//     // Fetch initially on mount
//     fetchUnviewedThreadsCount();

//     // Set interval to fetch every 3 seconds
//     const intervalId = setInterval(fetchUnviewedThreadsCount, 3000); // 3000 ms = 3 seconds

//     // Cleanup the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []); // Empty array means this effect runs once on mount

//   return (
//     <Box {...other}>
//       <List disablePadding sx={{ p: 1 }}>
//         {data.map((item) => (
//           <NavItem
//             key={item.title}
//             item={item}
//             unviewedThreadsCount={item.title === 'Connects' ? unviewedThreadsCount : 0}
//           />
//         ))}
//       </List>
//     </Box>
//   );
// }

// // ----------------------------------------------------------------------

// NavItem.propTypes = {
//   item: PropTypes.object,
//   unviewedThreadsCount: PropTypes.number,
// };

// function NavItem({ item, unviewedThreadsCount }) {
//   const { title, path, icon, info } = item;
  
//   return (
//     <StyledNavItem
//       component={RouterLink}
//       to={path}
//       sx={{
//         '&.active': {
//           color: 'text.primary',
//           bgcolor: 'action.selected',
//           fontWeight: 'fontWeightBold',
//         },
//         position: 'relative',  // Add position relative to enable positioning of Badge
//       }}
//     >
//       <StyledNavItemIcon>
//         {icon && icon}
//         {title === 'Connects' && unviewedThreadsCount.unviewedThreadsCount > 0 && (
//           <Badge
//             badgeContent={unviewedThreadsCount.unviewedThreadsCount}
//             color="error"
//             sx={{
//               position: 'absolute',
//               top: 25,  // Adjust as needed
//               right: 50,  // Adjust as needed
//               zIndex: 1,  // Ensure the badge appears on top
//             }}
//           >
//             <span className="icon-new-threads" /> {/* You can replace this with your own icon */}
//           </Badge>
//         )}
//       </StyledNavItemIcon>

//       <ListItemText disableTypography primary={(title)} />

//       {info && info}
//     </StyledNavItem>
//   );
// }

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";
// @mui
import { Box, List, ListItemText, Badge } from "@mui/material";
//
import { StyledNavItem, StyledNavItemIcon } from "./styles";
import { getUnviewedThreadsCount } from "../../api/index";
import { socket } from "src/App";

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const [unviewedThreadsCount, setUnviewedThreadsCount] = useState(0);
  const fetchUnviewedThreadsCount = async () => {
    const currentUserString = localStorage.getItem("currentUser");
    
    if (!currentUserString) {
      console.error("currentUser is not set in localStorage");
      return;
    }

    const currentUser = JSON.parse(currentUserString);
    if (!currentUser || !currentUser.user || !currentUser.company) {
      console.error("Invalid currentUser object structure:", currentUser);
      return;
    }

    try {
      const count = await getUnviewedThreadsCount(
        currentUser.user.id,
        currentUser.company.id
      );
      setUnviewedThreadsCount(count);
      //console.log("Fetched unviewed threads count:", count);
    } catch (error) {
      console.error("Error fetching unviewed threads count:", error);
      setUnviewedThreadsCount(0); // Set default count to 0 on error
    }
  };
  // Fetch unviewed threads count when the component is mounted
  useEffect(() => {
    

    // Fetch initially on mount
    fetchUnviewedThreadsCount();

    // Set interval to fetch every 3 seconds
   
  }, []); // Empty array means this effect runs once on mount
  useEffect(()=>
    {
      socket.on('getcount', (data) => {
        if (data) {
      
        
          fetchUnviewedThreadsCount();
        }
      });
    })
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            unviewedThreadsCount={
              item.title === "Connects" ? unviewedThreadsCount : 0
            }
          />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  unviewedThreadsCount: PropTypes.number,
};

function NavItem({ item, unviewedThreadsCount }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        "&.active": {
          color: "text.primary",
          bgcolor: "action.selected",
          fontWeight: "fontWeightBold",
        },
        position: "relative", // Add position relative to enable positioning of Badge
      }}
    >
      <StyledNavItemIcon>
        {icon && icon}
        {title === "Connects" && unviewedThreadsCount.unviewedThreadsCount > 0 && (
          <Badge
            badgeContent={unviewedThreadsCount.unviewedThreadsCount}
            color="error"
            sx={{
              position: "absolute",
              top: 25, // Adjust as needed
              right: 50, // Adjust as needed
              zIndex: 1, // Ensure the badge appears on top
            }}
          >
            <span className="icon-new-threads" />{" "}
            {/* You can replace this with your own icon */}
          </Badge>
        )}
      </StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}