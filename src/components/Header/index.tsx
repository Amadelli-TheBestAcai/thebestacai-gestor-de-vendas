import React from 'react'
import UserInfo from '../UserInfo'
import { LogosConatiner, Logo1, Logo2, MenuContainer } from './styles'
import LogoName from '../../assets/img/logo_name.png'
import Logo from '../../assets/img/logo_amadelli.png'
const Header: React.FC = () => {
  return (
    <>
      <LogosConatiner>
        <Logo1 src={LogoName} />
        <Logo2 src={Logo} />
      </LogosConatiner>
      <MenuContainer>
        <UserInfo />
      </MenuContainer>
    </>
  )
}

export default Header
