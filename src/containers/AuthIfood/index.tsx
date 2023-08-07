import React from 'react'
import ImageCode from '../../assets/svg/codeCopy.svg'
import Code from '../../assets/svg/code.svg'
import { Container, InfoContent, Title, ButtonLink, ContentButtons, Input, Image, Instruction, ImageSize, SubtitleAuth } from './styles'

const AuthIfood = () => {
  return (
    <Container>
      <Title>Autorize o iFood no gestor</Title>

      <InfoContent>
        <ContentButtons>
          <Instruction>
            <span>1</span>Copie o código de autorização disponibilizado no site do Ifood.
            <SubtitleAuth>
              Ao clicar no botão. você será redirecionado para o site do Ifood.
              Copie o código de autorização e cole no passo 2. Faça o login, se necessário.
            </SubtitleAuth>
          </Instruction>
          <ButtonLink>Ver código no site</ButtonLink>
          <Image src={ImageCode} />
        </ContentButtons>
        <ContentButtons>
          <Instruction>
            <span>2</span>Cole o código da autorização
          </Instruction>
          <Input placeholder='Cole o código de autorização' />
          <ButtonLink>Enviar</ButtonLink>
          <ImageSize src={Code} />
        </ContentButtons>
      </InfoContent>
    </Container>
  )
}

export default AuthIfood