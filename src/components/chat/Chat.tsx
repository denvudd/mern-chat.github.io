import React, { useContext } from "react";

import { UserContext } from "@/context/UserContext";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessageList";
import ChatInput from "./ChatInput";

import { uniqBy } from "lodash";
import {
  Message,
  type PeopleConnection,
  type UniquePeopleConnection,
} from "./types";

const Chat: React.FC = () => {
  const { id } = useContext(UserContext);

  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [connection, setConnection] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [onlinePeople, setOnlinePeople] =
    React.useState<UniquePeopleConnection>({});

  const messagesBoxRef = React.useRef<HTMLDivElement>(null);
  const messagesWithoutDupes = uniqBy(messages, "_id");

  React.useEffect(() => {
    connectToSocket();
  }, []);

  function connectToSocket() {
    if (connection) {
      connection.close();
      setConnection(null);
    } else {
      const socket = new WebSocket(`wss://${process.env.PUBLIC_BACKEND}`);
      setConnection(socket);
      socket.addEventListener("message", handleMessage);
      socket.addEventListener("close", () => {
        console.log("Reconnecting...");
        setTimeout(() => connectToSocket(), 1000);
      });
    }
  }

  function showOnlinePeople(people: PeopleConnection[]) {
    const peopleSet: UniquePeopleConnection = {}; // to prevent duplicates connections

    people.forEach(({ userId, username }) => {
      peopleSet[userId] = username;
    });

    delete peopleSet[id!]; // to filter out the current user

    setOnlinePeople(peopleSet);
  }

  function handleMessage(event: MessageEvent) {
    const messageData = JSON.parse(event.data);

    if (messageData.online) {
      showOnlinePeople(messageData.online);
    } else if (messageData.text) {
      if (messageData.sender === selectedUser) {
        setMessages((prev) => [
          ...prev,
          {
            ...messageData,
            _id: Date.now(),
          },
        ]);
      }
    }
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar
        onlinePeople={onlinePeople}
        selectedUser={selectedUser}
        setConnection={setConnection}
        setSelectedUser={setSelectedUser}
      />
      <main className="bg-blue-100 w-2/3 p-4 pt-0 pr-0 flex flex-col">
        <ChatMessages
          messages={messagesWithoutDupes}
          setMessages={setMessages}
          selectedUser={selectedUser}
          messagesBoxRef={messagesBoxRef}
        />
        <ChatInput
          senderId={id!}
          messages={messages}
          setMessages={setMessages}
          connection={connection}
          selectedUserId={selectedUser!}
          messagesBoxRef={messagesBoxRef}
        />
      </main>
    </div>
  );
};

export default Chat;
