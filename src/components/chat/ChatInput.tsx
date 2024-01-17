import React from "react";
import axios from "@/lib/axios";

import { Paperclip, Send } from "lucide-react";
import { Message } from "./types";

interface ChatInputProps {
  connection: WebSocket | null;
  selectedUserId: string;
  senderId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messagesBoxRef: React.RefObject<HTMLDivElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  connection,
  selectedUserId,
  senderId,
  setMessages,
  messages,
  messagesBoxRef,
}) => {
  const [newMessage, setNewMessage] = React.useState<string>("");

  function onChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
    setNewMessage(event.target.value);
  }

  function sendMessage(
    event: React.FormEvent<HTMLFormElement> | null,
    file: {
      data: string | ArrayBuffer | null;
      name: string;
    } | null = null
  ) {
    if (event) {
      event.preventDefault();
    }

    if (connection) {
      connection.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessage,
          file,
        })
      );
    }

    if (file) {
      axios.get(`/messages/${selectedUserId}`).then(({ data }) => {
        setMessages(data);
      });
    } else {
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          recipient: selectedUserId!,
          sender: senderId,
          _id: Date.now(),
          createdAt: Date.now(),
        },
      ]);
    }
  }

  function attachFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        sendMessage(null, {
          data: reader.result,
          name: file.name,
        });
      };
    }
  }

  React.useEffect(() => {
    const div = messagesBoxRef.current;

    if (div) {
      setTimeout(
        () => div.scrollIntoView({ behavior: "smooth", block: "end" }),
        250
      );
    }
  }, [messages]);

  if (!selectedUserId || !connection) {
    return null;
  }

  return (
    <form className="flex gap-2 pr-4" onSubmit={sendMessage}>
      <input
        type="text"
        value={newMessage}
        onChange={onChangeMessage}
        className="bg-white border p-2 flex-grow rounded-sm"
        placeholder="Type your message here"
      />

      <label className="bg-gray-400 p-2 text-white rounded-sm cursor-pointer">
        <input type="file" className="hidden" onChange={attachFile} />
        <Paperclip />
      </label>
      <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
        <Send />
      </button>
    </form>
  );
};

export default ChatInput;
