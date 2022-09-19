import styled, { css } from "styled-components";

import { Row, Col as ColAnt } from "antd";

import { ViewList, Grid3x2GapFill } from "../../styles/Icons";

interface IListContainer {
  listView: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  header {
    display: flex;
    width: 100%;
    height: 5%;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin-bottom: 0;
      font-size: 1rem;
      color: var(--grey-200);

      /*Responsive 1366px*/
      @media (max-width: 1366px) {
        font-size: 0.9rem;
      }
    }
  }
`;

export const ActionTypeList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 4%;
  height: 100%;
`;

const IconCSS = css`
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition: 0.4s;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 1rem;
    height: 1rem;
  }
`;

export const GridIcon = styled(Grid3x2GapFill) <IListContainer>`
  ${IconCSS}

  ${({ listView }) => {
    if (!listView) {
      return css`
        color: var(--black-opaco);
      `;
    }
    return css`
      color: #bfbfbf;
    `;
  }}
`;

export const ListIcon = styled(ViewList) <IListContainer>`
  ${IconCSS}

  ${({ listView }) => {
    if (listView) {
      return css`
        color: var(--black-opaco);
      `;
    }
    return css`
      color: #bfbfbf;
    `;
  }}
`;

export const ListContainer = styled.div<IListContainer>`
  display: grid;
  grid-gap: 10px;
  width: 100%;
  margin-top: 0.5rem;
  overflow-y: scroll;

  ${({ listView }) => {
    if (listView) {
      return css`
        grid-template-columns: repeat(1, 1fr);
      `;
    }
    return css`
      grid-template-columns: repeat(5, 1fr);
    `;
  }}
`;

interface ICardSale {
  isSelected: boolean;
  isAbstract: boolean;
}
export const CardSale = styled(Row) <ICardSale>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  background: var(--white);
  border: 1px solid var(--grey-70);
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--grey-200);

  span {
    margin-left: 4px;
    color: var(--green-600);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 60px;
    font-size: 0.9rem;
  }
  :hover {
    border: 1px var(--orange-450) solid;
  }

  ${({ isAbstract }) => {
    if (isAbstract) {
      return css`
        border: 1px #0000ff54 solid;
      `;
    }
  }}

  ${({ isSelected }) => {
    if (isSelected) {
      return css`
        border: 1px var(--orange-200) solid;
      `;
    }
  }}
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
