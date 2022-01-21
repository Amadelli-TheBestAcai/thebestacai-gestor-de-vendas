import styled, { css } from "styled-components";

import { Tabs as TabsAnt } from "antd";

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
  }

  .ant-tabs-ink-bar,
  .ant-tabs-ink-bar-animated {
    display: none;
  }

  .ant-tabs-nav::before {
    display: none;
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
    height: 750px;
    background: #f7f7f7;
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
`;

export const PaymentTypesContainer = styled.div`
  display: flex;
  background: red;
  width: 100%;
  height: 450px;
`;

export const PaymentTypes = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
  height: 100%;
`;

export const CardType = styled.div`
  width: 210px;
  height: 407px;
  background: #ffffff;
  box-shadow: 0px 4px 6px rgba(163, 163, 163, 0.28);
  border-radius: 20px;
`;

export const ChartContainer = styled.div`
  display: flex;
  width: 30%;
  height: 100%;
  background: yellow;
`;

export const Footer = styled.footer``;
