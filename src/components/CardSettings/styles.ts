import styled from "styled-components";

import { Settings } from "../../styles/Icons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 15%;
  margin-top: 1rem;
  box-shadow: 0px 4px 6px rgba(163, 163, 163, 0.28);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 20%;
    }
  }
`;

export const HeaderCard = styled.div`
  display: flex;
  align-items: center;
  color: white;
  width: 100%;
  height: 30%;
  background: var(--black-opaco);
  padding: 1rem;
  font-size: 1rem;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.9rem;
  }
`;

export const SettingsIcon = styled(Settings)`
  color: white;
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 1rem;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

export const ContentCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70%;
  background: var(--white);
  border-radius: 0px;

  .ant-select-selector,
  .ant-input {
    height: 3.7rem !important;
    align-items: center;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-select-selector {
      height: 3.2rem !important;
      font-size: 0.8rem;
    }
  }
`;
