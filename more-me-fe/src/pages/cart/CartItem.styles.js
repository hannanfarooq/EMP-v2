import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Arial, Helvetica, sans-serif;
  border-bottom: 1px solid lightblue;
  padding-bottom: 20px;
  margin: 10px;

  div {
    flex: 1;
  }

  .information {
    display: flex;
    justify-content: space-between;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  img {
    max-width: 80px;
    object-fit: cover;
    margin-left: 40px;
  }
`;
