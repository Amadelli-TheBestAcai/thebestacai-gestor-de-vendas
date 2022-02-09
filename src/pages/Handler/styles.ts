import styled, { css } from "styled-components";

import { Col as ColAnt } from "antd";

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
  width: 10%;
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
