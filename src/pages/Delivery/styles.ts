import styled, { css } from "styled-components";

import MonetaryInput from "../../components/MonetaryInput";

import { Tabs as TabsAnt, Input as InputAnt, Select as SelectAnt } from "antd";

import {
  Ifood,
  Whatsapp,
  Aiqfome,
  PhoneIphone,
  TelephoneFill,
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

export const TabPaneContainer = styled.div`
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

  label {
    position: absolute;
    top: 5px;
    left: 10px;
    width: 32px;
    height: 32px;
    padding: 0;
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
    font-weight: normal;
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
  height: 10%;

  .ant-select-selector,
  .ant-input {
    height: 3.7rem !important;
    align-items: center;
  }
`;

export const Input = styled(InputAnt)`
  width: 40%;
`;

export const Select = styled(SelectAnt)`
  width: 25%;
`;

export const Option = styled(SelectAnt.Option)``;

export const InputValue = styled(InputAnt)`
  width: 100%;
  height: 15%;
  border: 1px solid #bebebe !important;
  background: white !important;
  font-size: 2.5rem;
  text-align: end;
  font-weight: 500;
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
  margin-top: 2rem;
`;

const ButtonCSS = css`
  border-radius: 10px;
  width: 50%;
  height: 70px;
  font-weight: bold;
  font-size: 1.2rem;
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

export const OrdersListContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const IconCSS = css`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
  color: var(--grey-90);
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
