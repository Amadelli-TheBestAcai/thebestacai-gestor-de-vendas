import styled, { css } from "styled-components";

import { Button as ButtonAnt, Modal as ModalAnt } from "antd";

export const Container = styled(ModalAnt)`
  .ant-modal-content {
    position: relative;
    top: -30rem;
    height: 90rem;
    width: 100%;
    border-radius: 6.25rem;
    padding: 5rem;
    border-color: var(--color-theme);
    color: var(--color-theme) !important;

    p,
    span,
    button {
      border-color: var(--color-theme);
      color: var(--color-theme) !important;
    }

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

    img {
      margin: 1rem 0;
      height: 30rem;
      object-fit: contain;
    }
  }
  .modal-body {
    font-family: "VisbyCF";
    font-size: 2.5rem;
    font-weight: 600;
  }
  .modal-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 7.68rem;
  border-radius: 0.625rem;
  margin: 1rem 0;
  span {
    font-family: "VisbyCF";
    font-weight: 600;
    font-size: 2.25rem;
    color: var(--color-theme);
  }
`;

export const ButtonCancel = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--white);
  border: none;
  text-decoration: underline;

  :active,
  :hover,
  :focus {
    background: var(--white);
    color: var(--color-theme);
    
  }
`;

interface IRegisterButton {
  loadingRegister?: boolean;
}

export const ButtonContinue = styled(ButtonAnt)<IRegisterButton>`
  ${ButtonCSS}
  border: none;
  background: var(--orange-250);

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--color-theme);
    border: none;
  }

  ${({ loadingRegister }) => {
      if (loadingRegister) {
        return css`
          background: var(--green-500);
          transition: background-color 2s ease;
  
          :active,
          :hover,
          :focus {
            background: var(--green-500);
            color: var(--color-theme);
            border: none;
          }
        `;
      }
    }}
`;
