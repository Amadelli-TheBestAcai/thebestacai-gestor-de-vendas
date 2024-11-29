import styled from "styled-components";

import { TrashRestoreAlt } from "../../styles/Icons";

import { Row as RowAnt, Col as ColAnt, Input as InputAnt } from "antd";

const { TextArea } = InputAnt;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
`;

export const InfoPayment = styled(RowAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 3px;
  background: var(--white-70);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--black-opaco);

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    font-size: 0.8rem;
  }
`;

export const Column = styled(ColAnt)`
  text-align: center;
`;

export const Button = styled.button`
  padding: 3%;
`;

export const DeleteIcon = styled(TrashRestoreAlt)`
  width: 1rem;
  height: 1rem;
  color: var(--red-600);

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 0.9rem;
    height: 0.9rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 0.8rem;
    height: 0.8rem;
  }
`;

export const RowPaymentTefHeader = styled(RowAnt)`
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--white);
  background: var(--gray-250);
`;

export const RowPaymentTef = styled(RowAnt)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const ColPaymentTef = styled(ColAnt)``;

export const Textarea = styled(TextArea)`
  height: 3.7rem;
  width: 20%;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 3.4rem;
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3rem;
    font-size: 0.7rem;
  }
`;
