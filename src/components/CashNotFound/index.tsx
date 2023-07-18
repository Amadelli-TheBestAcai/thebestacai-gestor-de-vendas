import React from "react";

import CashNotImg from "../../assets/svg/Investing.svg";

import { Empty } from "antd";

import { Container } from "./styles";

interface IProps {
  description: string;
}

const CashNotFound: React.FC<IProps> = ({ description }) => {
  return (
    <Container>
      <Empty
        description={description}
        image={CashNotImg}
        imageStyle={{
          height: 350,
        }}
      />
    </Container>
  );
};

export default CashNotFound;
