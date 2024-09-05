import styled, { css } from "styled-components";

import { Button as ButtonAnt, Modal as ModalAnt } from "antd";

export const Container = styled(ModalAnt)`
  .ant-modal-content {
    height: 100%;
    width: 100%;
    border-radius: 6.25rem;
    padding: 5rem;
    .ant-modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      padding: 0;
      font-size: 2rem;
    }
  }
  .modal-title {
    font-family: "VisbyCF";
    font-size: 3.75rem;
    font-weight: 600;
  }
  .modal-div-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .modal-body {
    font-family: "VisbyCF";
    font-size: 2.5rem;
    font-weight: 600;
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23.8rem;
  height: 7.68rem;
  border-radius: 0.625rem;
  margin: 0 1rem;
  span {
    font-family: "VisbyCF";
    font-weight: 600;
    font-size: 2.25rem;
    color: var(--black);
  }
`;

export const ButtonContinue = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--white);
  border: 3px solid var(--black);

  :active,
  :hover,
  :focus {
    background: var(--white);
    color: var(--black);
    border: 3px solid var(--black);
  }
`;

export const ButtonCancel = styled(ButtonAnt)`
  ${ButtonCSS}
  border: none;
  background: var(--orange-250);

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;
