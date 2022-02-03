import styled from "styled-components";

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
`;

export const Row = styled(RowAnt)``;

export const Collapse = styled(CollapseAnt)`
  .ant-collapse-item-disabled {
    .ant-col {
      color: var(--black-opaco);
    }
  }
`;

export const Panel = styled(CollapseAnt.Panel)``;

export const SalesHistoryContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
  background: #f9f9f9;
  margin-top: 1rem;
  padding: 1rem;
`;
