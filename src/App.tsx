import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import Login from "./pages/Login";

function App() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {session ? <Dashboard /> : <Login />}
      </div>
    </BrowserRouter>
  );
}

export default App;
