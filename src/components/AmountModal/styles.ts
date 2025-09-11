import styled, { css } from "styled-components";

import { Modal, Row as RowAnt, Col as ColAnt, Button } from "antd";

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

export const ConfirmModal = styled(Modal)`
  .ant-modal-header {
    background: var(--white-80);
    border-bottom: 1px solid #f0f0f0;

    .ant-modal-title {
      font-weight: 600;
      font-size: 1.1rem;
    }
  }

  .ant-modal-body {
    background: var(--white-80);
    padding: 1.5rem;

    p {
      font-size: 1rem;
      text-align: center;
      margin: 0;
    }
  }

  .ant-modal-footer {
    background: var(--white-80);
    border-top: 1px solid #f0f0f0;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      .ant-modal-title {
        font-size: 1rem;
      }

      .ant-modal-body p {
        font-size: 0.9rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-modal-title {
      font-size: 0.9rem;
    }

    .ant-modal-body p {
      font-size: 0.8rem;
    }

    .ant-modal-footer {
      padding: 0.8rem 1rem;
    }
  }
`;

export const CancelButton = styled(Button)`
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: var(--grey-100);
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  height: auto;
  transition: all 0.3s ease;

  &:hover {
    background: #e6e6e6;
    border-color: #bfbfbf;
    color: var(--grey-100);
  }

  &:focus {
    background: #e6e6e6;
    border-color: #bfbfbf;
    color: var(--grey-100);
  }

  &:disabled {
    background: #f9f9f9;
    border-color: #e0e0e0;
    color: #bfbfbf;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
      padding: 0.4rem 1.2rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
    padding: 0.3rem 1rem;
  }
`;

export const ConfirmButton = styled(Button)`
  background: var(--orange-250);
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  height: auto;
  transition: all 0.3s ease;

  &:hover {
    background: var(--orange-200);
    color: white;
  }

  &:focus {
    background: var(--orange-200);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ffcc99;
    color: white;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  .ant-btn-loading-icon {
    color: white;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
      padding: 0.4rem 1.2rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
    padding: 0.3rem 1rem;
  }
`;
