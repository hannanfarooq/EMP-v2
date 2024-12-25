import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getConversationMessages } from "src/api";

import { MessageList } from "react-chat-elements"
import { MessageListWrapper } from "./App.styles";

const getMessages = async (id) => await getConversationMessages(id);

export default function MessageListComponent({conversation}) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { data, isLoading, error } = useQuery(
    ["conversations", conversation?.id],
    () => getMessages(conversation?.id),
    { refetchInterval: 1000, }
  );

  const scrollToBottom = () => {
    const mlistElement = document.querySelector('.my-chat .rce-mlist');
    if (typeof mlistElement !== 'undefined') {
      mlistElement.style.height = 'auto';
      mlistElement.scrollTop = mlistElement.scrollHeight;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      !isLoading && scrollToBottom()
    }, 500);
  }, [data, isLoading]);

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong</div>;

console.log(data);
  const chatList = data?.map((msg) => {
    const sender = msg.senderId === currentUser.user.id

    return {
      position: sender ? "right" : "left",
      type: "text",
      title: sender? 'You' : msg?.senderName,
      text: msg?.content,
      
    }
  })

  return (
    <MessageListWrapper>
      <MessageList
        className="my-chat"
        toBottomHeight="100%"
        lockable={true}
        dataSource={chatList ||[]}
      />
    </MessageListWrapper>
  );
}
