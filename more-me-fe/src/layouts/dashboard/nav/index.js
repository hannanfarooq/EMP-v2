import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// mock
import account from "../../../_mock/account";
// hooks
import useResponsive from "../../../hooks/useResponsive";
// components
import Logo from "../../../components/logo";
import Scrollbar from "../../../components/scrollbar";
import NavSection from "../../../components/nav-section";
//
import navConfig from "./adminConfig";

import MainLogo from "../../../assets/mainLogo.png";
import { useAuth } from "src/context/AuthContext";
import superAdminConfig from "./superAdminConfig";
import adminConfig from "./adminConfig";
import userConfig from "./userConfig";
import managerconfig from "./managerconfig";
import Leadconfig from "./leadconfig";
import functionhead from "./functionheadconfig";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { userData } = useAuth();
  const role = userData?.user?.role ? userData?.user?.role : "";

  console.log(userData)

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: '100%',
          marginBottom: 5,
          marginTop: 5,
          justifyContent: 'center'
        }}
      >
        {/* <Logo /> */}

        <img
          src={role == "super-admin" ? MainLogo : userData?.company?.logo}
          alt="Logo"
          style={{ height: "110px" }}
        />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={userData?.user?.profilePic} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {`${userData?.user?.firstName} ${userData?.user?.lastName}`}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {account.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>
      {role && role == "super-super-admin" ? (
        <NavSection data={superAdminConfig} />
      ) : role == "user" ? (
        <NavSection data={userConfig} />
      ) :role == "manager" ? (
        <NavSection data={managerconfig} />
      ):
      role=="lead"?(  <NavSection data={Leadconfig} />): role == "admin"?( <NavSection data={functionhead} />):( <NavSection data={adminConfig} />)}

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{ pt: 5, borderRadius: 2, position: "relative" }}
        >
          {/* <Box
            component="img"
            src="/assets/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          /> */}

          <Box sx={{ textAlign: "center" }}>
            {/* <Typography gutterBottom variant="h6">
              Get more?
            </Typography> */}

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {/* Well Designed */}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
