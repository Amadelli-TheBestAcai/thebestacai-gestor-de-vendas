import styled, { css } from "styled-components";

import { Input as InputAnt, Button as ButtonAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5rem 0;

  .div-footer-info {
    width: 100%;
    padding: 0 2.5rem;
    font-size: 1.75rem;
    font-weight: 600;
    text-align: center;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  span {
    font-size: 4rem;
    font-weight: 600;
    text-align: center;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 12rem 0;
  font-weight: 600;

  .option-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 55rem;
    height: 17.37rem;
    margin-bottom: 5rem;
  }

  .option-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 55rem;
    height: 17.37rem;
    margin-bottom: 5rem;
  }

  .inputContainer {
    display: flex;
    width: 37.5rem;
    height: 5rem;
    input {
      width: 32.5rem;
      height: 100%;
      background: white !important;
      font-weight: 500;
      font-size: 1.75rem;
      color: var(--gray-300) !important;
      border: 1px solid var(--grey-75) !important;
      border-right: none !important;
      border-radius: 0.5rem 0 0 0.5rem !important;
    }
  }
  .span-email {
    color: var(--black);
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .div-pinpad {
    margin: 2rem 0;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2.5rem 0;
`;

export const Input = styled(InputAnt)``;

export const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: solid 1px;
  border-radius: 0.625rem;
  width: 25rem;
  height: 17.37rem;
  padding: 1.25rem;
  font-size: 2.25rem;
  background: var(--orange-250);
  border: none;

  cursor: pointer;
`;

const IconCSS = css`
  height: 10.93rem;
  width: 10.93rem;
  cursor: pointer;
`;

export const Icon = styled.img`
  ${IconCSS}
  background-size: cover;
  background-position: center;
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27.8rem;
  height: 7.68rem;
  margin: 0 1rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 2.25rem;
  color: var(--black);
`;

export const Button = styled(ButtonAnt)`
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

export const ButtonFinalize = styled(ButtonAnt)`
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
