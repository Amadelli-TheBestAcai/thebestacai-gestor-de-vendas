import styled, { css } from "styled-components";
import { Search, PlayCircle, PauseCircle } from "../../styles/Icons";
import {
  Select as SelectAnt,
  Button as ButtonAnt,
  Tabs as TabsAnt,
  Input as InputAnt,
  Checkbox as CheckboxAnt,
  Collapse as CollapseAnt,

} from "antd";
const { Panel } = CollapseAnt;

export const Option = styled(SelectAnt.Option)``;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  p{
    color: var(--grey-100);
  }
`;

export const DisplayLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ContentScroll = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 75vh;
`;

export const TabPaneElement = styled(TabsAnt.TabPane)`
  font-size: 2rem;


`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin-top: 10rem;
`;

export const SideMenu = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  min-width: 23rem;
  height: 79vh;
  box-shadow: 4px 0px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const ContentCards = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 24.8rem;
  overflow: scroll;
  overflow-x: hidden;
`;

interface IStatusProps {
  status?: string;
}

export const HeaderCard = styled.header<IStatusProps>`
  display: flex;
  width: 100%;
  padding: .2rem 1rem;
  justify-content: space-between;
  background-color: var(--orange-250);
  font-size: .9rem;
  color: var(--white);

  :first-child{
    margin-top: .5rem;
  }
`;

export const ContentCollapse = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ContentSelect = styled.div`
  padding: 0 0 0 16px; 
  width: 100%;
`;

export const Select = styled(SelectAnt)`
  border: 0;
  border-bottom: 1px solid var(--grey-60);
  width: 95%;
  height: 40px;
  padding: 8px;
  color: var(--grey-60);
  margin-top: 1rem;

  .ant-select-selector {
    background: transparent !important;
    display: flex;
    align-items: end;
    padding: 0;
  }

  .ant-select-arrow {
    color: var(--grey-60);
    display: flex;
    align-items: end;
  }
`;

export const Button = styled(ButtonAnt)`
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--grey-60);
  border-radius: 4px;
  width: 100%;
  transition: 0.3s ease-in-out;
  color: var(--grey-60);

  :hover {
    border: 2px solid var(--grey-60);
    color: var(--grey-60);
  }
`;

export const ContentButton = styled.div`
  display: flex;
  margin-top: 18px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
`;

export const SearchIcon = styled(Search)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;

export const Tabs = styled(TabsAnt)`
  display: flex;
  justify-content: start !important;
  padding: 0 1rem;

  .ant-tabs-tab {
    display: flex;
    font-size: 1.2rem;
    color: black !important;
    justify-content: start !important;
    margin-right: 2rem !important;
  }

  .ant-tabs-nav-list {
    display: flex;
    justify-content: start !important;
  }

  .ant-tabs-tab-btn:hover{
    opacity: 50% !important;
  }
  .ant-tabs-tab-btn:focus{
    color: var(--orange-250) !important;
  }

  .ant-tabs-tab-btn.ant-tabs-tab-active {
    color: var(--orange-250) !important; 
  }

  .ant-tabs-tab-btn:active{
    color: var(--orange-250) !important;
  }

  .ant-tabs-nav-list {
    display: flex;
    justify-content: start;
  }
`;

export const FilterButton = styled.div`
  display: inline-block;
  position: relative;
`;

export const ContentTitleCollapse = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
`;

export const TitleDisposition = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const TitleDispositionBottom = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: .5rem;
`;

export const ComplementalGroupName = styled.span`
  font-size: 1.2rem;
`;

export const FilterButtonContent = styled(Button)`
  ${Button}
`;

export const ContentGeneral = styled.div`
  display: flex;
  width: 100%;
`;

export const ContentMenuItems = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

export const PageContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 4rem;
  overflow: hidden;
`;

export const Card = styled.div`
    width: 250px;
    height: 67px;
    color: red;
    margin-left: 20px;
`;

export const Input = styled(InputAnt)`
   padding: .5rem;
   width: 50%;
