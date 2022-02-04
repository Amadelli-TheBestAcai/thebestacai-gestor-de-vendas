import styled from "styled-components";

import { RepeatOutline } from "../../styles/Icons";

import {
  Modal as ModalAnt,
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled(ModalAnt)`
  display: flex;
  flex-direction: column;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 700px !important;
    }
  }
`;

export const AddContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 5rem;
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
`;

export const Content = styled.div`
  flex-direction: column;
  width: 100%;
  height: 87%;
`;

export const Card = styled(RowAnt)`
  width: 100%;
  height: 50px;
  margin-top: 8px;
  background: var(--white-40);
  color: var(--grey-200);
  font-weight: 500;
  font-size: 1rem;
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RestoreIcon = styled(RepeatOutline)`
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
  color: var(--green-600);
`;
