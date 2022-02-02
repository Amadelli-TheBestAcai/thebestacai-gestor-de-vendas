import styled from "styled-components";
// import BackgroundImg from "../../assets/svg/backgroundLogin.svg";

import { Button, Input as InputAnt } from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const LeftContent = styled.div`
  width: 60%;
  height: 100%;

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
`;

export const Logo = styled.img`
  width: 12rem;
  height: 12rem;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 65%;
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
  }
`;

export const Input = styled(InputAnt)``;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 5%;

  button {
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
`;

export const LoginButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3.3rem;
  margin-top: 1.5rem;
  border-radius: 8px;
  background: var(--orange-250);
  color: white;
  font-weight: 500;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  transition: 0.5s;

  :hover,
  :active,
  :focus {
    background: var(--orange-200);
    border: none;
    color: white;
  }
`;

export const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3.3rem;
  margin-top: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--orange-250);
  color: var(--orange-250);
  font-weight: 500;
  transition: 0.5s;

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
    color: var(--purple-450);
  }
`;
