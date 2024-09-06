import styled, { css } from "styled-components";

import { Button as ButtonAnt, Modal as ModalAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1.25rem 2.5rem 0;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 5rem;

  span {
    font-size: 2.5rem;
    font-weight: 600;
    text-align: center;
  }
  .span-title {
    font-size: 4rem;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5rem 2.5rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2.5rem;
`;

export const Modal = styled(ModalAnt)`
  .modal-title {
    font-family: "VisbyCF";
    font-size: 3.75rem;
    font-weight: 600;
  }

  .ant-modal-content {
    height: 100%;
    width: 100%;
    border-radius: 6.25rem;
    padding: 5rem;
    .ant-modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      padding: 0;
    }
  }
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27.8rem;
  height: 7.68rem;
  border-radius: 0.625rem;
  span {
    font-family: "VisbyCF";
    font-weight: 600;
    font-size: 2.25rem;
    color: var(--black);
  }
`;

export const Button = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--white);
  border: 3px solid var(--black);

  :active,
  :hover,
  :focus {
    background: var(--white);
    color: var(--black);
    border: 3px solid var(--black);
  }
`;

export const ButtonNewOrder = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--orange-250);
  border: none;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;

interface IEvaluation {
  loading?: boolean;
  select?: boolean;
}

export const EvalutionContainer = styled.div<IEvaluation>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 9.3rem;
  height: 12.37rem;

  ${({ loading, select }) => {
    if (loading) {
      if (select) {
        return css`
          img {
            width: 15rem;
            height: 15rem;
            background-size: cover;
            background-position: center;
            transition: height 1s ease;
            transition: width 1s ease;
          }
          span {
            font-family: "VisbyCF";
            font-size: 3rem;
            font-weight: 600;
            transition: font-size 1s ease;
          }
        `;
      } else {
        return css`
          width: 0rem;
          height: 0rem;
          transition: height 1s ease;
          transition: width 1s ease;
          img,
          span {
            display: none;
            transition: display 1s ease;
          }
        `;
      }
    }
    if (!loading) {
      return css`
        img {
          width: 9.3rem;
          height: 9.3rem;
          background-size: cover;
          background-position: center;
        }

        span {
          font-family: "VisbyCF";
          font-size: 2rem;
          font-weight: 600;
        }
      `;
    }
  }}
`;

export const NpsContainer = styled.div<IEvaluation>`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;

  ${({ loading, select }) => {
    if (loading) {
      return css`
        height: 100%;
        align-items: flex-start;
        justify-content: center;
      `;
    }
    if (select) {
      return css`
        height: 0;
      `;
    }
  }}
`;
