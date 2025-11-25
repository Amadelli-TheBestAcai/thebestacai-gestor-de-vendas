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
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "8px",
            zIndex: 9999,
            pointerEvents: "none", // não bloqueia cliques
            textAlign: "center",
            maxWidth: "90%",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "4px",
            }}
          >
            Treinamento
          </div>
          <div>
            Esta versão é apenas para treinamento, os dados não serão
            persistidos,
            <br />
            não a utilize no dia a dia em sua loja
          </div>
        </div>
        <Routes />
      </GlobalProvider>
    </BrowserRouter>
  );
}

export default App;
