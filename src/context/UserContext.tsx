import React from "react";
import axios from "@/lib/axios";

interface UserContextType {
  username: string | undefined;
  setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = React.createContext<UserContextType>({
  id: null,
  username: undefined,
  setId: () => {},
  setUsername: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState<string>();
  const [id, setId] = React.useState<string | null>(null);

  React.useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        id,
        setId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
