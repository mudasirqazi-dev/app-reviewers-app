import "./assets/css/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import useStore from "./store/store";
import Loading from "./components/Loading";
import Signup from "./views/auth/Signup";
import Login from "./views/auth/Login";
import ForgetPassword from "./views/auth/ForgetPassword";
import ResetPassword from "./views/auth/ResetPassword";
import Activate from "./views/auth/Activate";
import Profile from "./views/user/Profile";
import ChangePassword from "./views/user/ChangePassword";
import Header from "./components/Header";
import ToastError from "./components/ToastError";
import ToastSuccess from "./components/ToastSuccess";
import ToastInfo from "./components/ToastInfo";
import Manage from "./views/user/Manage";

function App() {
  const {
    isLoading,
    isLoggedIn,
    user,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    infoMessage,
    setInfoMessage,
  } = useStore((state) => state);
  return (
    <Router>
      {isLoading === true && <Loading />}
      <ToastError
        open={errorMessage?.length > 0}
        onClose={() => setErrorMessage("")}
        body={errorMessage}
      />
      <ToastSuccess
        open={successMessage?.length > 0}
        onClose={() => setSuccessMessage("")}
        body={successMessage}
      />
      <ToastInfo
        open={infoMessage?.length > 0}
        onClose={() => setInfoMessage("")}
        body={infoMessage}
      />
      {isLoggedIn && user && <Header />}
      <Routes>
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/fp" element={<ForgetPassword />} />
        <Route exact path="/rp" element={<ResetPassword />} />
        <Route exact path="/activate" element={<Activate />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/settings" element={<Manage />} />
      </Routes>
    </Router>
  );
}

export default App;
