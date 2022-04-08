import styled from "styled-components";
import MaskInput from "react-input-mask";

import {
  Modal as ModalAnt,
  Form as FormAnt,
  Row as RowAnt,
  Col as ColAnt,
  Input as InputAnt,
  Button,
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

export const ButtonSave = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  transition: 0.5s;
  font-weight: 500;
  background: var(--orange-250);
  color: white;
  padding: 3px 7px;
  font-size: 0.9rem;

  :hover,
  :active,
  :focus {
    background: var(--orange-200);
    border: none;
    color: white;
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

export const InputMask = styled(MaskInput)``;
