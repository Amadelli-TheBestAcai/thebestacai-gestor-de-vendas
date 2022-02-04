import styled, { css } from "styled-components";

import {
  Offer,
  LogInCircle,
  DocumentBulletList,
  LogOutCircle,
  Chatbubbles,
} from "../../styles/Icons";

const BasicCSS = css`
  height: 100%;
  align-items: center;
  flex-direction: center;
  display: flex;
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11rem;
  height: 4.4rem;
  border: 1px solid var(--gray-50);
  box-sizing: border-box;
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 1.8rem;
  font-weight: bold;
  transition: 0.5s;

  :hover {
    border: 1px solid var(--orange-250);
    color: var(--orange-250);

    svg {
      color: var(--orange-250);
    }
  }

  /* Responsive 1680 */
  @media (max-width: 1680px) {
    width: 10rem;
  }

  /* Responsive 1600 */
  @media (max-width: 1600px) {
    width: 9.5rem;
    height: 4rem;

    @media (max-height: 900px) {
      height: 3.7rem;
      font-size: 0.9rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 8.8rem;
    height: 3.6rem;
  }
`;

const IconCSS = css`
  width: 1.3rem;
  height: 1.3rem;
  color: black;
  margin-right: 7px;
  transition: 0.5s;
`;

export const Container = styled.div`
  ${BasicCSS}
  width: 100%;
`;

export const ActionButtons = styled.div`
  ${BasicCSS}
  align-items: flex-start;
  width: 65%;
  justify-content: space-between;
`;

export const InfosAndChat = styled.div`
  ${BasicCSS}
  width: 35%;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const ContentHeaderInfos = styled.div`
  ${BasicCSS}
  width: 26rem;
  height: 4.4rem;
  background: var(--white);
  border: 1px solid var(--gray-50);
  box-sizing: border-box;
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  font-size: 1rem;

  /* Responsive 1680 */
  @media (max-width: 1680px) {
    width: 23rem;
  }

  /* Responsive 1600 */
  @media (max-width: 1680px) {
    width: 22rem;
    height: 4rem;

    @media (max-height: 900px) {
      height: 3.7rem;
      font-size: 0.9rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 19rem;
    height: 3.6rem;
    font-size: 0.8rem;
  }
`;

export const InfoStore = styled.div`
  ${BasicCSS}
  flex-direction: column;
  width: 50%;
  justify-content: center;
  border-right: 1px solid var(--gray-25);
`;

export const UserPhoto = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50px;

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

export const ChatContainer = styled.div`
  ${BasicCSS}
  width: 50%;
  justify-content: space-evenly;
`;

export const Button = styled.button`
  ${ButtonCSS}
`;

export const OfferIcon = styled(Offer)`
  ${IconCSS}
`;

export const InputIcon = styled(LogInCircle)`
  ${IconCSS}
`;

export const OutputIcon = styled(LogOutCircle)`
  ${IconCSS}
`;

export const ListIcon = styled(DocumentBulletList)`
  ${IconCSS}
`;

export const ChatIcon = styled(Chatbubbles)`
  ${IconCSS}
  width: 2rem;
  height: 2rem;
  cursor: pointer;

  /* Responsive 1600px */
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 1.6rem;
    height: 1.6rem;
  }
`;
