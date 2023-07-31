import styled from "styled-components";

import { CloseOutline } from "../../styles/Icons";

import { Checkbox as CheckboxAnt } from "antd";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  width: 100%;
  max-height: 100%;
`;

export const CardOrder = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 12rem;
  background: var(--white);
  border: 1px solid var(--grey-70);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    height: 10.5rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 9.5rem;
  }
`;

export const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20%;
  border-bottom: 1px solid var(--grey-70);
  background: var(--white-25);
  font-size: 1rem;
  color: var(--grey-100);
  padding-left: 1rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }

  span {
    font-weight: normal;
    font-size: 0.6rem;
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  height: 80%;

  label {
    text-transform: uppercase;
    font-weight: normal;
    font-size: 0.9rem;
    color: var(--grey-100);
  }

  span {
    color: var(--green-400);
    margin-top: 1rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      label {
        font-size: 0.9rem;
      }
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    label {
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    label {
      font-size: 0.7rem;
    }
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  height: 100%;
`;

export const Checkbox = styled(CheckboxAnt)`
  .ant-checkbox-inner {
    background: var(--white);
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    border: none;
  }

  .ant-checkbox-checked {
    border: none;
    .ant-checkbox-inner {
      background: var(--orange-250);
    }
  }
`;

export const CancelIcon = styled(CloseOutline)`
  width: 70%;
  min-width: 1rem;
  height: 70%;
  color: red;
  cursor: pointer;
`;
