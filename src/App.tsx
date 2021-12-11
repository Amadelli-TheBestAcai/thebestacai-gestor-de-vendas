import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
