import { MessageCircle } from "lucide-react";

const ChatHeader: React.FC = () => {
  return (
    <h1 className="text-blue-600 font-bold flex gap-2 text-xl items-center mb-4">
      <MessageCircle className="fill-blue-600" />
      MernChat
    </h1>
  );
};

export default ChatHeader;
