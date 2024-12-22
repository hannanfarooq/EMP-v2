import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Adjusted to percentage for responsiveness
  maxWidth: 600, // Maximum width for the modal
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

export default function ChatTransitionsModal({
  title,
  icon  ,
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
     
       
      
        <IconButton  fullWidth={isMobile} // Full width on mobile
        onClick={handleOpen}
        variant={variant}
        disabled={disabled} size="small" color="inherit">
          {icon}
        </IconButton>
       
      
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
