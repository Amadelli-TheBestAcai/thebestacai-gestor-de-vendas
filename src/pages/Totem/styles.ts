import styled, { css } from "styled-components";

import { Button as ButtonAnt, Input as InputAnt } from "antd";

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
}

export const Content = styled.div<IContent>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  ${({ customHeight }) => {
    if (customHeight)
      return css`
        height: ${customHeight};
      `;
  }}
`;

export const Button = styled(ButtonAnt)`
  width: 113px;
  height: 50px;
  background: var(--orange-250);
  color: var(--brown-500);
  border-radius: 5px;
  font-weight: 500;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  margin-right: 1.5rem;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--brown-500);
    border: none;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 105px;
      height: 40px;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 100px;
    height: 35px;
    font-size: 0.8rem;
  }
`;
