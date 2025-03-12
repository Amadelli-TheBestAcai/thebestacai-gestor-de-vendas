import styled, { css } from "styled-components";
import {
  Button as ButtonAnt,
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 77%;
  position: relative;
  overflow-y: auto;
`;

export const MenuCategory = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 27%;
  height: 100%;
  padding: 0 0.65rem;

  img {
    width: 12rem;
    height: 15.6rem;
    margin-bottom: 1.2rem;
  }

  .body-menu {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
`;

interface IMenu {
  active: boolean;
}

export const CardCategoryMenu = styled.div<IMenu>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3.75rem;
  margin: 1rem 0;
  padding: 0.125rem;
  border-radius: 0.31rem;
  box-shadow: 0.2rem 0.2rem 0.5rem var(--black-opacity-30);
  border-right: 0.625rem solid var(--white);
  background: var(--white);

  span {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 1rem;
  }

  ${({ active }) => {
    if (active) {
      return css`
        border-right: 0.625rem solid var(--orange-250);
      `;
    }
  }}
`;

export const ButtonReturn = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  padding: 1.25rem;
  border: none;
  box-shadow: none;

  :hover,
  :active,
  :focus {
    color: var(--black);
    border: none;
    box-shadow: none;
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0;
  }

  span {
    height: 2.68rem;
    font-weight: 500;
    font-size: 2.25rem;
    color: var(--black);
    border-bottom: 3px solid var(--black);
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 73%;
  height: 100%;
  padding: 2.5rem;

  .title {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  .extra-products-content {
    width: 100%;
    max-height: fit-content;
  }

  .extra-products-title {
    display: flex;
    align-items: flex-start;
    text-transform: capitalize;
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  .self-service-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 3rem 0;
  }

  .extra-product-title {
    font-size: 2.5rem;
    text-align: start;
    margin: 2.5rem 0 1rem;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 23%;
  padding: 0.5rem 1.8rem;
  background: var(--white-70);
  box-shadow: 0.2rem 0.2rem 0.5rem var(--black-opacity-30);

  .order-list-footer {
    display: flex;
    flex-direction: column;
    width: 73.15%;
    height: 100%;
    margin-right: 1.8rem;
  }

  .action-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 26.85%;
    height: 100%;
  }

  .order-title-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    width: 100%;
    height: 3.75rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.5rem 0.3rem 0;
    }

    .title-strong {
      font-weight: 800;
    }
  }
`;
interface IExtra {
  size: number;
}

export const ExtraProductList = styled(RowAnt)<IExtra>`
  width: 100%;
  max-height: 55rem;
  padding: 2.5rem 0 0 0;
  overflow-y: auto;

  ${({ size }) => {
    if (size === 1) {
      return css`
        max-height: 55rem;
      `;
    }
    if (size === 2) {
      return css`
        max-height: 45rem;
      `;
    }
    if (size >= 3) {
      return css`
        max-height: 33rem;
      `;
    }
  }}
`;

export const ExtraProduct = styled(ColAnt)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 25%;
  height: 15.81rem;
`;

export const Input = styled(InputAnt)``;

interface IRegisterButton {
  loadingRegister?: boolean;
}

export const ButtonRegister = styled(ButtonAnt)<IRegisterButton>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5rem;
  background: var(--orange-250);
  color: var(--black);
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 1.75rem;
  border: none;
  box-shadow: #00000040 1.95px 1.95px 2.6px;
  margin: 1.5rem 0;
  transition: background-color 2s ease;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }

  ${({ loadingRegister }) => {
    if (loadingRegister) {
      return css`
        background: var(--green-500);
        transition: background-color 2s ease;

        :active,
        :hover,
        :focus {
          background: var(--green-500);
          color: var(--black);
          border: none;
        }
      `;
    }
  }}
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.31rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 1.375rem;
  color: var(--black);
  margin-top: 1rem;
  box-shadow: 0.2rem 0.2rem 0.5rem var(--black-opacity-30);
`;

export const Button = styled(ButtonAnt)`
  ${ButtonCSS}
  width: fit-content;
  background: transparent;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid var(--black);
  box-shadow: none;

  :active,
  :hover,
  :focus {
    background: transparent;
    color: var(--black);
    border-radius: 0;
    border: none;
    border-bottom: 2px solid var(--black);
    box-shadow: none;
  }
`;

export const ButtonFinalize = styled(ButtonAnt)`
  ${ButtonCSS}
  width: 100%;
  border: none;
  background: var(--orange-250);

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;

const IconCSS = css`
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
`;

export const Icon = styled.img`
  ${IconCSS}
  background-size: cover;
  background-position: center;
`;
