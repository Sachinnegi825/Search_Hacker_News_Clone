import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((state) => state.user.username);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/history"
          element={user ? <SearchHistoryPage /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;
