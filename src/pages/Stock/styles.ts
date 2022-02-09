import styled from "styled-components";

import { Input as InputAnt } from "antd";
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
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 5%;
`;

export const Input = styled(InputAnt)`
  height: 3.7rem;
  width: 15%;
`;

export const Content = styled.section`
  display: flex;
  width: 100%;
  height: 90%;
  margin-top: 1rem;
`;

export const SearchIcon = styled(Search)`
  height: 0.9rem;
  width: 0.9rem;
  color: var(--grey-60);
`;
