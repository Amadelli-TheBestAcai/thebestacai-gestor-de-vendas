import styled, { css } from "styled-components";
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
    font-weight: 600;
    font-size: 4rem;
    color: var(--black);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
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
    justify-content: space-between;
    flex-wrap: wrap;
    width: 20.3rem;
    height: 27.5rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 14.125rem;
    width: 100%;
  }
  .actions-step4 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 14.125rem;
    width: 100%;
  }

  .information-content {
    width: 59.37rem;
    font-weight: 600;
    font-size: 1.75rem;
    text-align: center;
  }
`;

interface IPinpad {
  letters: boolean;
}

export const PinPadOption = styled.div<IPinpad>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 0.37rem;
  height: 5.93rem;
  width: 5.93rem;
  font-family: "Atkinson Hyperlegible" !important;
  font-weight: 700;
  font-size: 1.5rem;
  cursor: pointer;

  ${({ letters }) => {
    if (letters) {
      return css`
        font-weight: 400;
      `;
    }
  }}
`;

export const Input = styled(InputAnt)``;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 59.37rem;
  height: 7.68rem;
  padding: 2.5rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 2.25rem;
  border: none;

  :active,
  :hover,
  :focus {
    background: var(--white);
    color: var(--black);
  }
`;

export const ButtonSendCPF = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--orange-250);
  color: var(--black);
  margin-bottom: 0.5rem;
  box-shadow: #00000040 1.95px 1.95px 2.6px;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;

export const ButtonDontSendCPF = styled(ButtonAnt)`
  ${ButtonCSS}
`;

export const ButtonCancel = styled(ButtonAnt)`
  ${ButtonCSS}
  width: 27.81rem;
  background: var(--white);
  color: var(--black);
  border: 1px solid var(--black);
  :active,
  :hover,
  :focus {
    border: 1px solid var(--black);
  }
`;

export const ShowPasswordIcon = styled.img`
  width: 1.875rem;
  height: 1.2rem;
  background-size: cover;
  background-position: center;
  border-radius: 0.625rem;
`;

export const EraseIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  background-size: cover;
  background-position: center;
`;
