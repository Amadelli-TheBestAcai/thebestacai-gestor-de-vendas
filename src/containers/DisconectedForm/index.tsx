import React from 'react'

import Centralizer from '../Centralizer'

import { OfflineIcon, Description } from './styles'

const DisconectedForm: React.FC = () => {
  return (
    <Centralizer>
      <OfflineIcon />
      <Description>Sem conexão</Description>
    </Centralizer>
  )
}

export default DisconectedForm
