import styled from 'styled-components'

import { SelectArrows } from '../../styles/Icons'

import { Row as RowAnt, Col as ColAnt, Spin as SpinAnt } from 'antd'
export const Container = styled.div`
  height: 100%;
  width: 100%;
`

export const THeaderContainer = styled.div`
  width: 100%;
  background: var(--primary);
  border-radius: 15px 15px 0 0;

  @media only screen and (max-width: 578px) {
    height: 28px;
    border-radius: 0;
  }
`

export const THead = styled(RowAnt)`
  background: rgb(73, 73, 73);
  width: 100%;
  height: 4vh;
`

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 578px) {
    display: ${({ xs }) => xs === 0 && 'none'};
  }
`

export const HeaderInfo = styled.label`
  font-size: 16px;
  color: white;
  text-transform: uppercase;
  @media only screen and (max-width: 578px) {
    font-size: 14px;
  }
`

export const TBody = styled.div`
  height: 85%;
  width: 100%;
  margin-bottom: 5px;
  overflow-y: scroll;
  background: #dad5d55e;
  @media only screen and (max-width: 578px) {
    text-align: left;
  }
  label {
    font-size: 16px;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const Spin = styled(SpinAnt)``

export const SearchIcon = styled(SelectArrows)`
  width: 21px;
  height: 21px;

  cursor: pointer;

  fill: var(--primary);
`
