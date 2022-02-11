import styled, { css } from "styled-components";

import {
  Home,
  CashRegister,
  Motorcycle,
  Retweet,
  Box,
  Coins,
  Scroll,
  ChartBar,
  Settings,
  LogOut,
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

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 5rem;
      height: 5rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 4.3rem;
    height: 4.3rem;
  }
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 85%;
  width: 100%;
`;

export const CardIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3.7rem;
  color: var(--orange-250);
  border-radius: 9px;
  transition: 0.3s;
  margin-bottom: 2rem;

  :hover {
    background: var(--orange-250);
    color: var(--black-opaco);
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 2.8rem;
      margin-bottom: 1.5rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.4rem;
    margin-bottom: 1rem;
  }

  :last-child {
    position: absolute;
    bottom: 0;
  }
`;

const IconCSS = css`
  height: 1.8rem;
  width: 1.8rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 1.5rem;
      width: 1.5rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 1.2rem;
    width: 1.2rem;
  }
`;

export const HomeIcon = styled(Home)`
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

export const ChartIcon = styled(ChartBar)`
  ${IconCSS}
`;

export const SettingsIcon = styled(Settings)`
  ${IconCSS}
`;

export const LogOutIcon = styled(LogOut)`
  ${IconCSS}
`;
