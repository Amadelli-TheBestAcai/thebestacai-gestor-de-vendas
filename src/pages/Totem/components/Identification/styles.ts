import styled from "styled-components";
import { Button as ButtonAnt, Input as InputAnt } from "antd";


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  color: var(--black);

  .title {
    font-family: "VisbyCF";
    font-weight: 600;
    font-size: 4rem;
    color: var(--black);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-family: "VisbyCF";
    height: 8.125rem;
    width: 37.5rem;
    font-weight: 600;
    font-size: 2rem;
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
    button {
      width: 5rem;
      height: 100%;
      background: white;
      box-shadow: none;
      color: var(--gray-300);
      border: 1px solid var(--grey-75);
      border-left: none;
      border-radius: 0 0.5rem 0.5rem 0;
      padding: 0;

      :hover,
      :active,
      :focus {
        background: white;
        box-shadow: none;
        color: var(--gray-300);
      }
    }
  }

  .pin-pad {
    display: flex;
    flex-wrap: wrap;
    width: 12rem;
  }

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
`;

export const ShowPasswordIcon = styled.img`
  width: 1.875rem;
  height: 1.2rem;
  background-size: cover;
  background-position: center;
`;
