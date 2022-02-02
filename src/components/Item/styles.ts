import styled from "styled-components";

import { Row, Col, Modal as ModalAnt, Input as InputAnt } from "antd";

import { TrashRestoreAlt } from "../../styles/Icons";

export const Container = styled(Row)`
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--white-40);
  margin-bottom: 8px;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.button`
  padding: 5%;
`;

export const DeleteIcon = styled(TrashRestoreAlt)`
  width: 1.2rem;
  height: 1.2rem;
  color: var(--red-600);
`;

export const Modal = styled(ModalAnt)``;

export const Input = styled(InputAnt)`
  height: 3.7rem;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
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
