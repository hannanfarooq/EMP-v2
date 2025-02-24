import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const ConfirmDeleteModal = ({ open, onClose, onConfirmDelete, id }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="div" gutterBottom>
          Confirm Deletion
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Are you sure you want to delete this item?
        </Typography>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirmDelete(id);
          }}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
