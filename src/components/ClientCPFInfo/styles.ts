import styled from "styled-components";
import _MaskInput from "react-input-mask";
import { Modal, Button as ButtonAnt } from "antd";
import { Trash } from "styled-icons/bootstrap";

export const Container = styled(Modal)``;

export const InfoWrapper = styled.div`
  padding: 5px;
`;

export const Info = styled.span``;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

export const CpfTefContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3rem;
`;

export const ButtonCpfTef = styled.button`
  width: 29%;
  height: 100%;
  padding: 3px 7px;
  background: var(--orange-250);
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-250);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const ButtonDeleteCpf = styled.button`
  width: 10%;
  height: 100%;
  padding: 3px 7px;
  background: var(--orange-250);
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-250);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const MaskInput = styled(_MaskInput)`
  width: 100%;
  border: 1px solid var(--gray-50);
  height: 2.7rem;
  border-radius: 5px;
  padding: 0.6rem;
`;

export const FetchButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 7px;
`;

export const CampaignInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 7px;
`;

export const ButtonSave = styled.button`
  padding: 3px 7px;
  font-weight: 500;
  border-radius: 1rem;
  font-size: 0.9rem;
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-200);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const ButtonCancel = styled.button`
  font-size: 0.9rem;
  color: var(--orange-250);
  font-weight: 500;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

export const ContentCheck = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  span {
    margin-right: 0.3rem;
  }
`;

export const ContentReward = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--gray-50);
  border-radius: 5px;
  padding: 0.7rem;
`;

export const InfoClientReward = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    font-weight: 700;
    font-size: 1.3rem;
    color: var(--orange-200);
  }

  .borderedInfoClient {
    border-right: 1px solid black;
  }

  .totalPoints {
    margin-top: 1rem;
    font-weight: 400;
    font-size: 0.9rem;
  }
`;

export const TitleReward = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
`;

export const DeleteCpfIcon = styled(Trash)`
  width: 1rem;
  height: 1rem;
  color: var(--white);
`;
