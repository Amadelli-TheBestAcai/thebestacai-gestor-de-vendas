import styled, { css } from "styled-components";

import { Row, Col as ColAnt, Input as InputAnt, Modal as ModalAnt } from "antd";
import { MoreHoriz } from "../../styles/Icons";

interface IStatus {
  quantity?: number;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Header = styled.header`
  display: flex;
  width: 100%;
  height: 5%;
  background: var(--black-opaco);
  color: white;
  border-radius: 3px;
  text-transform: uppercase;

  /*Responsive 1600*/
  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }

  /*Responsive 1440*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100px;
    height: 75px;

    /*Responsive 1440*/
    @media (max-width: 1440px) {
      width: 85px;
      height: 65px;
    }

    /*Responsive 1366*/
    @media (max-width: 1366px) {
      width: 80px;
      height: 60px;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 95%;
`;

export const Tupla = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 12%;
  background: var(--white-30);
  margin-top: 8px;
  border-radius: 3px 3px 0 0;

  /*Responsive 1440*/
  @media (max-width: 1440px) {
    font-size: 0.9rem;
  }

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

export const Status = styled.label<IStatus>`
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 0.8rem;

  ${({ quantity }) => {
    if (quantity <= 0 || !quantity) {
      return css`
        background: #a43c3f;
      `;
    }
    if (quantity <= 3) {
      return css`
        background: #f49345;
      `;
    }
  }};

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
    padding: 3px;
  }
`;

export const MoreInfo = styled(MoreHoriz)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: var(--grey-100);

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

export const UpdateContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const QtdCurrent = styled.div`
  margin-right: 1rem;
`;

export const QtdChange = styled.div``;

export const Modal = styled(ModalAnt)`
  width: 400px !important;

  .ant-modal-body {
    input {
      height: 2.8rem !important;
    }
  }
`;

export const EditInfo = styled.label`
  font-size: 12px;
  text-transform: uppercase;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.6rem;
  }
`;

export const InputChange = styled(InputAnt)`
  width: auto;
  border-radius: 8px;
  text-align: center;
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
