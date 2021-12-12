import React, { useState, useEffect } from "react";

import Header from "../../components/Header";
import SideBar from "../SideBar";

import {
  Container,
  HeaderContainer,
  MainContainer,
  SideBarContainer,
  Content,
  Footer,
  TextFooter,
} from "./styles";

const Layout: React.FC = ({ children }) => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.Main.send("app_version", (_version) => setVersion(_version));
  }, []);
  const sendFocusToMain = () => {
    document.getElementById("mainContainer").focus();
  };

  return (
    <Container>
      <HeaderContainer onClick={() => sendFocusToMain()}>
        <Header />
      </HeaderContainer>
      <MainContainer>
        <SideBarContainer>
          <SideBar />
        </SideBarContainer>
        <Content>{children}</Content>
      </MainContainer>
      <Footer onClick={() => sendFocusToMain()}>
        <TextFooter>{`DEVELOPED BY THE BEST AÇAI COMPANY v${version}`}</TextFooter>
      </Footer>
    </Container>
  );
};

export default Layout;
