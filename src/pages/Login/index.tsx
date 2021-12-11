import React from "react";
import { Button } from "antd";
import { Container } from "./styles";

const Login: React.FC = () => {
  return (
    <Container>
      <Button
        onClick={async () =>
          console.log(
            await window.Main.send(
              "user:login",
              (user: any) => console.log(user),
              {
                username: "admin",
                password: "123456",
              }
            )
          )
        }
      >
        Login
      </Button>
      <Button>Get User</Button>
    </Container>
  );
};

export default Login;
