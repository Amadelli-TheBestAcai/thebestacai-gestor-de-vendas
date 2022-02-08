import styled, { css } from "styled-components";

import vectorChart from "../../assets/svg/vectorChart.svg";

interface ICardStatus {
  id_card: number;
}
interface IStatusCash {
  is_opened: boolean;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--white);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  border-radius: 10px;
  padding: 1rem;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;

  h2 {
    margin-bottom: 0px;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      h2 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
  }
`;

export const CashContainer = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
`;

export const CashStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  margin-top: 3rem;
`;

export const HeaderStatus = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 8%;

  h2 {
    margin-bottom: 0px;
    font-size: 1.3rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    h2 {
      font-size: 1rem;
    }
  }
`;

export const StatusCash = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: end;
  height: 100%;
  width: 15%;

  span {
    margin-top: 4px;
    font-weight: normal;
    font-size: 0.9em;
    color: #707171;
    text-transform: uppercase;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Status = styled.div`
  display: flex;
  width: 100%;
  height: 85%;
`;

export const Left = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  background: var(--black-opaco);
  color: white;
  border-radius: 5px 0px 0px 5px;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    padding: 3px;
  }
`;

export const Right = styled.label<IStatusCash>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  border: 1px solid var(--black-opaco);
  border-radius: 0px 5px 5px 0px;

  ${({ is_opened }) => {
    if (is_opened) {
      return css`
        color: var(--green-400);
      `;
    } else {
      return css`
        color: var(--red-600);
      `;
    }
  }}

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    padding: 3px;
  }
`;

export const ContentStatusCash = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 1em;
  margin-top: 1rem;
  width: 100%;
  height: 55%;
`;

export const CardStatus = styled.div<ICardStatus>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 171px;
  background: var(--white-40);
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 3px;
  padding: 2rem;
  font-size: 2.5rem;
  color: var(--grey-100);

  background-image: url(${vectorChart});
  background-repeat: no-repeat;
  background-position: right;
  background-origin: content-box;

  label {
    position: absolute;
    font-size: 0.9rem;
    top: 1rem;
    left: 1.9rem;
    width: 100%;
    height: 32px;
    padding: 0;

    ${({ id_card }) => {
      if (id_card === 2) {
        return css`
          color: var(--green-400);
        `;
      }
      if (id_card === 3) {
        return css`
          color: var(--blue-700);
        `;
      }
      if (id_card === 5) {
        return css`
          color: var(--red-600);
        `;
      }
      if (id_card === 6) {
        return css`
          color: var(--teal-400);
        `;
      }
      return css`
        color: var(--grey-100);
      `;
    }}
  }

  /*Responsive 1680px*/
  @media (max-width: 1680px) {
    height: 165px;
    font-size: 2rem;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 150px;
      font-size: 1.8rem;

      label {
        font-size: 0.9rem;
      }
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 135px;
    font-size: 1.6rem;

    label {
      font-size: 0.7rem;
    }
  }
`;

export const CloseCashContatiner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 10%;
`;

export const CloseButton = styled.button`
  width: 25%;
  height: 75%;
  background: #c53030;
  color: white;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 500;
  border-radius: 4px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 60%;
    font-size: 0.8rem;
  }
`;
