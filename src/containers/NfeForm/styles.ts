import styled from "styled-components";
import MaskInput from "react-input-mask";

import {
  Modal as ModalAnt,
  Form as FormAnt,
  Row as RowAnt,
  Col as ColAnt,
  Input as InputAnt,
  Select as SelectAnt,
} from "antd";

export const Container = styled(ModalAnt)`
  .ant-modal-body {
    overflow-y: scroll;
    max-height: 450px;
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
    width: 430px !important;

    .ant-modal-body {
      max-height: 400px;

      .ant-select-selector,
      .ant-form-item-control-input {
        height: 3rem;
        font-size: 0.8rem;
      }

      .ant-form-item-label > label {
        font-size: 0.8rem;
      }

      .ant-select-selection-item {
        font-size: 0.8rem;
      }
    }
  }
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

export const Form = styled(FormAnt)``;

export const FormItem = styled(FormAnt.Item)`
  margin: 5px;
`;

export const Col = styled(ColAnt)`
  padding: 3px;
`;

export const Row = styled(RowAnt)`
  width: 100%;
`;

export const Input = styled(InputAnt)``;

export const Select = styled(SelectAnt)`
  width: 100%;
`;

export const Option = styled(SelectAnt.Option)``;

export const InputMask = styled(MaskInput)``;

export const TotalValue = styled(InputAnt)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 2.5rem;
  background: var(--white-40);
  border: 1px solid var(--grey-70);
  padding: 1rem;

  strong {
    margin-left: 3px;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.3rem;
    font-size: 0.8rem;
  }
`;
