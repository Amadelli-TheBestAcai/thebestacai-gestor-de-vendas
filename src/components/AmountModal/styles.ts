import styled, { css } from "styled-components";

import { Modal, Row as RowAnt, Col as ColAnt } from "antd";

export const Container = styled(Modal)`
  input {
    height: 3.7rem;
  }

  .ant-modal-footer {
    background: var(--white-80);
    color: var(--grey-100);

    span.value {
      color: var(--green-400);
    }
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      input {
        height: 3.3rem;
        font-size: 0.8rem;
      }
      width: 700px !important;

      .ant-modal-footer {
        font-size: 0.8rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-modal-body {
      input {
        height: 2.5rem !important;
        font-size: 0.7rem;
      }
    }
    width: 650px !important;

    .ant-modal-footer {
      font-size: 0.7rem;
    }
  }
`;

export const Row = styled(RowAnt)`
  display: flex;
  width: 100%;
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  padding: 0.6rem;
  span {
    width: 30%;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      padding: 0.4rem;
      span {
        font-size: 0.8rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    padding: 0.3rem;
    span {
      font-size: 0.7rem;
    }
  }
`;

interface IButtonRegister {
  isOpened: boolean;
}
export const ButtonRegister = styled.button<IButtonRegister>`
  width: 100%;
  color: white;
  border-radius: 4px;
  padding: 0.5rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
      padding: 0.4rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
    padding: 0.3rem;
  }

  ${({ isOpened }) =>
    isOpened
      ? css`
          background: #c53030;
        `
      : css`
          background: var(--green-400);
        `}
`;
