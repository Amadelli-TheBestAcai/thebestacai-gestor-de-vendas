import styled from "styled-components";

import { Col as ColAnt, Row as RowAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: #fff;
`;

export const TopSide = styled.div`
  display: flex;
  height: 15%;
  width: 85%;
  @media only screen and (max-width: 578px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  height: 85%;
  width: 85%;
  margin-bottom: 5px;
  overflow: hidden;
  text-align: center;
`;

export const Row = styled(RowAnt)`
  display: flex;
  align-items: center;
  width: 100%;
`;
export const Col = styled(ColAnt)`
  margin: 0 10px;
  @media only screen and (max-width: 578px) {
    margin: 5px 0;
  }
`;
