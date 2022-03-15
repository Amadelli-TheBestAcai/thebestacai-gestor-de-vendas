import styled, { css } from "styled-components";

import { Trash, RepeatOutline, Printer, FileInvoice } from "../../styles/Icons";

import {
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
  Collapse as CollapseAnt,
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

export const ListSaleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  margin-top: 2rem;
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
export const NfceIcon = styled(FileInvoice)`
  width: 5%;
  height: 7%;
  cursor: pointer;
`;
