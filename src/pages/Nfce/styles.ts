import styled, { css } from 'styled-components'

import MaskInput from 'react-input-mask'

import { Trash, AddCircle, InfoCircle } from '../../styles/Icons'

import MonetaryInput from '../../components/MonetaryInput'

import {
  Form as FormAnt,
  Col as ColAnt,
  Row as RowAnt,
  Input as InputAnt,
  Select as SelectAnt,
  Button as ButtonAnt,
  Tabs as TabsAnd,
} from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
`
export const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: 95%;
`
export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
`

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 25%;
  padding: 0 5px;
`

export const BalanceContent = styled.div`
  width: 100%;
  height: 100%;
`
export const TopContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  background: white;
  height: 50%;
  font-size: 20px;
  color: black;
  justify-content: center;

  input {
    background: white;
    height: 10vh;
    padding-right: 10px;
    border-radius: 2px;
    font-size: 32px;
    text-align: end;
    border: 1px solid #b0afae;
  }
`

export const Text = styled.label`
  font-size: 14px;

  text-align: end;
`

export const DisabledInput = styled.input`
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 1;
  caret-color: transparent;
`

export const ProductsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 75%;
  width: 100%;
  background: var(--mainBackground);
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const ProductContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid;
  width: 100%;
  height: 8%;
  background: white;
  font-weight: bold;
`

export const InputMonetary = styled(MonetaryInput)``

export const BottomContainer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PriceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 100%;
  height: 80%;
  margin: 5px 0px;
  color: #9a9a9a;
`

export const WeightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 50%;
  height: 80%;
  margin: 5px 10px 5px 10px;
  color: #9a9a9a;
`

const BottomContainerCSS = css`
  height: 100%;
  color: #b0afae;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24px;
  background: #eae8e8;
`

export const Price = styled.div`
  ${BottomContainerCSS};
`

export const Weight = styled.div`
  ${BottomContainerCSS};
`

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 70%;
  margin-left: 10px;
`

export const ProductListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30%;
  width: 100%;
  background: yellow;
`

export const ProductListHeader = styled.div`
  height: 15%;
  width: 100%;
`

export const ProductListRow = styled(RowAnt)`
  display: flex;
  justify-content: space-evenly;
  background: black;
  width: 100%;
  height: 100%;
`

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  height: 85%;
  width: 100%;
  overflow-y: scroll;
  background: var(--mainBackground);
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const SpinContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

export const ProductsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15%;
  width: 100%;
  font-size: 22px;
  font-weight: bold;
`

export const Product = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
  border-bottom: 1px solid black;
  background: white;
  padding: 2% 0;
`

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 70%;
  width: 100%;
  margin-top: 10px;
  overflow-y: scroll;
  background: var(--mainBackground);
`

export const Form = styled(FormAnt)`
  width: 100%;
  height: 100%;
`

export const FormItem = styled(FormAnt.Item)`
  margin: 5px;
`

export const Col = styled(ColAnt)``

export const Row = styled(RowAnt)``

export const Input = styled(InputAnt)``

export const InputMask = styled(MaskInput)``

export const Select = styled(SelectAnt)`
  width: 100%;
`

export const Option = styled(SelectAnt.Option)``

const iconCSS = css`
  width: 20px;
  height: 20px;
  margin: 0px 5px;
  cursor: pointer;
`

export const RemoveIcon = styled(Trash)`
  color: red;
  ${iconCSS}
`

export const AddIcon = styled(AddCircle)`
  color: green;
  ${iconCSS}
`

export const InfoIcon = styled(InfoCircle)`
  color: red;
  ${iconCSS}
`

export const TabContainer = styled(TabsAnd)`
  width: 100%;
  height: 100%;
  line-height: 0.2;
  .ant-tabs-content {
    height: 100%;
  }
  div.ant-tabs-nav {
    background: var(--primary-orange);
    margin-bottom: 0px;
  }
  div.ant-tabs-nav-wrap {
    display: flex;
    justify-content: center;
  }
  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      font-weight: bold !important;
      color: black !important;
    }
  }
  .ant-tabs-ink-bar {
    position: absolute;
    background: black;
    pointer-events: none;
  }
`

export const TabItem = styled(TabsAnd.TabPane)``

export const ProductHeader = styled(RowAnt)`
  display: flex;
  justify-content: space-evenly;
  background: black;
  padding: 2% 0;
  width: 100%;
`

export const ProductHeaderCol = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ProductHeaderDescription = styled.label`
  color: white;
  font-weight: bold;
  font-size: 18px;
`

export const ProductList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 20%;
  width: 100%;
  padding: 1%;
`

export const PriceTotalNfce = styled.div`
  display: flex;
  width: 100%;
  background: var(--primary-orange);
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: bold;
  font-size: 15px;
`

export const Button = styled(ButtonAnt)`
  background: black;
  width: 75%;
  border: none;
  text-transform: uppercase;

  :hover {
    background: black;
  }
`
