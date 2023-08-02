import styled from "styled-components";

import { Search } from "../../styles/Icons";

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
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
  }
`;

export const SearchIcon = styled(Search)`
  height: 0.9rem;
  width: 0.9rem;
  color: var(--grey-60);

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    height: 0.8rem;
    width: 0.8rem;
  }
`;

export const Content = styled.section`
  display: flex;
  width: 100%;
  height: 90%;
  margin-top: 1rem;
`;
