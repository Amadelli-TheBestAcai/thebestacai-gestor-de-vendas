import styled, { css } from "styled-components";

import { Modal, Row as RowAnt, Col as ColAnt } from "antd";

export const Container = styled(Modal)`
  input {
    height: 3.7rem;
  }

  .ant-modal-footer {
    background: var(--white-80);
    color: var(--grey-100);
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
`;

interface IButtonRegister {
  isOpened: boolean;
}
export const ButtonRegister = styled.button<IButtonRegister>`
  width: 100%;
  color: white;
  border-radius: 4px;
  padding: 0.5rem;
  ${({ isOpened }) =>
    isOpened
      ? css`
          background: #c53030;
        `
      : css`
          background: var(--green-400);
        `}
`;
