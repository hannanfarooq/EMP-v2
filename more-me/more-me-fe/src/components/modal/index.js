// import * as React from "react";
// import Backdrop from "@mui/material/Backdrop";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import Fade from "@mui/material/Fade";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import AddCompany from "../company/form";
// import Iconify from "../iconify/Iconify";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 2,
// };

// export default function TransitionsModal({
//   title,
//   icon = <Iconify icon="eva:plus-fill" />,
//   component,
//   open,
//   variant = "contained",
//   handleClose,
//   handleOpen,
//   disabled = false,
// }) {
//   return (
//     <div>
//       <Button
//         fullWidth
//         onClick={handleOpen}
//         variant={variant}
//         startIcon={icon}
//         disabled={disabled}
//       >
//         {title}
//       </Button>
//       <Modal
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         open={open}
//         onClose={handleClose}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//         sx={{ overflow: 'scroll' }}
//       >
//         <Fade in={open}>
//           <Box sx={style}>{component}</Box>
//         </Fade>
//       </Modal>
//     </div>
//   );
// }

import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from "../iconify/Iconify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Adjusted to percentage for responsiveness
  maxWidth: 600, // Maximum width for the modal
  maxHeight: "90vh", // Maximum height for the modal
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  overflowY: "auto", // Enable vertical scrolling
};

export default function TransitionsModal({
  title,
  icon = <Iconify icon="eva:plus-fill" />,
  component,
  open,
  variant = "contained",
  handleClose,
  handleOpen,
  disabled = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const buttonWidth = isMobile ? "100%" : "auto";

  return (
    <div>
      <Button
        fullWidth={isMobile} // Full width on mobile
        onClick={handleOpen}
        variant={variant}
        startIcon={icon}
        disabled={disabled}
        style={{ width: buttonWidth }} // Dynamic width based on screen size
      >
        {title}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} // Center modal content
      >
        <Fade in={open}>
          <Box sx={style}>{component}</Box>
        </Fade>
      </Modal>
    </div>
  );
}
