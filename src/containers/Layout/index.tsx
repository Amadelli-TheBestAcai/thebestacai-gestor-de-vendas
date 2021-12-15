import React from "react";

import SideBar from "../SideBar";

import { Container, SideBarContainer, MainContainer, Content } from "./styles";

const Layout: React.FC = ({ children }) => {
  // const [version, setVersion] = useState("");

  // useEffect(() => {
  //   window.Main.send("app_version", (_version) => setVersion(_version));
  // }, []);
  // const sendFocusToMain = () => {
  //   document.getElementById("mainContainer").focus();
  // };

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
