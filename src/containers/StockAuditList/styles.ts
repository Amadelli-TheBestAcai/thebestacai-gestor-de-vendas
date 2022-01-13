import styled from 'styled-components'
import { Modal as ModalAnt } from 'antd'

export const Container = styled.div`
  height: 100%;
`

export const Modal = styled(ModalAnt)`
  .ant-btn-primary {
    background: #262626;
    border-color: #262626;
    width: 60px;
  }

  .ant-modal-body {
    max-height: 300px;
    overflow-y: scroll;
    @media only screen and (max-width: 578px) {
      height: 350px;
    }
  }
`
