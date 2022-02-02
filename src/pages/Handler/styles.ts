import styled, { css } from "styled-components";

import { Row, Col, Button as ButtonAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0.8rem;
`;

const ContentCSS = css`
  background: var(--white);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  padding: 1rem;
`;

export const Content = styled.div`
  ${ContentCSS}
  height: 100%;
  width: 100%;
  margin-bottom: 5px;
  overflow: hidden;
  text-align: center;
`;

export const Name = styled.h1`
  position: absolute;
  width: 259px;
  height: 42px;

  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 42px;

  color: #000000;
`;

export const HandlersContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90%;
  margin-top: 15px;
`;

export const HandlersHeader = styled(Row)`
  border-radius: 3px;
  background: #1c1e23;
  height: 40px;
`;

export const Button = styled(ButtonAnt)`
  width: 158px;
  height: 42px;
  margin-left: 88.5%;
  color: #8c5b00;

  background: #ff9d0a;
  border-radius: 5px;
  border: none;
  :active,
  :hover,
  :focus {
    background: #ff9d0a;
    color: #8c5b00;
  }
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.label`
  font-size: 16px;
  color: white;
  text-transform: uppercase;
`;

export const HandlersList = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
  margin-bottom: 5px;
`;

export const PdfContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
