import styled, { css } from "styled-components";

import {
  Trash,
  RepeatOutline,
  Printer,
  FileInvoice,
  FileEarmarkPdf,
  Cancel,
} from "../../styles/Icons";

import {
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
  Collapse as CollapseAnt,
  Modal,
  Button,
} from "antd";

const { TextArea } = InputAnt;
interface ITabColor {
  tab_id: number;
}

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
    @media (max-height: 900px) {
      h2 {
        font-size: 1.3rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 1.1rem;
    }
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  height: 5%;
`;

export const Input = styled(InputAnt)`
  height: 3.7rem;
  width: 20%;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 3.4rem;
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3rem;
    font-size: 0.7rem;
  }
`;
export const Textarea = styled(TextArea)`
  height: 3.7rem;
  width: 20%;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 3.4rem;
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3rem;
    font-size: 0.7rem;
  }
`;

export const ListSaleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  margin-top: 2rem;

  .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header,
  .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header {
    padding-left: 0 !important;
    padding-right: 0 !important;

    .ant-collapse-arrow {
      display: none;
    }
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTable = styled(RowAnt)`
  display: flex;
  width: 100%;
  height: 3rem;
  background: var(--black-opaco);
  border-radius: 3px;
  color: white;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 2.7rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.3rem;
    font-size: 0.8rem;
  }
`;

export const HeaderCollapse = styled(RowAnt)`
  display: flex;
  width: 100%;
  height: 1.5rem;
  background: var(--grey-200);

  .ant-col {
    color: white !important;
  }
`;

export const Row = styled(RowAnt)`
  border-top: 1px solid var(--gray-50);
  font-size: 0.9rem;
`;

export const Collapse = styled(CollapseAnt)`
  user-select: none;

  .ant-collapse-item-disabled {
    .ant-col {
      color: var(--black-opaco);

      /*Responsive 1366px*/
      @media (max-width: 1366px) {
        font-size: 0.8rem;
      }
    }
  }
`;

export const Panel = styled(CollapseAnt.Panel)`
  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

export const SalesHistoryContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
  background: #f9f9f9;
  margin-top: 1rem;
  padding: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const IconCSS = css`
  width: 7%;
  height: 7%;
  cursor: pointer;
`;

export const RemoveIcon = styled(Trash)`
  ${IconCSS}
`;
export const RestoreIcon = styled(RepeatOutline)`
  ${IconCSS}
`;
export const PrinterIcon = styled(Printer)`
  ${IconCSS}
`;

export const PdfIcon = styled(FileEarmarkPdf)`
  ${IconCSS}
`;

export const CancelIcon = styled(Cancel)`
  ${IconCSS}
`;

export const NfceIcon = styled(FileInvoice)`
  width: 5%;
  height: 7%;
  cursor: pointer;
`;

export const ModalNFCe = styled(Modal)`
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

export const Label = styled.h4`
  color: var(--red-600);
`;

export const NfceLabel = styled.h4<ITabColor>`
  ${({ tab_id }) => {
    if (tab_id === 1) {
      return css`
        color: var(--green-400);
      `;
    }
    if (tab_id === 2) {
      return css`
        color: var(--red-600);
        cursor: pointer;
      `;
    }
  }}
`;
