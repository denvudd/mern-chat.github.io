import React from "react";

import AuthForm from "@/components/AuthForm";
import Chat from "@/components/chat/Chat";
import { UserContext } from "@/context/UserContext";
const Routes: React.FC = () => {
  const { username } = React.useContext(UserContext);

  if (username) {
    return <Chat />;
  }
  return <AuthForm />;
};

export default Routes;
