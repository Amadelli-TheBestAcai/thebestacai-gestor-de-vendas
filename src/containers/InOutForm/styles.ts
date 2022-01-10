import styled from "styled-components";

import {
  Modal as ModalAnt,
  Row as RowAnt,
  Col as ColAnt,
  Select as SelectAnt,
  Input as InputAnt,
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
`;

export const Content = styled.div`
  height: 100%;
  width: 100%;
`;

export const Col = styled(ColAnt)`
  padding: 3px;
`;

export const Row = styled(RowAnt)`
  width: 100%;
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
`;

export const Select = styled(SelectAnt)``;

export const Option = styled(SelectAnt.Option)``;

export const Input = styled(InputAnt)``;
