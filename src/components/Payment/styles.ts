import styled from 'styled-components'

import { Row, Col } from 'antd'

import { RemoveCircle } from '../../styles/Icons'

export const Container = styled(Row)`
  width: 100%;
  height: 100%;
  border: 2px solid #f4f4f4;
  background: #ffc165;
`

export const Column = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Description = styled.label``

export const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
