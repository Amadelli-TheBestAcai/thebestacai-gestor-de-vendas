import styled, { css } from "styled-components";
import {
  Button as ButtonAnt,
  Row as RowAnt,
  Radio as RadioAnt,
  Form as FormAnt,
} from "antd";
import {
  Clock,
  DeliveryDining,
  Sparkles,
  Check2Circle,
  PinMap,
  CheckCircleFill,
  Money,
  InfoCircle,
  Store,
} from "../../styles/Icons";
import { OrderDto } from "../../models/dtos/ifood";

interface IPageIfoodProps {
  delivery: string;
}

const OrderBoxMixin = css`
  display: flex;
  padding: 0.5rem 1.5rem;
  background-color: var(--white);
  border: 1px solid var(--grey-60);
  color: var(--grey-60);
  border-radius: 0.4rem;
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
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1rem;

  position: relative;
`;

export const Radio = styled(RadioAnt)``;

export const RadioGroup = styled(RadioAnt.Group)`
  font-size: 1.1rem;
  .ant-radio-wrapper {
    margin: 0 0.8rem 0.8rem;
  }
`;

export const Row = styled(RowAnt)`
  p {
    font-size: 1.1rem;
  }
  .attention {
    color: red;
  }
`;

export const Form = styled(FormAnt)`
  .ant-form-item-control-input {
    padding: 0;
  }

  .ant-form label {
    font-size: 1.1rem;
  }
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
  margin-bottom: 0.5rem;
`;

export const OrderBoxInfo = styled.div`
  ${OrderBoxMixin}
  align-items: center;
  margin-right: 1rem;
  width: 15rem;
`;

export const OrderBoxItems = styled.div`
  ${OrderBoxMixin}
  flex-direction: column;

  span {
    font-size: 0.7rem;
  }
`;

export const OrderAdress = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
  background-color: var(--white);
  border: 1px solid var(--grey-60);
  border-radius: 0.4rem;
  background-color: var(--white-30);
  margin-bottom: 1rem;
  align-items: center;
  color: var(--grey-100);
  gap: 1rem;
`;

export const TypeDelivery = styled.div<IPageIfoodProps>`
  border: 1px solid black;
  padding: 0.2rem 1rem;
  font-size: 12px;

  display: flex;
  gap: 5px;
  align-items: center;
  text-align: center;
  border-radius: 12px;
  color: black;

  ${({ delivery }) => {
    if (delivery === "IFOOD") {
      return css`
        border: 0.1rem solid #c40202;
        background-color: #ffd5d5;
      `;
    } else {
      return css`
        background-color: #e3a0ff;
        border: 0.1rem solid #8c0195;
      `;
    }
  }};
`;

export const DeliveryIcon = styled(DeliveryDining)`
  height: 1rem;
`;

export const ContentGoBack = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 0.5rem;
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
  justify-content: space-between;

  .price {
    font-size: 1rem;
    color: var(--gray-100);
    font-weight: 400;
  }

  .tax {
    text-transform: capitalize;
  }

  .cupomPrice {
    font-size: 1rem;
    color: var(--red-600);
    font-weight: 400;
  }
  .cupomTax {
    border-left: 1px solid;
    padding-left: 10px;
    font-size: 1rem;
    text-transform: capitalize;
    margin-left: 2.2rem;
    color: var(--grey-90);
  }
`;

export const ContainerOrder = styled.div`
  display: flex;
  flex-direction: column;

  .options {
    border-left: 1px solid;
    color: var(--grey-90);
    list-style-type: none;
    margin-left: 1.5rem;
  }
  li {
    margin-left: 1rem;
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

  .deliveryDetails {
    font-size: 1rem;
    margin-left: 1rem;
  }
`;

const Icon = css`
  width: 0.9rem;
  height: 0.9rem;
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
export const InfoTaxIcon = styled(InfoCircle)`
  ${Icon}
`;

export const StoreIcon = styled(Store)`
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 10px;
`;
export const MoneyIcon = styled(Money)`
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 10px;
`;

export const ContentBoxes = styled.div`
  display: flex;
  width: 100%;
`;

export const ContentAcceptORDeniedOrder = styled.div`
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
  display: flex;
  position: absolute;
  bottom: 0;
  background-color: var(--white);
  border-top: 1px solid var(--grey-60);
  align-items: center;

  .btn-content {
    justify-content: end;
    display: flex;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100%;
  width: 100%;
`;

export const Button = styled(ButtonAnt)`
  display: flex;
  height: 40px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  width: 150px;
  transition: 0.3s ease-in-out;
  background-color: var(--orange-250);
  color: var(--white);
  :hover,
  :focus,
  :active {
    border: 2px solid var(--grey-60);
    opacity: 70%;
  }

  :first-child {
    margin-right: 20px;
  }

  .cancel-btn {
    background-color: transparent;
    border: none;
  }
`;

export const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid red;
  color: red;

  :hover {
    background-color: transparent;
    border: 1px solid red;
    color: red;
  }
`;
