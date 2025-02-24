// import { IconButton } from "@material-ui/core";
import styled from "styled-components";
import { IconButton } from "@mui/material";
// import { styled } from "@mui/system";

export const Wrapper = styled.div`
  margin: 40px;
`;

// export const StyledButton = styled(IconButton)`
//   position: fixed;
//   z-index: 100;
//   right: 20px;
//   top: 20px;
// `;

export const StyledButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  zIndex: 100,
  right: 20,
  top: 20,
}));
