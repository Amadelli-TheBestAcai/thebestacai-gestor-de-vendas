import styled, { css } from "styled-components";

import { CheckboxBlankCircle, CheckboxCircle } from "../../styles/Icons";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  width: 100%;
  max-height: 100%;
`;

export const CardOrder = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 12rem;
  background: var(--white);
  border: 1px solid var(--grey-70);
`;

export const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20%;
  border-bottom: 1px solid var(--grey-70);
  background: var(--white-25);
  font-size: 1rem;
  color: var(--grey-100);
  padding: 0 1rem;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  height: 80%;

  label {
    text-transform: uppercase;
    font-weight: normal;
    font-size: 1rem;
    color: var(--grey-100);
  }

  span {
    color: var(--green-400);
    margin-top: 1rem;
  }
`;

const IconCSS = css`
  width: 1.5rem;
  height: 1.5rem;
  color: white;

  circle {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
`;

export const CheckboxIcon = styled(CheckboxBlankCircle)`
  ${IconCSS}
`;
