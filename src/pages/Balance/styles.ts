import styled, { css } from "styled-components";

import { Tabs as TabsAnt } from "antd";

import {
  AttachMoney,
  CreditCard,
  CreditCard2BackFill,
  CheckboxChecked,
  TicketAlt,
  BookmarkMinus,
} from "../../styles/Icons";

import deliveryIcon from "../../assets/svg/deliveryIcon.svg";
import storeIcon from "../../assets/svg/storeIcon.svg";
import fatuIcon from "../../assets/svg/fatuIcon.svg";

interface ITabColor {
  tab_id: number;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--white);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  padding: 1rem;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;

  h2 {
    margin-bottom: 0px;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      h2 {
        font-size: 1.3rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 1.1rem;
    }
  }
`;

export const TabContainer = styled.div`
  width: 100%;
  height: 95%;
`;

export const Tabs = styled(TabsAnt)`
  width: 100%;

  .ant-tabs-nav-wrap {
    display: flex;
    align-items: center;
    color: white;
    height: 20%;
    background: white;
    margin: 2rem 0 2rem 0;

    /*Responsive 1600px*/
    @media (max-width: 1600px) {
      @media (max-height: 900px) {
        margin: 1rem 0 1rem 0;
      }
    }

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      h2 {
        margin: 0.9rem 0 0.9rem 0;
      }
    }
  }

  .ant-tabs-tab {
    margin-right: 10px;

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      margin-right: 5px;
    }
  }

  .ant-tabs-ink-bar,
  .ant-tabs-ink-bar-animated {
    display: none;
  }

  .ant-tabs-nav::before {
    display: none;
  }
  .ant-tabs-tab {
    transition: 0.4s;
    opacity: 0.6;
  }

  .ant-tabs-tab-active {
    opacity: 1;
  }

  .ant-tabs-nav-list {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .ant-tabs-nav {
    margin: 0px;
  }

  .ant-tabs-content {
    width: 100%;
    height: 69vh;
    background: var(--white-30);

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      height: 65vh;
    }

    /*Responsive 1280px*/
    @media (max-width: 1280px) {
      @media (max-height: 1024px) {
        height: 69vh;
      }

      @media (max-height: 960px) {
        height: 68vh;
      }

      @media (max-height: 800px) {
        height: 67vh;
      }

      @media (max-height: 768px) {
        height: 65vh;
      }
    }
  }
`;

export const TabPane = styled(Tabs.TabPane)``;

export const TabPaneContainer = styled.div<ITabColor>`
  width: 543px;
  height: 129px;
  border-radius: 10px;
  padding: 2rem;
  background-repeat: no-repeat;
  background-position: right;
  background-origin: content-box;

  ${({ tab_id }) => {
    if (tab_id === 1) {
      return css`
        background-color: #3e6fc8;
        background-image: url(${deliveryIcon});
      `;
    }
    if (tab_id === 2) {
      return css`
        background-color: #43b868;
        background-image: url(${storeIcon});
      `;
    }
    if (tab_id === 3) {
      return css`
        background-color: #f49345;
        background-image: url(${fatuIcon});
      `;
    }
  }}

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    width: 450px;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 120px;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 390px;
    height: 115px;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 375px;
    height: 110px;
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    @media (max-height: 800px) {
      width: 340px;
    }
    @media (max-height: 720px) {
      height: 100px;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;

  h2 {
    color: #717171;
    font-weight: 500;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    h2 {
      font-size: 1.1rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 1rem;
    }
  }
`;

export const LabelCardTab = styled.div`
  flex-direction: column;
  text-transform: uppercase;
  color: white;

  p {
    margin-bottom: 0;
  }

  span {
    font-size: 2rem;
    font-weight: normal;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      p {
        font-size: 0.8rem;
      }

      span {
        font-size: 1.7rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    p {
      font-size: 0.7rem;
    }

    span {
      font-size: 1.5rem;
    }
  }
`;

export const PaymentTypesContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
`;

export const PaymentTypes = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  height: 100%;

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    width: 75%;
  }
`;

export const CardType = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 19%;
  height: 95%;
  background: var(--white);
  box-shadow: 0px 4px 6px rgba(163, 163, 163, 0.28);
  border-radius: 20px;

  p {
    margin-top: 1rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--grey-100);
  }

  span {
    margin-top: 2rem;
    font-weight: 500;
    font-size: 27px;
    color: var(--blue-700);
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      p {
        font-size: 0.8rem;
      }

      span {
        font-size: 20px;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 18%;
    p {
      font-size: 0.7rem;
    }

    span {
      font-size: 1rem;
    }
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    @media (max-height: 1024px) {
      width: 19%;
      height: 80%;
    }

    @media (max-height: 800px) {
      height: 95%;
    }
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45%;
  height: 25%;
  border-radius: 50%;
  background: var(--white-90);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 41%;
      height: 24%;
    }
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  width: 30%;
  height: 100%;
  padding: 1rem;
  margin-left: 1rem;

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    width: 25%;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      padding: 2rem;
    }
  }
`;

const IconCSS = css`
  width: 40%;
  height: 40%;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 37%;
      height: 37%;
    }
  }
`;

export const MoneyIcon = styled(AttachMoney)`
  ${IconCSS}
  color: var(--blue-700);
`;

export const CreditIcon = styled(CreditCard)`
  ${IconCSS}

  color: var(--blue-500);
`;

export const DebitIcon = styled(CreditCard2BackFill)`
  ${IconCSS}
  color: var(--blue-350);
`;

export const TicketIcon = styled(TicketAlt)`
  ${IconCSS}
  color: var(--purple-450);
`;

export const MinusIcon = styled(BookmarkMinus)`
  ${IconCSS}
  color: var(--grey-80);
`;

export const OnlineIcon = styled(CheckboxChecked)`
  width: 60%;
  height: 60%;
  color: var(--orange-400);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 55%;
      height: 55%;
    }
  }
`;

export const PixIcon = styled.img`
  ${IconCSS}
`;

export const FooterContainer = styled.footer`
  display: flex;
  align-items: end;
  width: 100%;
  height: 40%;

  footer {
    display: flex;
    align-items: end;
    justify-content: space-between;
    width: 100%;
    height: 15%;
    border-top: 1px solid var(--gray-25);

    span {
      color: var(--grey-100);
    }

    /*Responsive 1600px*/
    @media (max-width: 1600px) {
      @media (max-height: 900px) {
        span {
          font-size: 0.8rem;
        }
      }
    }

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      height: 20%;
      span {
        font-size: 0.7rem;
      }
    }

    /*Responsive 1280px*/
    @media (max-width: 1280px) {
      @media (max-height: 1024px) {
        height: 15%;
      }
    }
  }
`;

export const LegendDescription = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 35%;
  height: 100%;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15%;

    #circle {
      margin-right: 9px;
      width: 1rem;
      height: 1rem;
      background: #174275;
      border-radius: 15px;
    }

    /*Responsive 1600px*/
    @media (max-width: 1600px) {
      @media (max-height: 900px) {
        span {
          font-size: 0.7rem;
        }

        #circle {
          width: 0.9rem;
          height: 0.9rem;
        }
      }
    }

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      width: 36%;
      span {
        font-size: 0.6rem;
      }

      #circle {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
      }
    }
  }
`;
