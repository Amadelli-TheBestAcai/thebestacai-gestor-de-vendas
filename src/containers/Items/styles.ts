import styled from "styled-components";

import { Row as RowAnt, Col } from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  flex-direction: column;
`;

export const Header = styled(RowAnt)`
  display: flex;
  width: 100%;
  height: 3rem;
  background: var(--black-opaco);
  border-radius: 3px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;

  /* Responsive 1600 */
  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.7rem;
  }
`;

export const Row = styled(RowAnt)`
  display: flex;
  width: 100%;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  align-items: flex-start;
  overflow-y: scroll;
`;

export const ItemContent = styled.div`
  width: 100%;
  height: 2.8rem;
  margin-top: 8px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-empty-image {
      height: 230px !important;
    }

    .ant-empty-description {
      font-size: 0.8rem;
    }
  }
`;
