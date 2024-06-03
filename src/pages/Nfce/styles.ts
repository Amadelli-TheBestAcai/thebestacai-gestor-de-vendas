import styled, { css } from 'styled-components';

import {
  Trash,
  AddCircle,
  InfoCircle,
  Search,
  TrashRestoreAlt,
} from '../../styles/Icons';

import MonetaryInput from '../../components/MonetaryInput';

import {
  Form as FormAnt,
  Col as ColAnt,
  Row as RowAnt,
  Input as InputAnt,
  Select as SelectAnt,
  Button as ButtonAnt,
  Tabs as TabsAnd,
  Modal,
} from 'antd';

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
    h2 {
      font-size: 1.2rem;
    }
    @media (max-height: 900px) {
      h2 {
        font-size: 1.1rem;
      }
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
  gap: 2rem;
`;

export const BalanceContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 15%;
  gap: 1rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      margin-top: 5px;
    }
  }
`;

const InputCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white-30) !important;
  border: 1px solid var(--grey-70) !important;
  border-radius: 9px;
  font-weight: 500;
  font-size: 2.2rem;

  :hover,
  :focus,
  :active {
    border: 1px solid var(--grey-70);
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 1.6rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 1.5rem;
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
    color: var(--grey-80);
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  input {
    ${InputCSS};
    height: 100%;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      span {
        font-size: 0.8rem;
      }
    }
  }
`;

export const PriceContent = styled.div`
  display: flex;
  gap: 2rem;
  height: 100%;
  width: 100%;

  span {
    color: var(--grey-80);
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  input {
    ${InputCSS};
    height: 100%;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      span {
        font-size: 0.8rem;
      }
    }
  }
`;

export const WeightContent = styled.div`
  width: 40%;
`;

export const ContainerNotSelfService = styled.div`
  height: 100%;
`;

export const InfoWeight = styled.div`
  ${InputCSS}
  height: 100%;
  width: 100%;
  color: var(--grey-80);

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    font-size: 1.7rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 1.4rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 1.2rem;
  }
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-tabs-tab {
      font-size: 0.7rem;
    }
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3.5rem;
  }
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 30px;
  }
`;

export const SearchIcon = styled(Search)`
  width: 1rem;
  height: 1rem;
  color: var(--grey-80);

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 0.8rem;
    height: 0.8em;
  }
`;

export const InputSearchProduct = styled.input`
  width: 90%;
  height: 37px;
  background: var(--white);
  border-radius: 0px 7px 7px 0px;
  padding: 5px;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 30px;
    font-size: 0.8rem;
  }
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
  background: var(--white-40);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 2.7rem;
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.5rem;
    font-size: 0.75rem;
  }
`;

export const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 57vh;
  overflow-y: scroll;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 54vh;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 54vh;
  }
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

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
    }
  }
`;

const IconCSS = css`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 1.2rem;
      width: 1.2rem;
    }
  }
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

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 2.5rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.3rem;
  }
`;

export const ProductColumn = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;

  span {
    font-size: 0.9rem;
    color: var(--black-opaco);
  }

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    font-size: 0.9rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;

      span {
        font-size: 0.8rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.75rem;

    span {
      font-size: 0.75rem;
    }
  }
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

export const QuantityInput = styled(InputAnt)`
  text-align: center;
  background: white !important;
  border: 1px solid #0000005e !important;
`;

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

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      .ant-select-selector,
      .ant-input {
        height: 3.4rem !important;
      }

      textarea.ant-input {
        height: 5rem !important;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-select-selector,
    .ant-input {
      height: 3rem !important;
      font-size: 0.8rem;
    }

    textarea.ant-input {
      height: 4.7rem !important;
      font-size: 0.8rem;
    }

    .ant-form-item-label > label {
      font-size: 0.75rem;
    }

    .ant-select-selection-item {
      font-size: 0.8rem;
    }
  }
`;

export const Row = styled(RowAnt)`
  margin-top: 0.5rem;
`;

export const Col = styled(ColAnt)``;

export const FormItem = styled(FormAnt.Item)`
  margin: 5px;
`;

export const TotalValue = styled(InputAnt)`
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.3rem;
    font-size: 0.8rem;
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 55%;
    font-size: 0.8rem;
  }
`;

export const DeleteButton = styled.button`
  padding: 5%;
`;

export const DeleteIcon = styled(TrashRestoreAlt)`
  width: 1.2rem;
  height: 1.2rem;
  color: var(--red-600);
`;

export const ModalNFCe = styled(Modal)`
  color: var(--grey-90);

  span {
    color: var(--orange-250);
  }

  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
  }
`;

const ButtonModal = css`
  border-radius: 5px;
  border: 1px solid var(--grey-90);
  color: var(--grey-90);
  padding: 1% 3%;
  margin-left: 1rem;

  :hover {
    border-color: var(--orange-250);
    color: var(--orange-250);
  }
`;
export const NFCeButton = styled.button`
  ${ButtonModal}
`;
