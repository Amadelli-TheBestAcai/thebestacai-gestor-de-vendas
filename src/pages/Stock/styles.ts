import styled, { css } from "styled-components";

import { Col as ColAnt, Row as RowAnt, Input } from "antd";
import { Search } from "../../styles/Icons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0.8rem;
`;

const ContentCSS = css`
  background: var(--white);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  padding: 1rem;
`;

export const Content = styled.div`
  ${ContentCSS}
  height: 100%;
  width: 100%;
  margin-bottom: 5px;
  overflow: hidden;
  text-align: center;
`;

export const Name = styled.h1`
  position: absolute;

  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 42px;

  color: #000000;
`;

export const SearchBar = styled(Input)`
  width: 294px;
  height: 42px;
  margin-left: 78%;

  background: #f7f7f7;
  border: 1px solid #bebebe;
  box-sizing: border-box;
  border-radius: 5px;
`;

export const Row = styled(RowAnt)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Col = styled(ColAnt)`
  margin: 0 10px;
  @media only screen and (max-width: 578px) {
    margin: 5px 0;
  }
`;
