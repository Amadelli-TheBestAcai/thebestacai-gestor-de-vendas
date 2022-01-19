import styled, { css } from "styled-components";

import { CashRegister } from "../../styles/Icons";

const DefaultCSS = css`
  display: flex;
  align-items: center;
  width: 100%;
`;

interface IStatusButton {
  available: boolean;
}

export const Container = styled.div`
  ${DefaultCSS}
  flex-direction: column;
  height: 100%;
`;

export const CardCashContainer = styled.div`
  ${DefaultCSS}
  height: 75%;
  justify-content: space-between;
  padding: 0 1rem;
`;

export const CardCash = styled.button`
  ${DefaultCSS}
  height: 100%;
  background: var(--orange-250);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 2rem;

  span,
  svg,
  p {
    color: var(--brown-500);
  }

  :disabled {
    background: var(--gray-50);

    span,
    svg,
    p {
      color: var(--grey-80);
    }
    cursor: no-drop;
  }
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 50%;
`;

export const CashIcon = styled(CashRegister)`
  width: 5.5rem;
  height: 5.5rem;
`;

export const InfoCash = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 50%;

  span {
    font-family: "Pathway Gothic One", sans-serif;
    font-size: 80px;
    margin-bottom: 0px;
  }

  p {
    margin-bottom: 0px;
  }
`;

export const ButtonStatusContainer = styled.div`
  margin-top: 1rem;
  justify-content: space-between;
  height: 25%;
`;

export const StatusButton = styled.div<IStatusButton>`
  padding: 5px 1rem;
  border-radius: 4px;
  font-size: 0.8rem;

  ${({ available }) => {
    if (available) {
      return css`
        border: 1px solid var(--green-400);
        background: #f6ffed;
        color: var(--green-400);
      `;
    }
  }}
`;
