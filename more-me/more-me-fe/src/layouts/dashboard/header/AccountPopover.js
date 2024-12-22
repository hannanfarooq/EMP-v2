import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
  Modal,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import ProfilePage from "src/pages/User/ProfilePage";
import EditPreferencePage from "src/pages/User/EditPreferencePage";
import ChangePassword from "./ChangePassword";

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
    path: "/dashboard/app",
  },
  {
    label: "Edit Profile",
    icon: "eva:person-fill",
    path: "/edit-profile",
  },
  {
    label: "Edit Preferences",
    icon: "eva:person-fill",
    path: "/edit-preference",
  },
  {
    label: "Settings",
    icon: "eva:settings-2-fill",
    path: "/settings",
  },
  {
    label: "Change Password",
    icon: "eva:person-fill",
    path: "/change-password",
  },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [storedUser, setStoredUser] = useState(false);
  const [userUpdated, setUserUpdated] = useState(false);
  const [changePass, setOpenChangePasswordModal] = useState(false);
  const [changePreference, setOpenChangePreferenceModal] = useState(false); // Correct variable
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    logout();
  };

  const handleMenuClick = (path) => {
    if (path === "/edit-profile") {
      setOpenModal(true);
    } else if (path === "/change-password") {
      setOpenChangePasswordModal(true);
    } else if (path === "/edit-preference") {
      setOpenChangePreferenceModal(true);
    } else {
      navigate(path);
    }
    handleClose();
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("currentUser"));
    setStoredUser(storedUserData);
  }, [openModal, userUpdated]);

  return (
    <>
      <Modal
        style={{
          maxWidth: "600px",
          width: "100%",
          margin: "100px auto 0px auto",
        }}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ProfilePage
          user={storedUser?.user}
          setOpenModal={setOpenModal}
          userUpdated={userUpdated}
          setUserUpdated={setUserUpdated}
        />
      </Modal>

      <Modal
        style={{
          maxWidth: "600px",
          width: "100%",
          margin: "100px auto 0px auto",
        }}
        open={changePreference}
        onClose={() => setOpenChangePreferenceModal(false)} // Correct function call
      >
        <EditPreferencePage
          user={storedUser?.user}
          setOpenModal={setOpenChangePreferenceModal}
          userUpdated={userUpdated}
          setUserUpdated={setUserUpdated}
        />
      </Modal>

      <Modal
        style={{
          maxWidth: "600px",
          width: "100%",
          margin: "100px auto 0px auto",
        }}
        open={changePass}
        onClose={() => setOpenChangePasswordModal(false)}
      >
        <Card>
          <ChangePassword handleClose={setOpenChangePasswordModal} />
        </Card>
      </Modal>

      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={storedUser?.user?.profilePic} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {storedUser?.user?.firstName} {storedUser?.user?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {storedUser?.user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleMenuClick(option.path)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
