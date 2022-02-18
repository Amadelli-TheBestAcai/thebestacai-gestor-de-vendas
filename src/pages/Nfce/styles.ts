import styled, { css } from "styled-components";

import MaskInput from "react-input-mask";

import {
  Trash,
  AddCircle,
  InfoCircle,
  Search,
  TrashRestoreAlt,
} from "../../styles/Icons";

import MonetaryInput from "../../components/MonetaryInput";

import {
  Form as FormAnt,
  Col as ColAnt,
  Row as RowAnt,
  Input as InputAnt,
  Select as SelectAnt,
  Button as ButtonAnt,
  Tabs as TabsAnd,
} from "antd";

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
        font-size: 1.3rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 1.1rem;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
  margin-right: 1rem;
`;

export const BalanceContainer = styled.div`
  display: flex;
  width: 100%;
  height: 15%;
  margin-bottom: 1rem;
`;

const InputCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white-30) !important;
  border: 1px solid var(--grey-70) !important;
  box-sizing: border-box;
  border-radius: 9px;

  font-size: 2.2rem;

  :hover,
  :focus,
  :active {
    border: 1px solid var(--grey-70);
  }
`;

export const InputMonetary = styled(MonetaryInput)`
  height: 100%;
`;

const BalanceCSS = css`
  display: flex;
  flex-direction: column;
  height: 100%;

  span {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  input {
    ${InputCSS};
    height: 100%;
  }
`;

export const PriceContent = styled.div`
  ${BalanceCSS}
  width: 60%;
  margin-right: 1rem;
`;

export const WeightContent = styled.div`
  ${BalanceCSS}
  width: 40%;
`;

export const InfoWeight = styled.div`
  ${InputCSS}
  height: 80%;
  width: 100%;
  font-size: 2rem;

  color: var(--grey-80);
`;

export const ItemsContainer = styled.div`
  width: 100%;
  height: 85%;
`;

export const TabContainer = styled(TabsAnd)`
  width: 100%;

  .ant-tabs-nav {
    background: var(--black-opaco);
    color: white;
    border-radius: 6px 6px 0px 0px;
    padding: 1%;
    margin: 0px;
  }

  .ant-tabs-ink-bar {
    position: absolute;
    background: white;
  }
`;

export const TabItem = styled(TabsAnd.TabPane)``;

export const ProductSearch = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 3.8rem;
  background: var(--white-80);
  padding: 2%;
  margin-bottom: 8px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  height: 37px;
  background: var(--white);
  border-radius: 7px 0px 0px 7px;
  padding: 5px;
`;

export const SearchIcon = styled(Search)`
  width: 1rem;
  height: 1rem;
  color: var(--grey-80);
`;

export const InputSearchProduct = styled.input`
  width: 90%;
  height: 37px;
  background: var(--white);
  border-radius: 0px 7px 7px 0px;
  padding: 5px;
`;

export const Column = styled(ColAnt)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;

export const HeaderItem = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.9rem;
  background: #f9f9f9;
`;

export const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 58vh;
  overflow-y: scroll;
`;

export const ProductContent = styled(RowAnt)`
  width: 100%;
  background: var(--white-40);
  margin-top: 9px;
`;

export const ColumnProduct = styled(ColAnt)`
  display: flex;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
`;

const IconCSS = css`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
`;

export const InfoIcon = styled(InfoCircle)`
  ${IconCSS}

  fill: var(--red-600);
`;

export const AddIcon = styled(AddCircle)`
  ${IconCSS}
  fill: var(--green-600);
`;

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 70%;
`;

export const ProductListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
`;

export const ProductListHeader = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
  background: var(--black-opaco);
  border-radius: 3px;
`;

export const ProductColumn = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
`;

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  align-items: flex-start;
  overflow-y: scroll;
`;

export const ProductsContent = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 8px;
`;

export const Product = styled.div`
  display: flex;
  height: 15%;
  width: 100%;
  background: var(--white-40);
  margin-bottom: 8px;
`;

export const Input = styled(InputAnt)``;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  width: 100%;
`;
export const Form = styled(FormAnt)`
  .ant-select-selector,
  .ant-input {
    height: 3.7rem !important;
    align-items: center;
  }

  textarea.ant-input {
    height: 8rem !important;
  }
`;

export const Row = styled(RowAnt)`
  margin-top: 0.5rem;
`;

export const Col = styled(ColAnt)``;

export const FormItem = styled(FormAnt.Item)`
  margin: 5px;
`;

export const TotalValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 2.5rem;
  background: var(--white-40);
  border: 1px solid var(--grey-70);
  padding: 1rem;

  strong {
    margin-left: 3px;
  }
`;

export const Select = styled(SelectAnt)``;

export const Option = styled(SelectAnt.Option)``;

export const ButtonFinishContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 25%;
  width: 100%;
`;

export const Button = styled(ButtonAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 60%;
  border-radius: 5px;
  background: var(--orange-450);
  color: var(--brown-500);
  border: none;
  font-weight: 500;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  :hover,
  :active,
  :focus {
    background: var(--orange-450);
    border: none;
    color: var(--brown-500);
  }
`;

// export const DeleteButton = styled.button`
//   padding: 5%;
// `;

// export const DeleteIcon = styled(TrashRestoreAlt)`
//   width: 1.2rem;
//   height: 1.2rem;
//   color: var(--red-600);
// `;

// export const InputMask = styled(MaskInput)``;

// export const SpinContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-grow: 1;
// `;

// export const ActionContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   height: 20%;
//   width: 100%;
//   padding: 1%;
// `;

// export const PriceTotalNfce = styled.div`
//   display: flex;
//   width: 100%;
//   align-items: center;
//   justify-content: center;
//   color: black;
//   font-weight: bold;
//   font-size: 15px;
// `;
