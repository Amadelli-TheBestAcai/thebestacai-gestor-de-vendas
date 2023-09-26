import styled from "styled-components";
import _MaskInput from "react-input-mask";
import { Modal, Button as ButtonAnt } from "antd";

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

export const MaskInput = styled(_MaskInput)`
  width: 100%;
  border: 1px solid var(--gray-50);
  height: 2.7rem;
  border-radius: 5px;
  padding: .6rem;
`;

export const FetchButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 7px;
`;

export const Button = styled(ButtonAnt)`
  border-radius: 5px;
  border: 1px solid var(--orange-250);
  color: var(--orange-250);

  :hover, :focus {
    border: 1px solid var(--orange-250);
    color: var(--orange-250);
    opacity: 70%;
  }
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
  background: var(--orange-250);
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