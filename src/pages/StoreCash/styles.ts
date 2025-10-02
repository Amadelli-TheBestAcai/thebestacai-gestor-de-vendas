import styled, { css } from "styled-components";

import vectorChart from "../../assets/svg/vectorChart.svg";

import { Input as InputAnt } from "antd";

interface ICardStatus {
  id_card: number;
  result_cash: number;
  amount_open: number;
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
  justify-content: space-between;
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
  width: 70%;
  margin: 0 10px;

  span {
    margin-top: 4px;
    font-weight: normal;
    font-size: 0.7em;
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

export const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
`;

export const Status = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
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
  background-size: 30%;

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
      if (id_card === 7) {
        return css`
          color: var(--orange-400);
        `;
      }

      return css`
        color: var(--grey-100);
      `;
    }}
  }

  span {
    ${({ id_card, result_cash, amount_open }) => {
      if (id_card === 8) {
        if (result_cash > amount_open) {
          return css`
            color: var(--green-200);
          `;
        }
        if (result_cash < amount_open) {
          return css`
            color: var(--red-600);
          `;
        }
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
    height: 115px;
    font-size: 1.6rem;

    label {
      font-size: 0.7rem;
    }
  }
`;

export const CloseCashContatiner = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  width: 40%;
  height: 100%;
`;

type IOpenCloseButton = {
  _type: "open" | "close";
};

export const OpenCloseButton = styled.button<IOpenCloseButton>`
  width: 100%;
  height: 70%;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 4px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  ${({ _type }) => {
    if (_type === "open") {
      return css`
        background: var(--green-400);
      `;
    }
    if (_type === "close") {
      return css`
        background: #c53030;
      `;
    }
  }}

  &&&:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 60%;
    font-size: 0.8rem;
  }
`;

export const Input = styled(InputAnt)`
  height: 3.7rem;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
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
