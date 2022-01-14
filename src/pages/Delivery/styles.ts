import styled, { css } from "styled-components";

import { Radio as RadioAnt, Row as RowAnt, Col as ColAnt } from "antd";

import MonetaryInput from "../../components/MonetaryInput";

import {
  TelephoneFill,
  WhatsappSquare,
  Ubereats,
  Ifood,
  AttachMoney,
  CreditCard2Back,
  CreditCard,
  CheckCircleFill,
} from "../../styles/Icons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
`;

export const PlatformContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10%;
  background: #f3f3f3;
  border: 1px solid #dbdbdb;
  box-sizing: border-box;
  .ant-radio-group {
    display: flex;
    justify-content: space-between;
    width: 80%;
  }
`;

export const PlatformItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Radio = styled(RadioAnt)``;

export const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35%;
  border-bottom: 1px solid #818080;
  margin: 0 20px;
`;

export const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
`;

export const PaymentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90%;
  width: 35%;
  color: #999595;
  .ant-radio-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
    width: 50%;
    border: 1px solid #dbdbdb;
  }
`;

export const RegisterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 90%;
  width: 65%;
  border: 1px solid #dbdbdb;
`;

export const InputGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  height: 55%;
  width: 60%;
  input {
    display: flex;
    flex-grow: 1;
    background: white;
    padding-right: 10px;
    border-radius: 2px;
    font-size: 32px;
    text-align: end;
    border: 1px solid #b0afae;
  }
`;
export const InputDescription = styled.label`
  color: #999595;
`;

export const InputPrice = styled(MonetaryInput)``;

export const RegisterButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 25%;
  height: 45%;
  color: white;
  font-size: 35px;
  font-weight: bold;
  line-height: 41.02px;
  background: #ffb13d;
  cursor: pointer;
`;

export const AppIcon = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

const PlatformIconCss = css`
  width: 35px;
  height: 35px;
`;

export const IFoodIcon = styled(Ifood)`
  ${PlatformIconCss}
`;

export const WhatsAppIcon = styled(WhatsappSquare)`
  ${PlatformIconCss}
`;

export const UberEatsIcon = styled(Ubereats)`
  ${PlatformIconCss}
`;

export const TelefoneIcon = styled(TelephoneFill)`
  ${PlatformIconCss}
`;
const PaymentIconCss = css`
  width: 20px;
  height: 20px;
`;

export const MoneyIcon = styled(AttachMoney)`
  color: #007c05;
  ${PaymentIconCss};
`;

export const CreditIcon = styled(CreditCard2Back)`
  color: #2b40fd;
  ${PaymentIconCss};
`;

export const DebitIcon = styled(CreditCard)`
  color: #f97700;
  ${PaymentIconCss};
`;

export const CheckOnline = styled(CheckCircleFill)`
  color: #009a7e;
  ${PaymentIconCss};
`;

export const SalesContainer = styled.div`
  display: flex;
  height: 45%;
  padding: 10px;
`;

export const SalesTable = styled.div`
  display: flex;
  height: 100%;
  width: 80%;
  flex-direction: column;
  overflow-y: scroll;
`;

export const SalesListHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  width: 100%;
  background: var(--primary-orange);
`;

export const SalesList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 90%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

export const SalesDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 20%;
  span {
    font-size: 14px;
    font-weight: bold;
    color: #00000052;
  }
  label {
    font-size: 22px;
    font-weight: bold;
    color: #00000052;
  }
  button {
    span {
      color: white;
    }
  }
`;

export const Column = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

export const SalesInfoContainer = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
