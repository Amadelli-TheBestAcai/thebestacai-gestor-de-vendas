import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { GlobalStyle } from "./styles/GlobalStyle";
import { GlobalProvider } from "./context/globalContext";
import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <GlobalProvider>
        <Routes />
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
