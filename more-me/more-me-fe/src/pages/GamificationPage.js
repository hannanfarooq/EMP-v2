import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { Stack, Container, Typography } from "@mui/material";
// components
import TransitionsModal from "src/components/modal";
import Gamifications from "./Gamifications";
import GamificationsList from "./Gamifications/QuestionsList";
import AddQuestionCategory from "./Gamifications/CreateQuestionCategory";
import ViewGamification from "./Gamifications/viewgamification";

// ----------------------------------------------------------------------

export default function GamificationPage() {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [openTransition, setOpenTransiton] = useState(false);
  const handleOpen = () => setOpenTransiton(true);
  const handleClose = () => setOpenTransiton(false);

  const [openTransition2, setOpenTransiton2] = useState(false);
  const handleOpen2 = () => setOpenTransiton2(true);
  const handleClose2 = () => setOpenTransiton2(false);

  const [openTransition3, setOpenTransiton3] = useState(false);
  const handleOpen3 = () => setOpenTransiton3(true);
  const handleClose3 = () => setOpenTransiton3(false);
  return (
    <>
      <Helmet>
        <title> Gamifications | More.Me </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Gamifications
          </Typography>
          <div className="flex">
            <TransitionsModal
              open={openTransition}
              handleClose={handleClose}
              handleOpen={handleOpen}
              title={"Add New Gamification"}
              component={<Gamifications />}
            />
            <span className="mr-2"></span>
            <TransitionsModal
              open={openTransition2}
              handleClose={handleClose2}
              handleOpen={handleOpen2}
              title={"Add Gamification Category"}
              component={<AddQuestionCategory />}
            />
             <span className="mr-2"></span>
              <TransitionsModal
              open={openTransition3}
              handleClose={handleClose3}
              handleOpen={handleOpen3}
              title={"View Gamification Score Board"}
              component={<ViewGamification />}
            />
          </div>
        </Stack>

        <GamificationsList />
      </Container>
    </>
  );
}