import styled from "styled-components";

import { Button as ButtonAnt, Modal as ModalAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100%;

  .header,
  .content,
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .header {
    justify-content: flex-start;
    height: 25%;
  }
  .content {
    justify-content: center;
    height: 50%;
  }
  .footer {
    justify-content: center;
    height: 25%;
  }
`;

export const Modal = styled(ModalAnt)``;

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

export const NpsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px;
    border-radius: 5px;
    height: 5rem;
    width: 5rem;

    cursor: pointer;
  }
`;
