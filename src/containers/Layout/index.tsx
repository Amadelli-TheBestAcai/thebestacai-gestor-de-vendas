import React from "react";

import SideBar from "../SideBar";

import {
  Container,
  SideBarContainer,
  MainContainer,
  Content,
  HomologContent,
} from "./styles";

const Layout: React.FC = ({ children }) => {
  return (
    <Container>
      {window.Main.env.ENV === "homolog" && (
        <HomologContent>AMBIENTE DE HOMOLOGAÇÃO</HomologContent>
      )}
      <SideBarContainer>
        <SideBar />
      </SideBarContainer>
      <MainContainer>{children}</MainContainer>
    </Container>
  );
};

export default Layout;
