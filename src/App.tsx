import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import "antd/dist/antd.css";

function App() {
  useEffect(() => {
    window.Main.db_init();
  }, []);
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
