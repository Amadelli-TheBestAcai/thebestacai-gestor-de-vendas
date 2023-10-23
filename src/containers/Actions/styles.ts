import styled, { css } from "styled-components";

import {
  Offer,
  LogInCircle,
  DocumentBulletList,
  LogOutCircle,
  TrophyFill,
  Discount
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
  width: 9rem;
  height: 4rem;
  font-weight: bold;
  transition: 0.5s;
  border: 1px solid var(--gray-50);
  box-sizing: border-box;
  box-shadow: 0px 0px 6px 1px rgb(163 163 163 / 28%);
  border-radius: 10px;
  padding: .5rem;
  background-color: white;

  :hover {
    border: 1px solid var(--orange-250);
    color: var(--orange-250);

    svg {
      color: var(--orange-250);
    }
  }

  /* Responsive 1680 */
  @media (max-width: 1680px) {
    width: 8rem;
  }

  /* Responsive 1600 */
  @media (max-width: 1600px) {
    width: 8.5rem;
    height: 3.5rem;
    @media (max-height: 900px) {
      height: 3.2rem;
      font-size: 0.9rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    width: 6.8rem;
    height: 2.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 6.3rem;
    height: 2.4rem;
    font-size: 0.8rem;
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    width: 6rem;
    height: 2rem;

    @media (max-height: 800px) {
      height: 3.2rem;
      font-size: 0.75rem;
    }
  }
`;

const IconCSS = css`
  width: 1.3rem;
  height: 1.3rem;
  color: black;
  margin-right: 7px;
  transition: 0.5s;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

export const Container = styled.div`
  ${BasicCSS}
  width: 100%;
`;

export const ContentGeneral = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

export const ActionButtons = styled.div`
  ${BasicCSS}
  align-items: flex-start;
  width: 100%;
  justify-content: space-between;
`;

export const InfosAndChat = styled.div`
  ${BasicCSS}
  align-items: flex-start;
  justify-content: flex-end;
`;

export const ContentHeaderInfos = styled.div`
  ${BasicCSS}
  width: 12rem;
  height: 4.4rem;
  background: var(--white);
  border: 1px solid var(--gray-50);
  box-sizing: border-box;
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  font-size: 1rem;

  /* Responsive 1600 */
  @media (max-width: 1680px) {
    height: 4rem;

    @media (max-height: 900px) {
      height: 3.7rem;
      font-size: 0.9rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    height: 3.6rem;
    font-size: 0.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3.2rem;
    font-size: 0.7rem;
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    height: 3.7rem;
    font-size: 0.7rem;

    @media (max-height: 800px) {
      height: 3.2rem;
    }
  }
`;

export const CpfContetGeneral = styled.div`
    display: flex;
    width: 75%;
    justify-content: space-between;
    align-items: center;
  `;

export const CpfContent = styled.div`
    display: flex;

    span{
      font-size: 1.1rem;
    }
  `;

export const InfoStore = styled.div`
  ${BasicCSS}
  flex-direction: column;
  width: 100%;
  justify-content: center;
  border-right: 1px solid var(--gray-25);
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
export const TrophyIcon = styled(TrophyFill)`
  ${IconCSS}
`;
export const DiscountIcon = styled(Discount)`
  ${IconCSS}
`;
