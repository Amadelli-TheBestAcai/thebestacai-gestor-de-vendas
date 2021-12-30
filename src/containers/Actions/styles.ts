import styled, { css } from 'styled-components'
import {
  Offer,
  ArrowFromLeft,
  ArrowFromRight,
  AddToQueue,
  Chat,
} from '../../styles/Icons'

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: center;
`

const ButtonCSS = css`
  width: 10vw;
  height: 6vh;
  border: none;
  margin: 0 18px 0 0;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 700;

  @media only screen and (max-width: 1300px) {
    font-size: 12px;
  }
`

export const DiscountButton = styled.button`
  background: #000;
  ${ButtonCSS};

  :hover {
    background: var(--primary-orange);
    color: black;
  }
`

export const EntryButton = styled.button`
  ${ButtonCSS};
  background: #2d3ed8;

  :hover {
    background: #2033e5;
    transition: 0.5s;
  }
`

export const OutButton = styled.button`
  ${ButtonCSS};
  background: #e14a4a;

  :hover {
    background: #ea1d2c;
    transition: 0.5s;
  }
`

export const CommandButton = styled.button`
  ${ButtonCSS};
  background: #29de60;

  :hover {
    background: #03e247;
    transition: 0.5s;
  }
`

const IconCSS = css`
  width: 26px;
  height: 26px;
  margin-left: 10px;

  @media only screen and (max-width: 1300px) {
    width: 20px;
    height: 20px;
  }
`
export const OfferIcon = styled(Offer)`
  ${IconCSS};
`
export const EntryIcon = styled(ArrowFromLeft)`
  ${IconCSS};
`
export const OutIcon = styled(ArrowFromRight)`
  ${IconCSS};
`

export const CommandIcon = styled(AddToQueue)`
  ${IconCSS};
`

export const ChatIcon = styled(Chat)`
  ${IconCSS};
`
