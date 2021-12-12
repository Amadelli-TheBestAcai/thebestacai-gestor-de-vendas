import styled, { css } from 'styled-components'
import {
  PointOfSale,
  ListOl,
  Motorcycle,
  ArrowLeftRight,
  BarChart,
  Cashapp,
  HomeAlt,
  BoxOpen,
  FileInvoice,
} from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background: black;
`

export const IconContainer = styled.div`
  background: black;
  width: 5vw;
  height: 40px;
  cursor: pointer;
  margin: 12px 0 12px 0;
  display: flex;
  align-items: center;

  :hover {
    background: var(--primary-orange);
    color: black;
    transition: 0.5s;
    svg {
      color: black;
    }
  }
`

const IconCSS = css`
  color: var(--primary-orange);
  width: 5vw;
  height: 25px;
`
export const Command = styled(ListOl)`
  ${IconCSS}
`
export const Cash = styled(PointOfSale)`
  ${IconCSS}
`
export const Delivery = styled(Motorcycle)`
  ${IconCSS}
`
export const ArrowIcon = styled(ArrowLeftRight)`
  ${IconCSS}
`
export const Graph = styled(BarChart)`
  ${IconCSS}
`
export const Money = styled(Cashapp)`
  ${IconCSS}
`

export const Home = styled(HomeAlt)`
  ${IconCSS}
`

export const BoxIcon = styled(BoxOpen)`
  ${IconCSS}
`

export const NfceIcon = styled(FileInvoice)`
  ${IconCSS}
`
