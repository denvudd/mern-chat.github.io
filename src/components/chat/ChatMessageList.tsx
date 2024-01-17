import React from "react";
import axios from "@/lib/axios";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { UserContext } from "@/context/UserContext";
import ChatMessageItem from "./ChatMessageItem";
import { type Message } from "./types";

interface ChatMessageListProps {
  selectedUser: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messagesBoxRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  selectedUser,
  messages,
  setMessages,
  messagesBoxRef,
}) => {
  const [parent] = useAutoAnimate();
  const { id } = React.useContext(UserContext);

  React.useEffect(() => {
    if (selectedUser) {
      axios.get(`/messages/${selectedUser}`).then(({ data }) => {
        setMessages(data);
      });
    }
  }, [selectedUser]);

  return (
    <div className="flex-grow">
      {!selectedUser && (
        <div className="flex h-full items-center justify-center">
          <div className="text-gray-400 font-medium">
            &larr; Select a person from the sidebar
          </div>
        </div>
      )}
      {!!selectedUser && (
        <div className="relative h-full">
          <ul
            ref={parent}
            className="overflow-y-auto pr-4 overflow-x-hidden absolute inset-0 top-0 left-0 h-full space-y-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-blue-100"
          >
            {messages.map((message) => (
              <ChatMessageItem
                sender={message.sender}
                text={message.text}
                file={message.file}
                userId={id!}
                key={message._id}
                createdAt={message.createdAt}
              />
            ))}
            <div ref={messagesBoxRef} className="h-0.5" />
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMessageList;
