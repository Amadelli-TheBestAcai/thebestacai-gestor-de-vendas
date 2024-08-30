import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5rem 0;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  span {
    font-size: 4rem;
    font-weight: 600;
    text-align: center;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 12rem 0;
  font-weight: 600;

  .option-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 55rem;
    height: 17.37rem;
    margin-bottom: 5rem;
  }
  .option-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 55rem;
    height: 17.37rem;
    margin-bottom: 5rem;
  }
`;

export const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: solid 1px;
  border-radius: 0.625rem;
  width: 25rem;
  height: 17.37rem;
  padding: 1.25rem;
  font-size: 2.25rem;
  background: var(--orange-250);
  border: none;

  cursor: pointer;
`;

const IconCSS = css`
  height: 10.93rem;
  width: 10.93rem;
  cursor: pointer;
`;

export const Icon = styled.img`
  ${IconCSS}
  background-size: cover;
  background-position: center;
`;
