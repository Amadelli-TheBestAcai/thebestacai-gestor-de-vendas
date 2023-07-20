import styled from "styled-components";
import { Search } from "../../styles/Icons";

import MonetaryInput from "../../components/MonetaryInput";

import {
  Modal as ModalAnt,
  Select as SelectAnt,
  Input as InputAnt,
  Spin as SpinAnt,
} from "antd";

export const Container = styled(ModalAnt)`
  .ant-modal-body {
    input {
      height: 3.4rem !important;
    }

    .ant-select-selector,
    .ant-form-item-control-input {
      align-items: center;
      border-radius: 0.7rem;
      height: 3.4rem;
      outline: none !important;
      border: none !important;
      box-shadow: 0 0 0 0 !important;
      border: none !important;
      background: var(--white-70);

      :focus,
      :active,
      :hover {
        outline: none;
        border: none;
        box-shadow: 0 0 0 0;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 330px !important;
  }
`;

export const InputMask = styled(MonetaryInput)`
  border: none;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

export const ButtonCancel = styled.button`
  font-size: 0.9rem;
  color: var(--orange-250);
  font-weight: 500;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

export const ButtonSave = styled.button`
  padding: 3px 7px;
  font-weight: 500;
  border-radius: 1rem;
  font-size: 0.9rem;
  background: var(--orange-250);
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-200);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Select = styled(SelectAnt)`
  width: 100%;
  margin: 10px 0;
`;

export const Option = styled(SelectAnt.Option)``;

export const Input = styled(InputAnt)``;

export const Spin = styled(SpinAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 100%;
  background: var(--white);
  border-radius: 7px 0px 0px 7px;
  padding: 5px;
  cursor: pointer;
`;

export const SearchIcon = styled(Search)`
  width: 1rem;
  height: 1rem;
  color: var(--grey-80);

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 0.8rem;
    height: 0.8rem;
  }
`;

