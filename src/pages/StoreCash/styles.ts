import styled from 'styled-components'

import MonetaryInput from '../../components/MonetaryInput'

import {
  Button as ButtonAnt,
  Input as InputAnt,
  Col as ColAnt,
  Row as RowAnt,
} from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
`

export const PrimaryContent = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`

export const Header = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
`

export const CashesContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  justify-content: center;
`

export const SecondaryContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const AmountContainer = styled.div`
  width: 50%;
`

export const AmountResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 10%;
`

export const Result = styled.label`
  font-weight: bold;
  font-size: 38px;
`

export const Title = styled.label`
  font-weight: bold;
  font-size: 22px;
  margin: 20px 0;
`

export const AmountAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 20%;
  margin: 10px 0;
`

export const FinishButton = styled(ButtonAnt)`
  margin: 0 15px;
  background: black;
  border: 1px solid black;
  color: white;
  font-weight: 700;
  border-radius: 8px;
  width: 15vw;
  height: 5vh;

  :hover {
    color: var(--hover-bottomLogin);
    background: var(--primary-orange);
    transition: 0.5s;
    border: 1px solid var(--primary-orange);
  }
`

export const BackButton = styled(ButtonAnt)`
  margin: 0 15px;
  background: #ffffff;
  border: 1px solid var(--primary-orange);
  color: var(--primary-orange);
  font-weight: 700;
  border-radius: 8px;
  width: 15vw;
  height: 5vh;

  :hover {
    background: var(--hover-bottomLogin);
    color: var(--primary-orange);
    transition: 0.5s;
    border: 1px solid var(--hover-bottomLogin);
  }
`

export const AmountRow = styled(RowAnt)`
  margin: 10px 0;
`

export const Column = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 5px;
`

export const AmountLabel = styled.label`
  margin-right: 10px;
  color: #7e7e7e;
  font-weight: bold;
`

export const AmountInput = styled(InputAnt)`
  max-width: 60%;
  border-radius: 10px;
  text-align: center;
`

export const FullAmountColumn = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 5px;
  input {
    border-radius: 10px;
    text-align: center;
    width: 47%;
  }
`

export const InputPrice = styled(MonetaryInput)``
