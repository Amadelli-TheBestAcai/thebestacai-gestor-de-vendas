import styled, { css } from 'styled-components';
import { Clock, DeliveryDining, Sparkles, Check2Circle, PinMap, CheckCircleFill, Money } from '../../styles/Icons'

const OrderBoxMixin = css`
  display: flex;
  padding: 0.5rem 1.5rem;
  background-color: var(--white);
  border: 1px solid var(--grey-60);
  color: var(--grey-60);
  border-radius: .4rem;
  background-color: var(--white-30);
  margin-bottom: 1rem;
`;

const Font = css`
    font-size: 1.3rem;
    color: var(--gray-100);
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: .5rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1rem;
`;

export const ContainerTypeOfPayment = styled.div`
  ${OrderBoxMixin}
  ${Font}
  display: flex;
  flex-direction: column;
`;

export const ContainerGeneral = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: 70vh;
  
  &::-webkit-scrollbar {
    width: 0; 
    display: none; 
  }
`;


export const ContentOrderHeader = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Title = styled.h1`
    ${Font}
`;

export const SubTitle = styled.div`
    ${Font}
    font-size: 1rem;
`;

export const OrderBoxInfo = styled.div`
  ${OrderBoxMixin}
  align-items: center;
  width: 100%;
`;

export const OrderBoxItems = styled.div`
  ${OrderBoxMixin}
  flex-direction: column;

  span {
    font-size: 0.7rem;
  }
`;

export const ContentGoBack = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: .5rem;
`;

export const OrderDetailsBox = styled.div`
    ${OrderBoxMixin}
    ${Font}
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 1rem;
    font-size: 1rem;
    span {
        text-transform: uppercase;
    }

    & > div:not(:first-child, :nth-child(2)) {
        border-top: 1px solid var(--grey-60);
        padding-top: 1rem;
        margin-top: 1rem;
    }
`;


export const ContentInsideOrderDetailsBox = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .price {
        font-size: 1rem;
        color: var(--gray-100);
        font-weight: 400;
    }

    .tax {
        text-transform: capitalize;
    }

`;

export const PaymentOrderBox = styled.div`
    ${OrderBoxMixin}
    ${Font}
    flex-direction: column;
    
    & > div:not(:first-child) {
        border-top: 1px solid var(--grey-60);
        padding-top: 1rem;
        margin-top: 1rem;
    }
`;

const Icon = css`
    width: .9rem;
    height: .9rem;
    margin-right: 10px;
`;

export const ClockIcon = styled(Clock)`
    ${Icon}
`;
export const DeliveryDiningIcon = styled(DeliveryDining)`
    ${Icon}
`;
export const SparklesIcon = styled(Sparkles)`
    ${Icon}
`;
export const Check2CircleIcon = styled(Check2Circle)`
    ${Icon}
`;
export const PinMapIcon = styled(PinMap)`
    ${Icon}
`;
export const Checked = styled(CheckCircleFill)`
    ${Icon}
`;
export const MoneyIcon = styled(Money)`
    width: 1.2rem;
    height: 1.2rem;
    ${Icon}
`;



