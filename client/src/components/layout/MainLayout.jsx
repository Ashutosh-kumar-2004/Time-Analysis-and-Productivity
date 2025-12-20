import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Chatbot from "../chatbot/Chatbot";

const MainLayout = () => {
  const location = useLocation();
  const showChatbot = ["/dashboard", "/personal-analysis"].includes(
    location.pathname
  );

  return (
    <>
      <Navbar />
      <Outlet />
      {showChatbot && <Chatbot />}
    </>
  );
};

export default MainLayout;
