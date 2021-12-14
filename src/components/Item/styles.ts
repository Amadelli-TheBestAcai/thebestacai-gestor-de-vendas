import styled from 'styled-components'

import { Row, Col } from 'antd'
import { RemoveCircle } from '../../styles/Icons'

export const Container = styled(Row)`
  display: flex;
  width: 100%;
  background: white;
  border-bottom: 1px solid black;
  padding: 3px;

  :hover {
    transition: 0.5s;
  }
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Description = styled.label`
  font-weight: bold;
  font-size: 18px;
`

export const RemoveIcon = styled(RemoveCircle)`
  width: 24px;
  height: 24px;
  color: var(--button-remove);
  cursor: pointer;

  :hover {
    color: #ea1d2c;
    transition: 0.5s;
  }
`
export const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
