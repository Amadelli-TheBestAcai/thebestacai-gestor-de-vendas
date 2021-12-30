import styled from 'styled-components'

import { CashRegister } from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`

export const Description = styled.label`
  font-size: 22px;
  margin-top: 10px;
`

export const Icon = styled(CashRegister)`
  width: 45px;
  height: 45px;
`
