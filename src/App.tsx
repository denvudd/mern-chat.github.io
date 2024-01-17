import { UserProvider } from "./context/UserContext";
import Routes from "./pages/Routes";

function App() {
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
}

export default App;
