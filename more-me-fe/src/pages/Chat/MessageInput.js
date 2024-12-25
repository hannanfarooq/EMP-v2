import { LinearProgress } from "@mui/material";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { getConversationMessages, postMessage } from "src/api";

import { Input, MessageBox } from "react-chat-elements";
import { MessageInputWrapper } from "./App.styles";


export default function MessageInputComponent({conversation}) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [inputValue, setInputValue] = useState('');
  const sender = conversation?.groupAdminId === currentUser.user.id ? conversation?.groupAdminId : currentUser.user.id
  const input = useRef(undefined);
  let inputClear;

  const sendMessage = async (msg) => {
    const data = {
      "senderId": currentUser.user.id,
      "chatId": conversation?.id,
      "content": msg
    }
    postMessage(data).then(() => {
      if (inputClear) {
        inputClear();
      }
      setInputValue('');
    })
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <MessageInputWrapper>
      <Input
        ref={input}
        placeholder="Type a message..."
        multiline={false}
        type='text'
        onChange={handleInputChange}
        value={inputValue}
        clear={(clear) => (inputClear = clear)} 
        maxlength={300}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            sendMessage(event.target.value)
          }
        }}
      />
    </MessageInputWrapper>
  );
}
