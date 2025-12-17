import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import {store} from "./redux/store"; 

import { AuthProvider } from "./context/auth/AuthContext";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes /> {/* router paths are present inside this folder*/}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
