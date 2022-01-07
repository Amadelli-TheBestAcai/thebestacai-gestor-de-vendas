import styled, { css } from "styled-components";

import MonetaryInput from "../../components/MonetaryInput";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const BalanceCSS = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const InputCSS = css`
  background: var(--white-30) !important;
  border: 1px solid var(--grey-70) !important;
  box-sizing: border-box;
  border-radius: 9px;

  font-size: 2.2rem;

  :hover,
  :focus,
  :active {
    border: 1px solid var(--grey-70);
  }
`;

export const RightSide = styled.div`
  ${BalanceCSS}
  width: 60%;
  margin-right: 1rem;

  span {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  input {
    ${InputCSS} !important;
    height: 100%;
  }
`;

export const LefttSide = styled.div`
  justify-content: space-between;

  ${BalanceCSS}
  width: 40%;

  span {
    font-size: 12px;
    line-height: 14px;
    color: var(--grey-80);
  }
`;

export const InfoWeight = styled.div`
  ${InputCSS}
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  font-size: 1rem;

  color: var(--grey-80);
`;

export const InputPrice = styled(MonetaryInput)`
  height: 100%;
`;
