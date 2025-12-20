import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import AuthForm from "../pages/AuthForm";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../components/profile/Profile";
import Dashboard from "../components/personalAnalysis/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import LandingPageProject from "../components/projects/LandingPageProject";
import ProjectDetailsPage from "../components/projects/projectDisplay/ProjectDetailsPage";
import { ProjectProvider } from "../context/project/ProjectContext";
import { UserProvider } from "../context/user/UserContext";
import ProjectAnalysisPage from "../components/projects/analysis/ProjectAnalysisPage";
import { ProjectAnalysisProvider } from "../context/analysis/ProjectAnalysisContext";
import FormData from "../components/personalAnalysis/FormData";
import MainLayout from "../components/layout/MainLayout";
import NotFound from "../pages/NotFound";
import ProductivityHomepage from "../components/welcomePage/ProductivityHomePage";
import Navbar from "../components/navbar/Navbar";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Layout for ALL routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <ProductivityHomepage />
            </>
          }
        />
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/login" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            <Route
              path="/personal-analysis"
              element={
                <div className="dark:bg-[#040711]">
                  <FormData />
                </div>
              }
            />

            <Route path="/projects" element={<LandingPageProject />} />

            <Route
              path="/project-details/:projectID"
              element={
                <ProjectProvider>
                  <UserProvider>
                    <ProjectDetailsPage />
                  </UserProvider>
                </ProjectProvider>
              }
            />

            <Route
              path="/project-details/:projectID/analysis"
              element={
                <ProjectProvider>
                  <UserProvider>
                    <ProjectAnalysisProvider>
                      <ProjectAnalysisPage />
                    </ProjectAnalysisProvider>
                  </UserProvider>
                </ProjectProvider>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
