import styled, { css } from "styled-components";

import { Tabs as TabsAnt, Input as InputAnt, Select as SelectAnt } from "antd";

import {
  Ifood,
  Whatsapp,
  Aiqfome,
  PhoneIphone,
  TelephoneFill,
  UiChecks,
} from "../../styles/Icons";

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
    h2 {
      font-size: 1.3rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 1rem;
    }
  }
`;

export const Tabs = styled(TabsAnt)`
  width: 100%;
  margin-top: 1rem;
  .ant-tabs-tab.ant-tabs-tab-active,
  .ant-tabs-tab-btn {
    color: black !important;

    :active,
    :hover,
    :focus {
      color: black;
    }
  }

  .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }

  .ant-tabs-nav-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .ant-tabs-ink-bar,
  .ant-tabs-ink-bar-animated {
    display: none;
  }

  .ant-tabs-nav-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
  }

  .ant-tabs-nav {
    margin: 0px;
  }
`;

export const TabPane = styled(TabsAnt.TabPane)``;

interface ITabPaneContainer {
  isSelected: boolean;
}
export const TabPaneContainer = styled.div<ITabPaneContainer>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 344px;
  height: 113px;
  padding: 2rem;
  background: var(--white-30);
  border: 1px solid var(--grey-60);
  color: var(--grey-90);
  transition: 0.2s;

  label {
    position: absolute;
    top: 5px;
    left: 10px;
    width: 32px;
    height: 32px;
    padding: 0;
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      color: var(--orange-250);
      border: 1px solid var(--orange-250);
      border-top: 5px solid var(--orange-250);

      svg {
        color: var(--orange-250);
      }
    `}

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    width: 300px;
    height: 113px;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    width: 284px;
    height: 100px;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 250px;
    height: 90px;

    label {
      font-size: 0.7rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 241px;
    height: 80px;

    label {
      font-size: 0.6rem;
    }
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    width: 220px;
  }
`;

export const LabelCardTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    margin-bottom: 0;
  }

  span {
    font-size: 1.4rem;
    font-weight: 500;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    span {
      font-size: 1.2rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    span {
      font-size: 1rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    span {
      font-size: 0.8rem;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 1rem;
`;

const ContentCSS = css`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 100vh;

  h2 {
    color: var(--grey-90);
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    h2 {
      font-size: 1rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 0.8rem;
    }
  }
`;

export const LeftContainer = styled.div`
  ${ContentCSS}
  margin-right: 1rem;
`;

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5%;
  margin-bottom: 1rem;

  .ant-select-selector,
  .ant-input {
    height: 3.7rem !important;
    align-items: center;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-select-selector,
    .ant-input {
      height: 3rem !important;
      align-items: center;
      font-size: 0.8rem;
    }
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    .ant-select-selector,
    .ant-input {
      font-size: 0.7rem;
    }
  }
`;

export const Input = styled(InputAnt)`
  width: 40%;
`;

export const Select = styled(SelectAnt)`
  width: 25%;
`;

export const Option = styled(SelectAnt.Option)``;

export const InputValue = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 3%;
  width: 100%;
  height: 15%;
  border: 1px solid var(--grey-70) !important;
  background: white !important;
  font-size: 2.5rem;
  text-align: end;
  font-weight: 500;

  span {
    position: absolute;
    font-size: 0.9rem;
    color: var(--grey-80);
    top: 2%;
    left: 2%;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 2rem;

      span {
        font-size: 0.8rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 1.7rem;

    span {
      font-size: 0.7rem;
    }
  }
`;

export const PaymentsContainer = styled.div`
  width: 100%;
  height: 20%;
  margin-top: 1rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 22%;
`;

const ButtonCSS = css`
  border-radius: 10px;
  width: 50%;
  height: 70px;
  font-weight: bold;
  font-size: 1.2rem;

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    height: 60px;
    font-size: 1rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    height: 55px;
    font-size: 0.9rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 45px;
    font-size: 0.8rem;
  }
`;

export const ButtonCancel = styled.button`
  ${ButtonCSS}
  border: 1px solid var(--red-600);
  color: var(--red-600);
  margin-right: 1rem;
`;

export const ButtonConfirm = styled.button`
  ${ButtonCSS}
  background: var(--orange-450);
  color: var(--brown-500);
  margin-left: 1rem;
`;

export const RightContainer = styled.div`
  ${ContentCSS}
  margin-left: 1rem;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const OrdersListContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const IconCSS = css`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.6rem;
  color: var(--grey-90);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    width: 1.2rem;
    height: 1.2rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

export const IfoodIcon = styled(Ifood)`
  ${IconCSS}
`;

export const WhatsappIcon = styled(Whatsapp)`
  ${IconCSS}
`;

export const AiqfomeIcon = styled(Aiqfome)`
  ${IconCSS}
`;

export const AppIcon = styled(PhoneIphone)`
  ${IconCSS}
`;

export const TelephoneIcon = styled(TelephoneFill)`
  ${IconCSS}
`;

export const CheckAll = styled(UiChecks)`
  ${IconCSS}
  cursor: pointer;
  color: var(--green-400);
`;
