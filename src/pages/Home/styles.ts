import styled, { css } from "styled-components";
import { HotKeys } from "react-hotkeys";

export const Container = styled(HotKeys)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0.8rem;
`;

const ContentCSS = css`
  height: 100%;
  background: var(--white);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  padding: 1rem;
`;

export const LeftSide = styled.div`
  ${ContentCSS}
  width: 25%;
  margin-right: 1.2rem;
`;

export const BalanceContainer = styled.div`
  width: 100%;
  height: 15%;
  margin-bottom: 1rem;
`;

export const ItemsContainer = styled.div`
  width: 100%;
  height: 85%;
  background: pink;
`;

export const RightSide = styled.div`
  width: 75%;
  ${ContentCSS}
`;
