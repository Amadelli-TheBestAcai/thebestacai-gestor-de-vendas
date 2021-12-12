import styled, { css } from 'styled-components'

import { LogOutCircle, SettingsOutline } from '../../styles/Icons'

export const Actions = styled.label`
  font-size: 14px;
  cursor: pointer;
`
export const ActionsContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  :hover {
    color: var(--primary);
  }
`
const iconCss = css`
  width: 35px;
  height: 35px;
  padding-right: 7px;
  @media only screen and (max-width: 578px) {
    width: 30px;
    height: 30px;
  }
`
export const LogOutCircleIcon = styled(LogOutCircle)`
  ${iconCss}
`

export const SettingsIcon = styled(SettingsOutline)`
  ${iconCss}
`
