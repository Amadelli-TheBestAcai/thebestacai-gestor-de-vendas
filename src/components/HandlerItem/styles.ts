import styled from 'styled-components'

import { Trash, Printer } from '../../styles/Icons'

import { Row, Col } from 'antd'

export const Container = styled(Row)`
  background: white;
  margin: 1px;
  min-height: 48px;
  border-bottom: 1px solid #00000021;
  border-right: 1px solid #00000021;
  border-left: 1px solid #00000021;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const RemoveIcon = styled(Trash)`
  width: 25px;
  height: 25px;
  color: red;
  padding: 1% 0;
  cursor: pointer;
`

export const PrinterIcon = styled(Printer)`
  width: 25px;
  height: 25px;
  color: black;
  padding: 1% 0;
  cursor: pointer;
`

export const Description = styled.label`
  font-size: 12px;
  font-weight: bold;
`
