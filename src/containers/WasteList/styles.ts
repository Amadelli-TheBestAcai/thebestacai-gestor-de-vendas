import styled from "styled-components";
import { Row, Col as ColAnt, Input as InputAnt } from "antd";

import { AddCircle } from "../../styles/Icons";

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const ContentModal = styled(Container)`
  ${Container}
  justify-content: start;
`;

export const ContentLeft = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Input = styled(InputAnt)`
  min-height: 8%;
`;

export const ContentGeneral = styled.div`
  overflow-y: scroll;
  min-height: 70%;
`;

export const UploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  width: 100%;
  min-height: 8%;
  background: var(--black-opaco);
  color: white;
  border-radius: 3px;
  text-transform: uppercase;

  /*Responsive 1600*/
  @media (max-width: 1600px) {
    font-size: 0.9rem;
  }

  /*Responsive 1440*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 95%;
`;

export const ContentWaste = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  span {
    font-size: 2rem;
  }
`;

export const ButtonWaste = styled.button`
  width: 9rem;
  height: 2.5rem;
  border: 0;
  border-radius: 5px;
  font-size: 0.9rem;
  background: var(--orange-250);
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-200);
  }
`;

export const Tupla = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 12%;
  background: var(--white-30);
  margin-top: 8px;
  border-radius: 3px 3px 0 0;

  /*Responsive 1440*/
  @media (max-width: 1440px) {
    font-size: 0.9rem;
  }

  /*Responsive 1366*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

export const AddIcon = styled(AddCircle)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  fill: var(--green-600);

  /* Responsive 1600 */
  @media (max-width: 1600px) {
    height: 1.2rem;
    width: 1.2rem;
  }
`;
