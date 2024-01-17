import React, { useContext } from "react";
import ChatHeader from "./ChatHeader";
import Contact from "../contact/Contact";
import { UniquePeopleConnection } from "./types";
import axios from "@/lib/axios";
import { UserContext } from "@/context/UserContext";
import { User } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
interface ChatSidebarProps {
  onlinePeople: UniquePeopleConnection;
  selectedUser: string | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<string | null>>;
  setConnection: React.Dispatch<React.SetStateAction<WebSocket | null>>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onlinePeople,
  selectedUser,
  setSelectedUser,
  setConnection,
}) => {
  const [parent] = useAutoAnimate();
  const { setId, setUsername, id, username } = useContext(UserContext);
  const [offlinePeople, setOfflinePeople] = React.useState<
    UniquePeopleConnection[]
  >([]);

  React.useEffect(() => {
    axios
      .get("/people")
      .then(({ data }: { data: UniquePeopleConnection[] }) => {
        const offlinePeople = data
          .filter((contact) => contact._id !== id) // exclude the current user
          .filter(
            (contact) => !Object.keys(onlinePeople).includes(contact._id)
          );

        console.log(offlinePeople);
        setOfflinePeople(offlinePeople);
      });
  }, [onlinePeople]);

  function selectContact(userId: string) {
    setSelectedUser(userId);
  }

  function logout() {
    axios.post("/logout").then(() => {
      setConnection(null);
      setId(null);
      setUsername(undefined);
      setSelectedUser(null);
    });
  }

  return (
    <aside className="bg-white w-1/3 p-4 flex flex-col">
      <div className="flex flex-col flex-grow">
        <ChatHeader />
        <ul ref={parent} className="divide-y divide-gray-200">
          {Object.keys(onlinePeople).map((userId) => (
            <Contact
              selectContact={selectContact}
              name={onlinePeople[userId]}
              userId={userId}
              selected={userId === selectedUser}
              online={true}
              key={userId}
            />
          ))}
          {!!offlinePeople?.length &&
            offlinePeople.map((offline) => (
              <Contact
                selectContact={selectContact}
                name={offline.username}
                userId={offline._id}
                selected={offline._id === selectedUser}
                online={false}
                key={offline._id}
              />
            ))}
        </ul>
      </div>
      <div className="p-2 flex flex-col space-y-2">
        <p className="inline-flex justify-center gap-2">
          <User />
          {username}
        </p>
        <button
          onClick={logout}
          className="text-sm text-gray-500 bg-blue-100 py-1 px-2 rounded-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
