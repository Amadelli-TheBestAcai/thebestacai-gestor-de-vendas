import styled, { css } from "styled-components";
import {
  DeliveryDining,
  Printer,
  Cancel,
  NotificationsCircle,
  Check2Circle,
} from "../../styles/Icons";

interface ICardProp {
  isSelected: boolean;
}

export const CardGeneral = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--grey-60);
`;

export const InsideCard = styled.div<ICardProp>`
  width: 100%;
  border-left: 5px solid var(--gray-10);
  ${({ isSelected }) =>
    isSelected &&
    css`
      border-left-color: var(--orange-200);
    `}
`;

export const ContentTopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  background-color: var(--gray-10);
  width: 100%;
  padding: 0.7rem 1rem;
  cursor: pointer;
`;

export const StatusMessage = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const Order = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
`;

export const DeliveryBox = styled.div`
  border: 1px solid var(--orange-250);
  background-color: var(--warning);
  color: var(--gray-100);
  height: 2rem;
  padding: 2px;
  width: 10rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;

  .delivery-box {
    color: var(--orange-250);
  }

  :first-child {
    margin-bottom: 0.5rem;
  }
`;

export const ContentDeliveryBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentIcons = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = css`
  width: 1.4rem;
  height: 1.4rem;
  color: var(--grey-60);
`;

export const PrintIcon = styled(Printer)`
  ${Icon}
  color: #0089ff;
  width: 1.4rem;
  height: 1.4rem;
`;

export const CheckCircleFillIcon = styled(Check2Circle)`
  ${Icon}
  margin-right: .5rem;
`;

export const DeliveryDiningIcon = styled(DeliveryDining)`
  ${Icon}
  margin-right: .5rem;
`;
export const CancelIcon = styled(Cancel)`
  ${Icon}
  margin-right: .5rem;
`;
export const NotificationsCircleIcon = styled(NotificationsCircle)`
  ${Icon}
  margin-right: .5rem;
`;
