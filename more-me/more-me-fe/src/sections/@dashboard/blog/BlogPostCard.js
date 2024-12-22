import PropTypes from "prop-types";
import * as React from "react";
// @mui
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent,
} from "@mui/material";
// utils
import { fDate } from "../../../utils/formatTime";
import { fShortenNumber } from "../../../utils/formatNumber";
//
import SvgColor from "../../../components/svg-color";
import Iconify from "../../../components/iconify";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CompanyModal from "./CompanyModal";
import { Photo } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import UpdateCompany from "src/components/update-company/form";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { baseURL } from "src/utils/baseURL";

// ----------------------------------------------------------------------

const StyledCardMedia = styled("div")({
  position: "relative",
  paddingTop: "calc(100% * 3 / 4)",
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const StyledTitle = styled(Link)({
  height: 44,
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: "absolute",
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index, refetchCompanies }) {
  const [open, setOpen] = React.useState(false);
  const { link, name, photo, logo } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };
  const [isModalOpenDelete, setIsModalOpenDelete] = React.useState(false);

  const handleDeleteClick = () => {
    // setClickedId(id);
    // Open the modal when the delete button is clicked
    setIsModalOpenDelete(true);
  };

  const handleConfirmDelete = async (id) => {
    // Make API call for deletion here
    // ...
    const res = await fetch(baseURL + "/api/admin/deleteCompany", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("currentUser")).token,
      },
      body: JSON.stringify({ companyId: id }),
    });
     await refetchCompanies();

    // Close the modal after successful deletion
    setIsModalOpenDelete(false);
  };

  const handleModalClose = () => {
    // Close the modal if the user cancels the deletion
    setIsModalOpenDelete(false);
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sm={latestPostLarge ? 12 : 6}
        md={latestPostLarge ? 6 : 3}
      >
        <div>
          <Card sx={{ position: "relative", cursor: "pointer" }}>
            <StyledCardMedia
              sx={{
                ...((latestPostLarge || latestPost) && {
                  pt: "calc(100% * 4 / 3)",
                  "&:after": {
                    top: 0,
                    content: "''",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.52),
                  },
                }),
                ...(latestPostLarge && {
                  pt: {
                    xs: "calc(100% * 4 / 3)",
                    sm: "calc(100% * 3 / 4.66)",
                  },
                }),
              }}
            >
              <SvgColor
                color="paper"
                src="/assets/icons/shape-avatar.svg"
                sx={{
                  width: 80,
                  height: 36,
                  zIndex: 9,
                  bottom: -15,
                  position: "absolute",
                  color: "background.paper",
                  ...((latestPostLarge || latestPost) && { display: "none" }),
                }}
              />
              <StyledAvatar
                onClick={() => navigate(`/dashboard/company/${post.id}`)}
                alt={"Admin"}
                src={logo}
                sx={{
                  ...((latestPostLarge || latestPost) && {
                    zIndex: 9,
                    top: 24,
                    left: 24,
                    width: 100,
                    height: 100,
                  }),
                }}
              />

              <StyledCover alt={"name"} src={photo} />
            </StyledCardMedia>

            <CardContent
              sx={{
                pt: 4,
                ...((latestPostLarge || latestPost) && {
                  bottom: 0,
                  width: "100%",
                  position: "absolute",
                }),
              }}
            >
              <StyledTitle
                onClick={() => navigate(`/dashboard/company/${post.id}`)}
                color="inherit"
                variant="subtitle2"
                underline="hover"
                sx={{
                  ...(latestPostLarge && { typography: "h5", height: 60 }),
                  ...((latestPostLarge || latestPost) && {
                    color: "common.white",
                  }),
                }}
              >
                {name}
              </StyledTitle>
              <div
                color="white"
                variant="subtitle2"
                underline="hover"
                sx={{
                  ...(latestPostLarge && { typography: "h5", height: 60 }),
                  ...((latestPostLarge || latestPost) && {
                    color: "common.white",
                  }),
                }}
                style={{ color: "white" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleEditClick(post);
                }}
              >
                Edit
              </div>
              <div
                color="red"
                variant="subtitle2"
                underline="hover"
                sx={{
                  ...(latestPostLarge && { typography: "h5", height: 60 }),
                  ...((latestPostLarge || latestPost) && {
                    color: "common.white",
                  }),
                }}
                style={{ color: "red", cursor: "pointer" }}
                onClick={handleDeleteClick}
              >
                Delete
              </div>
            </CardContent>
          </Card>
        </div>

        <CompanyModal
          open={open}
          post={post}
          refetchCompanies={refetchCompanies}
        />
      </Grid>
      {isModalOpenDelete && (
        <ConfirmDeleteModal
          open={isModalOpenDelete}
          onClose={handleModalClose}
          onConfirmDelete={handleConfirmDelete}
          id={post.id}
        />
      )}

      {isModalOpen && (
        <Box>
          <Modal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
          >
            <Box sx={style}>
              <UpdateCompany
                companyData={post}
                refetchCompanies={refetchCompanies}
                setIsModalOpen={setIsModalOpen}
              ></UpdateCompany>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
}
