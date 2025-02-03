import styled, { css } from "styled-components";

import { Button as ButtonAnt, Modal as ModalAnt } from "antd";

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  * {
    font-family: "VisbyCF";
  }
  p {
    margin-bottom: 0;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 17.81rem;
  background-color: black;

  .logo-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 34.56rem;
  }
`;

interface IContent {
  customHeight: any;
  customJustifyContent?: any;
}

export const Content = styled.div<IContent>`
  display: flex;
  justify-content: ${({ customJustifyContent }) =>
    customJustifyContent || "center"};
  align-items: center;
  width: 100%;
  flex-direction: column;

  ${({ customHeight }) => {
    if (customHeight)
      return css`
        height: ${customHeight};
      `;
  }}
`;

export const Modal = styled(ModalAnt)`
  .ant-modal-content {
    height: 100%;
    width: 100%;
    border-radius: 6.25rem;
    padding: 5rem;
    .ant-modal-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
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
    margin-top: 1rem;
    font-family: "VisbyCF";
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
  }
  .modal-count-timer {
    font-family: "VisbyCF";
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
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
