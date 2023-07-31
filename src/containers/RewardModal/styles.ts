import styled, { css } from "styled-components";
import { Col as ColAnt, Modal as ModalAnt, Button as AntButton } from "antd";
import { Search, MinusCircle, PlusCircle2 } from "../../styles/Icons";

export const GlobalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Container = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(0.5fr, 1.5fr);
  grid-row-gap: 25px;
  padding-bottom: 1rem;
`;

export const Modal = styled(ModalAnt)`
  user-select: none;
  .ant-modal-title {
    font-size: 1.3rem;
  }

  max-height: 50rem !important;
  overflow-y: auto;
`;

export const FirstContent = styled.div`
  display: grid;
  grid-template-columns: 320px repeat(3, 1fr);
  grid-template-rows: 1fr;
  font-size: 1.1rem;
  font-weight: 500;
  border: 1px solid var(--gray-50);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  align-items: center;

  .name {
    font-size: 1.4rem;
    font-weight: 700;
  }
`;

export const Header = styled.header`
  display: flex;
  width: 100%;
  height: 3rem;
  background: var(--black-opaco);
  color: white;
  border-radius: 12px;
  text-transform: uppercase;

  /*Responsive 1600*/
  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }

  /*Responsive 1440*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ColReward = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: start;
`;

export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  border-left: 1px solid var(--gray-50);

  :first-child {
    border: none;
    padding: 0;
  }

  span {
    text-transform: uppercase;
    text-align: center;
  }

  .first-content {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    width: 100%;
  }

  .result-points {
    font-size: 1.7rem;
    font-weight: 700;
  }
`;

export const InputSearchReward = styled.input`
  height: 2.5rem;
  width: 35%;
  border: 1px solid var(--gray-50);
  padding: 5px;
  border-radius: 5px;
`;

export const ButtonSearch = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 100%;
  background: var(--orange-250);
  color: white;
  border-radius: 4.5rem;
  padding: 5px;
  margin-left: 10px;
  cursor: pointer;

  :hover {
    background: var(--orange-250);
    color: white;
    opacity: 70%;
  }
`;

export const RewardSearch = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

export const RewardList = styled.div`
  font-size: 11px;
`;

export const RewardRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 2%;
  span {
    width: 60%;
  }
  div {
    display: flex;
    justify-content: center;
    width: 40%;
    cursor: pointer;
  }
`;

export const RewardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  overflow-y: auto;
  overflow-x: hidden;
`;

export const ContentItemRow = styled.div`
  max-height: 20rem;
  width: 100%;
  overflow-y: scroll;

  @media (max-width: 1600px) {
    max-height: 15rem;
  }
`;

export const SearchIcon = styled(Search)`
  width: 1rem;
  height: 1rem;
  color: var(--grey-80);

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 0.8rem;
    height: 0.8rem;
  }
`;

export const CardReward = styled.div<{ invalid: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--gray-50);
  margin-bottom: 1rem;
  cursor: ${(props) => (props.invalid ? "not-allowed" : "pointer")};
  ${(props) => props.invalid && ` opacity: 30%; `}
`;

export const ImgContent = styled.img`
  width: 9rem;
  height: 5rem;
  border-radius: 12px 0 0 12px;
  border: 1px solid var(--gray-50);
`;

export const RewardDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;

  span {
    display: block;
  }

  .content {
    display: flex;
    justify-content: space-between;
  }

  .contentLeft {
    display: flex;
    font-size: 1.2rem;
  }

  .counter {
    display: flex;
    align-items: center;

    p {
      font-size: 1.5rem;
      margin: 0 10px;
    }
  }
`;

const Icon = css`
  height: 2.1rem;
  width: 2.1rem;

  cursor: pointer;
`;
export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100%;
  width: 100%;
  padding: 1rem 0.6rem;
`;

export const ButtonCancel = styled.button`
  font-size: 0.9rem;
  color: var(--orange-250);
  font-weight: 500;
  margin-right: 3rem;
`;

export const ButtonSave = styled.button`
  padding: 10px;
  font-weight: 500;
  border-radius: 5px;
  font-size: 0.9rem;
  background: var(--orange-250);
  color: white;
  transition: 0.5s;
  width: 12rem;

  :hover {
    background: var(--orange-200);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const PlusIcon = styled(PlusCircle2)`
  ${Icon}
  color: green;
`;

export const PlusIconContainer = styled.div<{ disabled: boolean }>`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  display: inline-block;
`;
export const DecreaseIcon = styled(MinusCircle)`
  ${Icon}
  color: red;
`;
