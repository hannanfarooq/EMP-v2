import styled from "styled-components";

export const MessageListWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

export const MessageInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #ddd;
  background-color:rgb(255, 255, 255);

  /* Sticky positioning to keep it visible at the bottom */
  position: sticky;
  bottom: 0;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row; /* Default row direction */
  height: 90vh;
  max-height: 100vh;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 12px;
  margin: 16px;
  padding: 16px;
  overflow: hidden;

  /* Media query for tablet and mobile responsiveness */
  @media (max-width: 1024px) {
    margin: 12px;
    padding: 12px;
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on smaller screens */
    margin: 8px;
    padding: 8px;
    height: auto;
  }
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row; /* Default row layout for larger screens */
  max-height: 74vh;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;

  /* Add responsiveness for smaller screens */
  @media (max-width: 1024px) {
    flex-direction: column; /* Stack elements vertically on tablets */
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on smaller screens */
    height: auto;
  }
`;

export const LeftContainer = styled.div`
  width: 30%;
  max-width: 400px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-right: 1px solid #ddd;

  /* Custom scrollbar styling */
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f4f4f9;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    padding: 8px;
  }
`;

export const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
 border-radius: 12px;
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 8px;
  }
`;
export const ChatDivContainer = styled.div`
  flex: 1; /* Allow this to take up available space */
  overflow-y: auto; /* Enable scrolling for chat messages */
  padding: 16px;
  background-color: #ffffff;
  scrollbar-width: thin;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 8px;
  }
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
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  /* Adjust size for smaller screens */
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;
