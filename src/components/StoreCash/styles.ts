import styled from 'styled-components'
import { CashRegister } from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 20vw;
  height: 25vh;

  margin: 0 15px;
`
export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  width: 60%;
  height: 100%;

  cursor: pointer;
`

export const Description = styled.label`
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 700;
`

export const Status = styled.label`
  margin-top: 5px;
  font-weight: 700;
`

export const CashIcon = styled(CashRegister)`
  fill: black;
  width: 60px;
  height: 60px;
`
