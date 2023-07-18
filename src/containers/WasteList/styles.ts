import styled from "styled-components";
import Upload from "../../components/Upload";
import {
  Row,
  Col as ColAnt,
  Input as InputAnt,
  Select as SelectAnt,
  Form as FormAnt,
} from "antd";
import { TrashRestoreAlt, Image } from "../../styles/Icons";

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
  width: 50%;
  display: flex;
  flex-direction: column;
`;

export const ContentRight = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-left: 85px;
`;

export const Input = styled(InputAnt)`
  height: 2.7rem;
`;

export const ContentGeneral = styled.div`
  overflow-y: scroll;
  min-height: 70%;
`;
export const ContentGeneralLeft = styled.div`
  overflow-y: scroll;
  min-height: 80%;
`;

export const UploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectSearch = styled(SelectAnt)`
  width: 13rem;
  height: 2.5rem;
  font-size: 1rem;

  .ant-select-selection-item {
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .ant-select-arrow {
    span {
      font-size: 0.9rem;
    }
  }
`;

export const Option = styled(SelectAnt.Option)``;

export const Header = styled.header`
  display: flex;
  width: 100%;
  height: 8%;
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

export const TrashIcon = styled(TrashRestoreAlt)`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  color: var(--red-600);
`;
export const ImageIcon = styled(Image)`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  color: var(--grey-200);
  margin-right: 0.5rem;
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
