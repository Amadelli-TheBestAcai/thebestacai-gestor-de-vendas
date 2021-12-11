import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { GlobalStyle } from "./styles/GlobalStyle";
import "antd/dist/antd.css";

function App() {
  useEffect(() => {
    const initialize = async () => {
      await window.Main.db_init();
    };
    initialize();
  }, []);
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
