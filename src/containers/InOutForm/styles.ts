import styled from 'styled-components'

import MonetaryInput from '../../components/MonetaryInput'

import { Modal as ModalAnt, Input as InputAnt, Select as SelectAnt, Row as RowAnt } from 'antd'

export const Container = styled(ModalAnt)`
  .ant-modal-header,
  .ant-modal-footer {
    padding: 0px;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Title = styled.label`
  font-weight: bold;
  color: white;
`

export const Input = styled(MonetaryInput)``

export const InputArea = styled(InputAnt.TextArea)``

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  margin-top: 10px;
`

export const Description = styled.label``

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 15vh;
`

export const Register = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
  background: black;
  font-size: 18px;
  color: white;
  cursor: pointer;
`

export const Leave = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
  background: #b1b1b1;
  color: white;
  cursor: pointer;
`

export const Select = styled(SelectAnt)`
  width: 100%;
  margin-bottom: 10px;
`

export const Row = styled(RowAnt)`
  width: 100%;
`

export const Option = styled(SelectAnt.Option)``
