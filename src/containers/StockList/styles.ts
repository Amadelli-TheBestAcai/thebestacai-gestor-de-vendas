import styled, { css } from 'styled-components'

import {
  Row as RowAnt,
  Col as ColAnt,
  Button as ButtonAnt,
  Input as InputAnt,
} from 'antd'
import { History, RemoveCircleOutline } from '../../styles/Icons'

export const Container = styled.div`
  height: 100%;
  width: 100%;
`

export const Tupla = styled(RowAnt)`
  width: 100%;
  min-height: 6.8vh;
  border-bottom: 1px solid #f2b74945;
  :hover {
    border-left: 5px solid var(--primary);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: var(--secondary);
  }
`
export const Col = styled(ColAnt)``

export const LabelName = styled.label`
  text-transform: capitalize;
  font-weight: bold;
  @media only screen and (max-width: 578px) {
    margin-left: 5px;
  }
`

interface IStatus {
  quantity?: number
}

export const Status = styled.label<IStatus>`
  text-transform: uppercase;
  color: white;
  padding: 3px;
  border-radius: 4px;

  ${({ quantity }) => {
    if (quantity <= 0 || !quantity) {
      return css`
        background: #f22738;
      `
    }
    if (quantity <= 3) {
      return css`
        background: #f2a516;
      `
    }
  }}
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Button = styled(ButtonAnt)`
  margin: 0 5px;
  @media only screen and (max-width: 578px) {
    min-width: 24px;
    width: 24px;
    height: 24px;
    padding: 0px 0;
    font-size: 14px;
  }
`

const iconCSS = css`
  width: 23px;
  height: 23px;
  fill: #9e9a9a;

  :hover {
    fill: #262626;
  }
  @media only screen and (max-width: 578px) {
    width: 18px;
    height: 18px;
  }
`

export const EditIcon = styled(RemoveCircleOutline)`
  ${iconCSS}
  fill: red;
`
export const HistoryIcon = styled(History)`
  ${iconCSS}
`

export const UpdateContainer = styled.div`
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 578px) {
    flex-direction: column;
  }
`

export const QtdCurrent = styled.div``

export const QtdChange = styled.div`
  @media only screen and (max-width: 578px) {
    margin-top: 10px;
  }
`

export const EditInfo = styled.label`
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
  text-transform: uppercase;
`

export const InputChange = styled(InputAnt)`
  width: 40%;
  border-radius: 8px;
  text-align: center;
  @media only screen and (max-width: 578px) {
    margin-left: 9%;
  }
`
export const Input = styled(InputAnt)`
  width: 40%;
  border-radius: 8px;
  text-align: center;
`
