import styled, { css } from "styled-components";

import { Row, Col as ColAnt, Input as InputAnt } from "antd";
import { MoreHoriz } from "../../styles/Icons";

interface IStatus {
  quantity?: number;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Header = styled.header`
  display: flex;
  width: 100%;
  height: 5%;
  background: var(--black-opaco);
  color: white;
  border-radius: 3px;
  text-transform: uppercase;
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100px;
    height: 75px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 95%;
`;

export const Tupla = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 12%;
  background: var(--white-30);
  margin-top: 8px;
  border-radius: 3px 3px 0 0;
`;

export const Status = styled.label<IStatus>`
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 0.8rem;

  ${({ quantity }) => {
    if (quantity <= 0 || !quantity) {
      return css`
        background: #a43c3f;
      `;
    }
    if (quantity <= 3) {
      return css`
        background: #f49345;
      `;
    }
  }};
`;

export const MoreInfo = styled(MoreHoriz)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: var(--grey-100);
`;

export const UpdateContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const QtdCurrent = styled.div``;

export const QtdChange = styled.div``;

export const EditInfo = styled.label`
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
  text-transform: uppercase;
`;

export const InputChange = styled(InputAnt)`
  width: 40%;
  border-radius: 8px;
  text-align: center;
`;
export const Input = styled(InputAnt)`
  width: 40%;
  border-radius: 8px;
  text-align: center;
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
`;
