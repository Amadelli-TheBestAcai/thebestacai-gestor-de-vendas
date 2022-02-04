import styled, { css } from "styled-components";

import { SendPlane, Attachment } from "../../styles/Icons";

import { Modal as ModalAnt, Input as InputAnt } from "antd";

export const Modal = styled(ModalAnt)`
  .ant-modal-body {
    background: var(--white-25);
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 430px !important;

    .ant-modal-body {
      input {
        height: 3rem;
        font-size: 0.8rem;
      }
      max-height: 400px;
    }
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    .ant-modal-body {
      max-height: 530px;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50vh;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  padding: 2%;
  overflow-y: scroll;
  border-radius: 10px;
  background: var(--white);
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
`;

interface IMessageBalloon {
  user_message: string;
  user_login: string;
}

export const MessageContent = styled.div<IMessageBalloon>`
  display: flex;

  label {
    font-weight: bold;
    color: #4f4e4e;
    font-size: 13px;
    text-transform: capitalize;
  }

  ${({ user_login, user_message }) =>
    user_login === user_message &&
    css`
      flex-direction: row-reverse;
    `}
`;

export const MessageBalloon = styled.div<IMessageBalloon>`
  display: flex;
  flex-direction: column;
  background: #f8f8f9;
  color: #4f4e4e;
  padding: 3%;
  border-radius: 0 10px 10px 10px;
  margin: 0 0 10px 0;

  span {
    font-size: 10px;
    text-align: end;
    color: var(--white);
  }

  ${({ user_login, user_message }) =>
    user_login === user_message &&
    css`
      border-radius: 10px 0 10px 10px;
      margin: 0 0 10px 0;
      background: var(--orange-250);
    `}
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
`;

export const Input = styled(InputAnt)`
  height: 70%;
  width: 80%;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px !important;
  border-radius: 0.7rem 0 0 0.7rem !important;
`;

const IconCSS = css`
  height: 1.5rem;
  width: 1.5rem;
  color: white;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 1.1rem;
    width: 1.1rem;
  }
`;

const ButtonCSS = css`
  height: 70%;
  width: 10%;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3rem;
  }
`;

export const ButtonSend = styled.button`
  ${ButtonCSS}
  background: var(--green-200);
`;

export const ButtonAttachment = styled.button`
  ${ButtonCSS}
  background: var(--purple-450);
  border-radius: 0 0.7rem 0.7rem 0;
`;

export const SendIcon = styled(SendPlane)`
  ${IconCSS}
`;

export const AttachmentIcon = styled(Attachment)`
  ${IconCSS}
  transform: rotate(90deg);
`;
