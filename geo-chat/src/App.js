import { Route, Routes } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import { LoginPage } from "./pages/LoginPage/LoginPage";
import { ChatPage } from "./pages/ChatPage/ChatPage";

import { store, persistor } from "./store";

const defaultTheme = createTheme();

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={defaultTheme}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};
