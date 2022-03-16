import React from "react";

import SideBar from "../SideBar";

import { Container, SideBarContainer, MainContainer, Content } from "./styles";

const Layout: React.FC = ({ children }) => {
  return (
    <Container>
      <SideBarContainer>
        <SideBar />
      </SideBarContainer>
      <MainContainer>{children}</MainContainer>
    </Container>
  );
};

export default Layout;
