import styled, { css } from "styled-components";

import { RepeatOutline, CheckCircle, Trash } from "../../styles/Icons";

import {
  Modal as ModalAnt,
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
  Switch as SwitchAnt,
} from "antd";

export const Container = styled(ModalAnt)`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 1000px !important;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 550px !important;
  }
`;

export const AddContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 5rem;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 4rem;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 300px;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 280px;
    }
  }
`;

export const Input = styled(InputAnt)`
  height: 3.7rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 3.5rem;
    }
  }
`;

export const ButtonAdd = styled.button`
  width: 265px;
  height: 3.7rem;
  margin-left: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  background: var(--orange-200);
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 0.7rem;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 3.5rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3rem;
    font-size: 0.7rem;
    width: 180px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3.5rem;
  background: var(--black-opaco);
  border-radius: 3px;
  color: white;
  text-transform: uppercase;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.8rem;
  }
`;

export const Content = styled.div`
  flex-direction: column;
  width: 100%;
  height: 87%;
  overflow: auto;
`;

export const Card = styled(RowAnt)`
  width: 100%;
  height: 50px;
  margin-top: 8px;
  color: var(--grey-200);
  font-weight: 500;
  font-size: 1rem;

  transition: ease-in-out background 150ms;

  :hover {
    background-color: rgb(213, 213, 213, 0.44);
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

const iconCSS = css`
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 1rem;
    height: 1rem;
  }
`;

export const RestoreIcon = styled(RepeatOutline)`
  ${iconCSS};
  color: var(--green-600);
`;

export const SwitchIcon = styled(SwitchAnt)`
  min-width: 30px;
`;
export const RemoveIcon = styled(Trash)`
  ${iconCSS};
  color: red;
  transition: ease-in-out 200ms;

  :hover {
    filter: saturate(0.3);
  }
`;
