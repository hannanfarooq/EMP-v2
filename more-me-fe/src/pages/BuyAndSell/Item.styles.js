import styled from "styled-components";
import { Paper } from "@mui/material";

export const ModalBody = styled(Paper)({
  position: "absolute",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding:20
});



export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  border: 1px solid lightblue;
  border-radius: 20px;
  height: 100%;

  button {
    border-radius: 0 0 20px 20px;
  }

  img {
    max-height: 250px;
    object-fit: cover;
    border-radius: 20px 20px 0 0;
  }

  div {
    font-family: Arial, Helvetica, sans-serif;
    height: 100%;
  }
`;

export const ModalContent= styled.div``

export const  ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
