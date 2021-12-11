import React from "react";
import { Button } from "antd";
import { Container } from "./styles";

const Login: React.FC = () => {
  return (
    <Container>
      <Button
        onClick={async () =>
          console.log(await window.Main.user.login("admin", "123456"))
        }
      >
        Login
      </Button>
      <Button onClick={() => console.log(window.Main.user.loggedUser())}>
        Get User
      </Button>
    </Container>
  );
};

export default Login;
