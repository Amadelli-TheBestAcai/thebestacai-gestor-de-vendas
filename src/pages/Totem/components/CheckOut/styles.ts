import styled from "styled-components";

import { Checkbox as CheckboxAnt, Button as ButtonAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 50%;
    height: 80%;
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      margin: 15px 0;
      .info-footer {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 20%;
  }
`;

export const Checkbox = styled(CheckboxAnt)`
  margin: 0 10px;
`;

export const Button = styled(ButtonAnt)`
  width: fit-content;
  height: 50px;
  background: var(--orange-250);
  color: var(--brown-500);
  border-radius: 5px;
  font-weight: 500;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

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
