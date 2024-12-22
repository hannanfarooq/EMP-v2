import styled from "styled-components";

export const MessageListWrapper = styled.div`
  height: 91%;
  overflow: scroll;
  width: 100%;
`;

export const MessageInputWrapper = styled.div`
  align-items: flex-end;
  display: flex;
  height: 10%;
  width: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  border: 2px solid #ddd; /* Added outline to the main container */
  border-radius: 8px; /* Optional: to make the borders rounded */
  margin: 16px; /* Optional: to add some space around the container */
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  border: 2px solid #ccc; /* Added outline to the inner container */
  border-radius: 8px; /* Optional: to make the borders rounded */
`;

export const LeftContainer = styled.div`
  width: 30%;
 

  display: flex;
  flex-direction: column;
  padding: 16px;
  border-right: 1px solid #ddd;
  overflow-y: auto;

  /* Add styles for child elements to ensure readability */
  a {
    color: #fff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .chat-item {
    padding: 8px;
    border-radius: 4px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .chat-item-active {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 16px;
  overflow-y: auto;
`;

export const ChatDivContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
`;

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;