import styled from 'styled-components'

import { Row, Col } from 'antd'

export const Container = styled(Row)`
  display: flex;
  background: white;
  margin: 1px;
  height: 48px;
  min-height: 48px;
  border-bottom: 1px solid #00000021;
  border-right: 1px solid #00000021;
  border-left: 1px solid #00000021;
  width: 100%;
`

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Description = styled.label`
  font-size: 12px;
  font-weight: bold;
`
