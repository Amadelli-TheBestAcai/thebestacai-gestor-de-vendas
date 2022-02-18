import styled, { css } from "styled-components";
import BackgroundImg from "../../assets/svg/backgroundLogin.svg";

import { Button, Input as InputAnt, Checkbox as CheckboxAnt } from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const LeftContent = styled.div`
  width: 60%;
  height: 100%;
  background-image: url(${BackgroundImg});
  background-repeat: no-repeat;
  background-size: content;
  object-fit: cover;
`;

export const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 100%;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 30%;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 25%;
  }
`;

export const Logo = styled.img`
  width: 12rem;
  height: 12rem;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    width: 10rem;
    height: 10rem;

    @media (max-height: 900px) {
      width: 9rem;
      height: 9rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 8rem;
    height: 8rem;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 65%;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 70%;
  }
`;

export const FormContent = styled.div`
  width: 60%;
  height: 100%;
  margin-top: 2rem;
  font-weight: normal;

  h3 {
    font-size: 1.2rem;
    color: var(--black-opaco);
  }

  p {
    color: var(--grey-80);
  }

  label {
    color: var(--grey-80);
  }

  .ant-form-item-control-input,
  .ant-select-selector {
    height: 3.7rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 55%;
      h3 {
        font-size: 1.1rem;
      }

      p {
        font-size: 0.9rem;
      }

      .ant-form-item-label > label {
        font-size: 0.8rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.8rem;
    }

    .ant-form-item {
      margin-bottom: 1rem;

      .ant-form-item-control {
        height: 3.4rem;
      }
    }
  }
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 5%;

  span {
    margin-right: 1.9rem;
    font-size: 12px;
    color: var(--grey-80);

    @media (max-width: 1600px) {
      @media (max-height: 900px) {
        font-size: 0.6rem;
      }
    }
  }
`;

export const Input = styled(InputAnt)`
  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 5%;

  a {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: var(--grey-100);

    :last-child {
      color: var(--orange-250);
      font-weight: 500;
    }
  }

  input[type="checkbox"] {
    margin-right: 8px;
  }

  div.remember_user {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    a {
      font-size: 0.7rem;
    }
  }
`;

export const Checkbox = styled(CheckboxAnt)`
  margin-right: 8px;

  .ant-checkbox-inner {
    background: var(--white-90);
    border: none;
  }

  .ant-checkbox-checked {
    border: none;
    .ant-checkbox-inner {
      background: var(--orange-250);
    }
  }
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3.3rem;
  margin-top: 1.5rem;
  border-radius: 8px;
  transition: 0.5s;
  font-weight: 500;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    margin-top: 1rem;
    height: 3rem;
  }
`;

export const LoginButton = styled(Button)`
  ${ButtonCSS}
  background: var(--orange-250);
  color: white;

  :hover,
  :active,
  :focus {
    background: var(--orange-200);
    border: none;
    color: white;
  }
`;

export const BackButton = styled(Button)`
  ${ButtonCSS}
  border: 1px solid var(--orange-250);
  color: var(--orange-250);

  :hover,
  :active,
  :focus {
    border: 1px solid var(--orange-250);
    color: var(--orange-250);
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 20%;

  span {
    color: var(--orange-400);
  }

  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 15%;
      p {
        font-size: 0.8rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 16%;

    p {
      font-size: 0.7rem;
    }
  }
`;
