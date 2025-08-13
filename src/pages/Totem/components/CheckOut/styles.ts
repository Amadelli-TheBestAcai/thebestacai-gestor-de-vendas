import styled, { css } from "styled-components";

import {
  Checkbox as CheckboxAnt,
  Button as ButtonAnt,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1.25rem 2.5rem 0;
`;

export const Header = styled.div`
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

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: 600;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2.5rem;
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
    width: 100%;
  }
`;

export const CpfInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 10rem;
  border-bottom: 2px solid var(--brown-300);

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
      filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7500%)
        hue-rotate(313deg) brightness(93%) contrast(107%);
      zoom: 3.5;
    }
  }

  .info-header {
    span {
      font-size: 2.5rem;
    }
  }
  .info-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0.5rem 0;
    font-size: 2.25rem;
  }
`;

export const ClubInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 10rem;
  margin-top: 0.5rem;
  border-bottom: 2px solid var(--brown-300);

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
      filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7500%)
        hue-rotate(313deg) brightness(93%) contrast(107%);
      zoom: 3.5;
    }
  }

  .info-header {
    span {
      font-size: 2.5rem;
    }
  }

  .info-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 1.5rem 0;
    font-size: 2.5rem;
  }
`;

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 7rem;
  margin-top: 0.5rem;
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

export const ButtonCupom = styled(ButtonAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16.3rem;
  height: 3.6rem;
  background: var(--orange-250);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6rem;
  color: var(--black);
  border: none;
  border-radius: 0.61rem;
  box-shadow: none;
  :hover {
    background: var(--orange-250);
    color: var(--black);
    border: none;
    box-shadow: none;
  }

  img {
    margin-right: 0.5rem;
    width: 1.6rem;
    height: 1.6rem;
  }
`;

export const Checkbox = styled(CheckboxAnt)`
  margin: 0 0.625rem;
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27.8rem;
  height: 7.68rem;
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
