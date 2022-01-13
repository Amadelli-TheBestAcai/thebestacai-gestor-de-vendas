import styled from "styled-components";

import { Row, Col, Button as ButtonAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
`;

export const HandlersContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90%;
  margin: 5px 1%;
  background: #dddddd;
`;

export const HandlersHeader = styled(Row)`
  background: var(--primary-orange);
`;

export const Button = styled(ButtonAnt)`
  width: fit-content;
  margin: 5px 1%;
  background: var(--primary-orange);
  border: none;
  :active,
  :hover,
  :focus {
    background: #ff9d0a9c;
  }
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

export const HandlersList = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

export const PdfContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
