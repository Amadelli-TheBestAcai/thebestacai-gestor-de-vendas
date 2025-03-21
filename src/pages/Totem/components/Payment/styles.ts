import styled, { css } from "styled-components";

import {
  Button as ButtonAnt,
  Modal as ModalAnt,
  Checkbox as CheckboxAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 5rem 2.5rem;
`;

export const HeaderBanner = styled.div`
  display: flex;
  width: 100%;
  height: 15.6rem;
  margin-bottom: 2rem;

  .div-img {
    display: flex;
    justify-content: center;
    width: 27%;
    height: 100%;
    padding: 0 0.65rem;

    img {
      width: 12rem;
      height: 15.6rem;
    }
  }

  .div-title {
    display: flex;
    flex-direction: column-reverse;
    align-items: start;
    width: 73%;
    height: 100%;
    padding: 2.5rem;
  }

  span {
    font-size: 4rem;
    font-weight: 600;
    text-align: center;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 5rem;

  span {
    font-size: 4rem;
    font-weight: 600;
    text-align: center;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;

  span {
    font-size: 2.5rem;
    font-weight: 600;
  }
`;

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 7rem;
  margin: 0.5rem 0;
  font-size: 2.5rem;

  .info-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 1rem 0;
  }

  .info-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0.2rem 0 0;
    font-size: 2.25rem;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2.5rem;

  div {
    display: flex;
    justify-content: space-between;
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
  font-weight: 600;
  font-size: 2.25rem;
  color: var(--black);

  img {
    width: 2.75rem;
    height: 2.75rem;
    background-size: cover;
    background-position: center;
    margin: 0 1rem;
  }
`;

export const Button = styled(ButtonAnt)`
  ${ButtonCSS}
  margin: 1rem 0;
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: 0 4px 4px 0 #00000040;

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
  width: 27.8rem;
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

export const Modal = styled(ModalAnt)`
  .modal-title {
    font-family: "VisbyCF";
    font-size: 3.75rem;
    font-weight: 600;
    text-align: center;
  }

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

      .div-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: 10rem;
        padding: 1rem;

        .ant-checkbox-input,
        .ant-checkbox-inner {
          width: 3rem;
          height: 3rem;
          border: 1px solid var(--black);
        }
        .ant-checkbox-checked .ant-checkbox-inner {
          position: relative;
          background-color: var(--orange-250);
          border: none;
          :after {
            position: absolute;
            top: 45%;
            filter: brightness(0) saturate(100%) invert(0%) sepia(0%)
              saturate(7500%) hue-rotate(313deg) brightness(93%) contrast(107%);
            zoom: 3.5;
          }
        }
        span {
          font-family: "VisbyCF";
          font-size: 2rem;
          font-weight: 600;
        }
      }
    }
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
`;

export const Checkbox = styled(CheckboxAnt)`
  margin: 0 0.625rem;
`;

export const ButtonModal = styled(ButtonAnt)`
  ${ButtonCSS}
  margin: 1rem;
  width: 27.8rem;
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

export const ButtonPrintModal = styled(ButtonAnt)`
  ${ButtonCSS}
  margin: 1rem;
  width: 27.8rem;
  background: var(--orange-250);
  color: var(--black);
  border: none;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;
