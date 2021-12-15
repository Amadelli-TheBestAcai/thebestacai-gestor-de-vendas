import styled, { css } from "styled-components";

import {
  Home,
  ListAlt,
  CashRegister,
  Motorcycle,
  Retweet,
  Box,
  Coins,
  Scroll,
} from "../../styles/Icons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  background: var(--black-opaco);
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15%;
  width: 100%;
`;

export const Logo = styled.img`
  width: 5.5rem;
  height: 5.5rem;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 85%;
  width: 100%;
`;

const IconCSS = css`
  height: 1.8rem;
  width: 1.8rem;
  color: var(--orange-250);
  margin-bottom: 3rem;
  cursor: pointer;
`;

export const HomeIcon = styled(Home)`
  ${IconCSS}
`;

export const Listicon = styled(ListAlt)`
  ${IconCSS}
`;

export const CashRegisterIcon = styled(CashRegister)`
  ${IconCSS}
`;

export const DeliveryIcon = styled(Motorcycle)`
  ${IconCSS}
`;

export const RetweetIcon = styled(Retweet)`
  ${IconCSS}
`;

export const BoxIcon = styled(Box)`
  ${IconCSS}
`;

export const CoinsIcon = styled(Coins)`
  ${IconCSS}
`;

export const ScrollIcon = styled(Scroll)`
  ${IconCSS}
`;
