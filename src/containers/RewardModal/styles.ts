import styled, { css } from "styled-components";
import { Col as ColAnt, Modal as ModalAnt, Row as RowAnt, Button as ButtonAnt } from "antd";
import { Search } from "../../styles/Icons";
import { IMaskInput } from "react-imask";

export const GlobalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Row = styled(RowAnt)`
  width: 100%;
`;

export const Modal = styled(ModalAnt)`
  user-select: none;

  .ant-modal-body {
    padding: 20px;
  }
  .ant-modal-title {
    font-size: 1.3rem;
  }

  max-height: 50rem !important;
  overflow-y: auto;
`;
;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputSearchReward = styled.input`
  height: 2.5rem;
  border: 1px solid var(--gray-50);
  padding: 5px;
  border-radius: 5px;
  width: 100%;
`;

export const InputMask = styled(IMaskInput)`
  width: 100%;
  border: 1px solid var(--gray-50);
  height: 2.5rem;
  border-radius: 5px;
  padding: 5px;
`;


export const ButtonSearch = styled(ButtonAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--orange-250);
  color: white;
  border-radius: 4.5rem;
  padding: 5px;
  margin-left: 10px;
  cursor: pointer;

  :disabled {
    cursor: not-allowed;
    background-color: var(--gray-50);

    :hover {
      cursor: not-allowed;
    background-color: var(--gray-50);
    opacity: 100%;
    }
  }

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

export const InfoClient = styled.div`
  display: block;
  margin: 0 0 1rem 0;
  p {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--gray-250);
    text-transform: capitalize;
    margin: 0;
  }
`;

export const ContentReward = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface ICustomerProps {
  available: boolean;
}

export const DataClient = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  span {
    font-weight: 700;
    font-size: .8rem;
    margin-bottom: .6rem;
  }  
`;

export const ContentGeneral = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .max-points{
    font-size: .8rem;
    color: var(--grey-70);
    font-weight: 400;
    justify-content: end;
    display: flex;
    margin-top: .5rem;
  }
`;

export const Value = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const CustomerPoints = styled.div<ICustomerProps>`
 text-align: center;
 font-size: 2rem;
 font-weight: 800;
 color: ${({ available }) => (available ? 'var(--orange-250)' : 'var(--gray-250)')};

 span{
  color: var(--grey-100);
  font-size: 1rem;
  font-weight: 400;
  margin-left: .2rem;
 }
`;

export const PointsCustomerContainer = styled.div`
  padding: 1.2rem;
  background-color: var(--soft-orange);
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--gray-25);
  border-radius: 4px;
`;

interface IProgressBarProps {
  actived: string;
}

export const ProgressBarActived = styled.div<IProgressBarProps>`
  height: 8px;
  background-color: var(--orange-250);
  border-radius: 4px;
  ${({ actived }) => css`
    width: ${actived};
  `}
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

export const ImgReward = styled.img`
  width: 12rem;
  height: 12rem;
  object-fit: contain;
  margin-top: 1rem;
`;

export const TitleReward = styled.span`
  font-size: 2rem;
  font-weight: 500;
`;

export const ButtonSave = styled(ButtonAnt)`
  padding: 10px;
  font-weight: 500;
  border-radius: 5px;
  font-size: 0.9rem;
  background: var(--orange-250);
  color: white;
  transition: 0.5s;
  width: 12rem;
  transition: .3s ease-out;

  :hover {
    background: var(--orange-200);
    color: white;
    opacity: 70%
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;