`;

export const ButtonPause = styled(ButtonAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid var(--orange-250);
  color: var(--orange-250);
  padding: 1.2rem 1rem;
  border-radius: .4rem;
  width: 100%;
`;

export const CardScheduled = styled.div`
  width: 40rem;
  height: 100%;
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: .4rem;
  padding: 2rem;

  p {
    font-weight: 400;
    font-size: 1rem;
    color: var(--grey-90);
    display: block;
  }

  b{
    font-weight: 500;
    color: var(--grey-100);
  }
`;

export const ContentSideMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: start;
`;

export const Footer = styled.footer`
    position: absolute;
    width: 100%;
    border-top: 1px solid var(--grey-60);
    padding: 1rem;
    bottom: 0;

    .content-footer{
      display:flex;
      justify-content: space-between;
      width: 90%;
    }

    .order-name{
      font-size: 1.1rem;
      color: var(--gray-100);
    }

    span{
      display: block;
      color: var(--grey-100);
      font-size: 1rem;
    }
`;

export const ContentInsideMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-bottom: 2rem;

  p {
    color: white;
  }
`;

export const ContentHome = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

export const CardHome = styled.div`
  background-color: var(--gray-10);
  padding: 1.3rem;
  border-radius: .9rem;
  display: flex;
  flex-direction: column;
  font-weight: 400;
  color: var(--grey-100);

  h3{
    font-size: .9rem;
  }

  span{
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }

  p{
    font-size: 2rem;
    font-weight: bold;
    color: black;
    margin-bottom: 0;
  }

  .content{
    display: flex;
    align-items: start;
    flex-direction: column;
  }

  .container-card {
    display: flex;
    justify-content: space-between;
    width: 65%;
  }

  .hourTime{
    background-color: white;
    border-radius: .3rem;
    padding: .2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .infoDelivery{
    display: flex;
    flex-direction: column;

    span{
      font-size: .9rem;
      color: var(--gray-60);
    }
  }
`;

export const Collapse = styled(CollapseAnt)`
  background-color: transparent;
  border: none;

  .ant-collapse-header,
  .ant-collapse-content-box {
    color: var(--grey-100) !important;
    font-weight: 400;
    border-left: 1px solid var(--grey-60);
    border-right: 1px solid var(--grey-60);
    padding: 0 1rem 1rem;
  }

  .ant-collapse-content {
    border: 1px solid var(--gray-100);
    border-width: 1px 0;
  }

  .ant-collapse-content-box {
    background: var(--gray-20);
  }

  &:last-child {
    border-bottom: 1px solid var(--gray-100);
    .ant-collapse-content {
      border-bottom-width: 1px;
    }
  }
`;

export const CollapseItem = styled(CollapseAnt)`
  background-color: transparent;
  border: none;

  .ant-collapse-header {
    font-weight: 400;
    background: var(--white);

    padding-right: 1.5rem;

    border: 1px solid var(--gray-100);
    border-radius: 0;
  }
`;

export const PanelAnt = styled(Panel)`
  .ant-collapse-header {
    font-size: 1.3rem;
  }
`;

export const CollapseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 1.2rem;
  padding: 1.5rem 2rem;
  color: var(--grey-100);
  background-color: var(--gray-10);
  border: 1px solid var(--grey-60);
  border-radius: .4rem .4rem 0 0;
  margin-top: 1rem;
`;

export const PanelContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ItemDescription = styled.span`
  font-size: 0.9rem;
  color: var(--grey-60);
  margin-left: 1rem;
`;

export const ItemPrice = styled.span`
  font-size: .9rem;
  font-weight: 500;
  color: var(--grey-100);
  width: 5%;
`;

export const PlayIcon = styled(PlayCircle)`
  width: 1.5rem;
  height: 1.5rem;
  color: var(--grey-100);
  margin-left: .5rem;
`;

export const PauseIcon = styled(PauseCircle)`
  width: 1.5rem;
  height: 1.5rem;
  color: var(--grey-100);
  margin-left: .5rem;
`;
