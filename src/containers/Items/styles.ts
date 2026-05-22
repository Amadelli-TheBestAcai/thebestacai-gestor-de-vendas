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

export const CouponRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.6rem 1rem;
  margin-top: 8px;
  background: var(--soft-orange);
  border-left: 3px solid var(--color-theme);
  border-radius: 3px;
  font-size: 1rem;

  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }

  @media (max-width: 1440px) {
    font-size: 0.85rem;
  }
`;

export const CouponLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
`;

export const CouponTag = styled.span`
  display: inline-flex;
  align-items: center;
  background: var(--color-theme);
  color: var(--white);
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  flex-shrink: 0;
`;

export const CouponName = styled.span`
  color: var(--gray-300);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CouponValue = styled.span`
  color: var(--color-theme);
  font-weight: bold;
  flex-shrink: 0;
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
