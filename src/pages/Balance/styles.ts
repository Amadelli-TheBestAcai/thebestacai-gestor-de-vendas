import styled, { css } from "styled-components";
import {
  AttachMoney,
  CreditCard2Back,
  CreditCard,
  Ticket,
  CheckCircleFill,
} from "../../styles/Icons";

import { Row, Col } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
`;

export const Title = styled.label`
  font-size: 32px;
  color: white;
  font-weight: bold;
`;

export const CardContainer = styled.div`
  display: flex;
  height: 95%;
  overflow-y: scroll;
  justify-content: center;
  align-items: center;
`;

export const Card = styled(Row)`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  width: 23%;
  height: 80%;
  border-radius: 10px 10px 0px 0px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  background: blue;
  border-radius: 10px 10px 0px 0px;
  font-size: 20px;
  line-height: 23px;
  color: white;
  font-weight: bold;
`;

interface IProps {
  green?: boolean;
  black?: boolean;
  fontWhite?: boolean;
}

export const CardBody = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 85%;
  background: #f0f5ff;
  ${({ green }) =>
    green &&
    css`
      background: #f0fff2;
    `}
  ${({ black }) =>
    black &&
    css`
      background: #282828;
    `}
    ${({ fontWhite }) =>
    fontWhite &&
    css`
      color: white;
    `}
`;

export const CardRow = styled.div<IProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 75%;
  border-bottom: 1px solid #b4b4b4;
  background: #f0f5ff;
  font-size: 28px;
  ${({ green }) =>
    green &&
    css`
      background: #f0fff2;
    `}
  ${({ black }) =>
    black &&
    css`
      background: #282828;
    `}
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CardFooter = styled.div<IProps>`
  display: flex;
  height: 5%;
  width: 100%;
  border-radius: 0px 0px 10px 10px;
  background: #f0f5ff;
  ${({ green }) =>
    green &&
    css`
      background: #f0fff2;
    `}
  ${({ black }) =>
    black &&
    css`
      background: #282828;
    `}
`;

interface FontProps {
  white?: boolean;
}

export const Description = styled.label<FontProps>`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 15px;
  margin-top: 3px;
  text-transform: uppercase;
  color: #898989;
  ${({ white }) =>
    white &&
    css`
      color: white;
    `}
`;

const IconCSS = css`
  width: 5vw;
  height: 5vh;
  padding: 0;
  margin: 0;
`;

export const MoneyIcon = styled(AttachMoney)`
  color: #007c05;
  ${IconCSS};
`;

export const CreditIcon = styled(CreditCard2Back)`
  color: #2b40fd;
  ${IconCSS};
`;

export const DebitIcon = styled(CreditCard)`
  color: #f97700;
  ${IconCSS};
`;

export const TicketIcon = styled(Ticket)`
  color: #ff00c7;
  ${IconCSS};
`;

export const CheckOnline = styled(CheckCircleFill)`
  color: #009a7e;
  ${IconCSS};
`;
