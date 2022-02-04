import styled from "styled-components";

import MonetaryInput from "../../components/MonetaryInput";

import { Modal as ModalAnt } from "antd";

export const Container = styled(ModalAnt)`
  .ant-modal-body {
    input {
      height: 3.4rem !important;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 330px !important;
  }
`;

export const Input = styled(MonetaryInput)`
  border: none;
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;
