import React from "react";

import notConnection from "../../assets/svg/notConnection.svg";

import { Empty } from "antd";
import { Container } from "./styles";

const DisconectedForm: React.FC = () => {
  return (
    <Container>
      <Empty
        description="Oops! Você está sem conexão."
        image={notConnection}
        imageStyle={{
          height: 350,
        }}
      />
    </Container>
  );
};

export default DisconectedForm;
