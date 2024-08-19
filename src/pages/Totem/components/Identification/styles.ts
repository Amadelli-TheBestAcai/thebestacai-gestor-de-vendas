import styled from "styled-components";
import { Button as ButtonAnt, Input as InputAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;

  .pin-pad {
    display: flex;
    flex-wrap: wrap;
    width: 12rem;
  }

  .user-info,
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const PinPadOption = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 5px;
  height: 3rem;
  width: 3rem;
  margin: 0.25rem;

  cursor: pointer;
`;

export const Input = styled(InputAnt)``;

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
