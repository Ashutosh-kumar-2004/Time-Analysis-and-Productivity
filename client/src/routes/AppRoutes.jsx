import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Profile from "../components/profile/Profile";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import LandingPageProject from "../components/projects/LandingPageProject";
import ProjectDetailsPage from "../components/projects/projectDisplay/ProjectDetailsPage";
import { ProjectProvider } from "../context/project/ProjectContext";
import { UserProvider } from "../context/user/UserContext";
import Navbar from "../components/navbar/Navbar";
import ProjectAnalysisPage from "../components/projects/analysis/ProjectAnalysisPage";
import { ProjectAnalysisProvider } from "../context/analysis/ProjectAnalysisContext";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route
          path="/u"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Navbar/>
              <LandingPageProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-details/:projectID"
          element={
            <ProtectedRoute>
              <ProjectProvider>
                <UserProvider>
                  <Navbar/>
                  <ProjectDetailsPage />
                </UserProvider>
              </ProjectProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-details/:projectID/analysis"
          element={
            <ProtectedRoute>
               <ProjectProvider>
                <UserProvider>
                  <ProjectAnalysisProvider>
                    <Navbar/>
                    <ProjectAnalysisPage />
                  </ProjectAnalysisProvider>
                </UserProvider>
              </ProjectProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
