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
      <Button
        onClick={async () => console.log(await window.Main.store.getFromApi())}
      >
        Get User
      </Button>
    </Container>
  );
};

export default Login;
