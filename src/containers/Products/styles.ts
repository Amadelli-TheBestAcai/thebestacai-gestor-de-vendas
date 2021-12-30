import styled from "styled-components";
import {
  Spin as SpinAnt,
  Tabs as TabsAnd,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

export const Spin = styled(SpinAnt)``;

export const TabContainer = styled(TabsAnd)`
  width: 100%;
  div.ant-tabs-nav {
    background: var(--primary-orange);
    margin-bottom: 0px;
  }
  div.ant-tabs-nav-wrap {
    display: flex;
    justify-content: center;
  }
  .ant-tabs-tab {
    font-weight: bold;
    line-height: 0.2;
  }
  .ant-tabs-tab-btn {
    color: black !important;
  }
  .ant-tabs-ink-bar {
    position: absolute;
    background: black;
    pointer-events: none;
  }
`;

export const TabItem = styled(TabsAnd.TabPane)``;

export const ProductHeader = styled(RowAnt)`
  display: flex;
  justify-content: space-evenly;
  background: black;
  padding: 1% 0;
`;

export const ProductHeaderCol = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductHeaderDescription = styled.label`
  color: white;
  font-weight: bold;
  font-size: 18px;
`;
