import React from 'react'

import { Container, Description } from './styles'

type IProps = {
  description: string
}

const RouterDescription: React.FC<IProps> = ({ description }) => {
  return (
    <Container>
      <Description>{description}</Description>
    </Container>
  )
}

export default RouterDescription
