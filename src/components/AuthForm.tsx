import React, { useContext } from "react";
import axios from "@/lib/axios";
import { UserContext } from "@/context/UserContext";

const Register: React.FC = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [authMode, setAuthMode] = React.useState<"register" | "login">(
    "login"
  );
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = authMode === "register" ? "/register" : "/login";

    const { data } = await axios.post(url, {
      username,
      password,
    });

    setLoggedInUsername(data.username);
    setId(data.id);
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full rounded-sm p-2"
        >
          {authMode === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          <div className="flex flex-col">
            {authMode === "register" ? (
              <>
                Already a member?{" "}
                <button
                  type="button"
                  className="text-blue-400"
                  onClick={() => setAuthMode("login")}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Dont have an account?{" "}
                <button
                  type="button"
                  className="text-blue-400"
                  onClick={() => setAuthMode("register")}
                >
                  Register here.
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
