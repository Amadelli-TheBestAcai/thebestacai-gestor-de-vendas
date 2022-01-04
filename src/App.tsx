import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { GlobalStyle } from "./styles/GlobalStyle";
import { SaleProvider } from "./context/saleContext";
import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <SaleProvider>
        <Routes />
      </SaleProvider>
    </BrowserRouter>
  );
}

export default App;
