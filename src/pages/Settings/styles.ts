import styled from "styled-components";

import {
  Select as SelectAnt,
  Switch as SwitchAnt,
  Button as ButtonAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

export const PageContent = styled.div`
  position: relative;
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
`;

export const Footer = styled.footer`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  width: 100%;
  height: 10%;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const ButtonSave = styled(ButtonAnt)`
  width: 113px;
  height: 50px;
  background: var(--orange-250);
  color: var(--brown-500);
  border-radius: 5px;
  font-weight: 500;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--brown-500);
    border: none;
  }
`;

export const ContentCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 10%;
  background: var(--white);
  box-shadow: 0px 4px 6px rgba(163, 163, 163, 0.28);
  border-radius: 0px;

  .ant-select-selector,
  .ant-input {
    height: 3.7rem !important;
    align-items: center;
  }
`;

export const SelectsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 2%;
  justify-content: space-evenly;
  width: 22%;
  height: 100%;
`;

export const Select = styled(SelectAnt)`
  width: 100%;
`;

export const Option = styled(SelectAnt.Option)``;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 10%;
  height: 100%;

  span {
    color: #949494;
    font-size: 0.9rem;
    margin-top: 3%;
  }
`;

export const Switch = styled(SwitchAnt)`
  zoom: 1.1;
`;
