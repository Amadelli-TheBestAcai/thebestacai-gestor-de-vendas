import styled, { css } from "styled-components";

import { Col as ColAnt, Row as RowAnt, Modal } from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;
export const ContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 21%;
  height: 100%;
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
  justify-content: space-between;
  width: 100%;
  height: 5%;

  h2 {
    margin-bottom: 0px;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    h2 {
      font-size: 1.1rem;
    }
  }
`;

export const ButtonDownloader = styled.button`
  width: 49.5%;
  height: 85%;
  background: var(--orange-250);
  border-radius: 5px;
  font-size: 0.9rem;
  color: var(--brown-500);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    font-size: 0.8rem;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    height: 80%;
    font-size: 0.7rem;
  }
`;
export const ButtonMoreInfo = styled.button`
  width: 49.5%;
  height: 85%;
  background: var(--orange-250);
  border-radius: 5px;
  font-size: 0.9rem;
  color: var(--brown-500);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    font-size: 0.8rem;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    height: 80%;
    font-size: 0.7rem;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
  margin-top: 1rem;
`;

export const HeaderList = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
  background: var(--black-opaco);
  border-radius: 3px;
  color: white;
  text-transform: uppercase;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HandlerContentList = styled.div`
  width: 100%;
  height: 95%;
`;

export const ModalMoreInfo = styled(Modal)`
  .saida {
    font-size: 1.5rem;
    color: var(--red-600);
  }
  .entrada {
    font-size: 1.5rem;
    color: var(--green-400);
  }
  .ant-modal-title {
    font-size: 1.5rem;
  }
  .ant-modal-header {
    padding-bottom: 0;
    border: none;
  }
  .ant-modal-body {
    padding-top: 0;
  }
  .ant-modal-footer {
    border-top: none;
  }
`;
export const RowModal = styled(RowAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--gray-25);
`;

export const ColModal = styled(ColAnt)`
  display: flex;
  justify-content: center;
  border: 1px solid var(--white-30);
`;
