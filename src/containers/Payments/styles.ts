import styled, { css } from "styled-components";

import MonetaryInput from "../../components/MonetaryInput";

import { Modal as ModalAnt, Col } from "antd";

import {
  MoneyBillAlt,
  CreditCard,
  TicketAlt,
  CreditCard2BackFill,
} from "../../styles/Icons";

const ButtonCSS = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: white;
  border-radius: 10px;
  width: 8.5rem;
  height: 3.7rem;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 500;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
`;

const IconCSS = css`
  width: 24px;
  height: 24px;
  color: white;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-right: 1rem;
`;

export const TypesPaymentsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30%;
`;

export const PaymentsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 45%;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30%;
  font-weight: 600;
  color: var(--black-opaco);
  text-transform: uppercase;
  font-size: 0.9rem;
`;

export const Column = styled(Col)`
  text-align: center;
`;

export const ValuesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 25%;
  background: var(--white-70);
`;

export const ValueInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 33%;
  height: 100%;
  background: white;
  color: var(--grey-100);
  font-weight: 500;
  margin: 3px;

  strong {
    font-size: 1.5rem;
  }
`;

export const Button = styled.button`
  ${ButtonCSS}
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ButtonCancel = styled.button`
  font-size: 0.9rem;
  color: var(--orange-250);
  font-weight: 500;
`;

export const ButtonSave = styled.button`
  padding: 3px 7px;
  font-weight: 500;
  border-radius: 1rem;
  font-size: 0.9rem;
  background: var(--orange-250);
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-200);
  }
`;

export const Modal = styled(ModalAnt)`
  .ant-modal-body {
    input {
      height: 3.7rem;
    }
  }
`;

export const Input = styled(MonetaryInput)``;

export const MoneyIcon = styled(MoneyBillAlt)`
  ${IconCSS}
`;

export const CreditIcon = styled(CreditCard)`
  ${IconCSS}
`;

export const TicketIcon = styled(TicketAlt)`
  ${IconCSS}
`;

export const DebitIcon = styled(CreditCard2BackFill)`
  ${IconCSS}
`;

export const PixIcon = styled.img`
  ${IconCSS}
`;
