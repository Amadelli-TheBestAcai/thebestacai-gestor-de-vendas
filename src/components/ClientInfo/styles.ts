import styled from "styled-components";
import _MaskInput from "react-input-mask";
import { Modal, Button as ButtonAnt } from "antd";

export const Container = styled(Modal)``;

export const InfoWrapper = styled.div`
  padding: 5px;
`;

export const Info = styled.span``;

export const MaskInput = styled(_MaskInput)`
  width: 100%;
  border: 1px solid var(--gray-50);
  height: 2.5rem;
  border-radius: 5px;
  padding-top: 2px;
`;

export const FetchButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 7px;
`;

export const Button = styled(ButtonAnt)``;

export const CampaignInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 7px;
`;
