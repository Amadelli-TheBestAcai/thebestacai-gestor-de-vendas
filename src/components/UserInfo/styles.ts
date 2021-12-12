import styled from 'styled-components'

import { User } from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  margin: 0 1%;
`

export const UserContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 70%;
  color: white;
`

export const AvatarContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 30%;
  cursor: pointer;
`

export const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-orange);
`

export const Store = styled.label`
  font-size: 12px;
  margin-bottom: 4px;
`

export const UserIcon = styled(User)`
  width: 30px;
  height: 30px;
  color: var(--headerBackground);
  @media only screen and (max-width: 500px) {
    width: 22px;
    height: 22px;
  }
`

export const Description = styled.label`
  font-size: 12px;
  color: white;
`
