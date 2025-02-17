import styled, { css } from "styled-components";
import { InfoCircle } from "../../styles/Icons";

import {
  Select as SelectAnt,
  Switch as SwitchAnt,
  Button as ButtonAnt,
  Input as InputAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  height: 90%;
  background: var(--white);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  padding: 1rem 1rem 2rem;
  overflow-y: scroll;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
    }
  }
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

export const DisabledButtonStyle = css`
  opacity: 0;
  pointer-events: none;
  border: 0;
  color: transparent;
`;

export const Button = styled(ButtonAnt)`
  height: 50px;
  padding: 0 1rem;
  background: var(--orange-250);;
  color: white;
  border: 1px solid var(--orange-250);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  z-index: 10;
  &&&:hover,
  &&&:active, 
  &&&:focus {
    background: var(--orange-250);;
    color: white;
    border: 1px solid var(--orange-250);
    opacity: 80;
  }

  &.disabled-button {
    ${DisabledButtonStyle}
  }
`;

export const ContentButton = styled.div`
  display: flex;
  align-items: center;
  margin-left: 2%;
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

  margin-right: 1.5rem;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--brown-500);
    border: none;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 105px;
      height: 40px;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 100px;
    height: 35px;
    font-size: 0.8rem;
  }
`;

export const SelectsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 2%;
  justify-content: space-evenly;
  width: 30%;
  height: 100%;
`;

export const Select = styled(SelectAnt)`
  width: 100%;
`;

export const InputPortCOM = styled(InputAnt)``;

export const Option = styled(SelectAnt.Option)``;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  height: 100%;
  flex-direction: column;
  margin-left: 50px;

  span {
    color: #949494;
    font-size: 0.9rem;
    margin-top: 3%;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    span {
      font-size: 0.8rem;

      @media (max-height: 900px) {
        font-size: 0.75rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    span {
      font-size: 0.7rem;
    }
  }
`;

export const Switch = styled(SwitchAnt)`
  zoom: 1.1;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    zoom: 1;

    @media (max-height: 900px) {
      zoom: 0.9;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    zoom: 0.8;
  }
`;

export const StoreChange = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .storeObservation {
    border-left: 1px solid;
    margin-left: 1rem;
    padding: 2px;
    color: var(--grey-80);
    font-size: 14px;
  }
`;

export const ButtonSaveStore = styled(ButtonAnt)`
  width: 113px;
  height: 50px;
  background: var(--orange-250);
  color: var(--brown-500);
  border-radius: 5px;
  font-weight: 500;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  margin-right: 1.5rem;

  &.disabled-button {
    ${DisabledButtonStyle}
  }

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--brown-500);
    border: none;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 105px;
      height: 40px;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 100px;
    height: 35px;
    font-size: 0.8rem;
  }
`;

export const InfoIcon = styled(InfoCircle)`
  width: 1.2rem;
  height: 1.2rem;
  color: var(--red-600);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 1.1rem;
      height: 1.1rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 1rem;
    height: 1rem;
  }
`;
