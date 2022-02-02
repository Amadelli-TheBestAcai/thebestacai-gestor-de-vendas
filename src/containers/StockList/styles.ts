import styled, { css } from "styled-components";

import { Row as RowAnt, Col as ColAnt, Input as InputAnt } from "antd";
import { MoreHoriz } from "../../styles/Icons";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 15px;
`;

export const Tupla = styled(RowAnt)`
  width: 100%;
  min-height: 100px;
  border-bottom: 1px solid #f7f7f7;
  margin-top: 8px;
  background: #f7f7f7;
  border-radius: 3px;
  :hover {
    border-left: 5px solid #f7f7f7;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: #f7f7f7;
    padding: 10px;
  }
`;
export const Col = styled(ColAnt)``;

export const LabelName = styled.label`
  text-transform: capitalize;
  font-weight: bold;
  @media only screen and (max-width: 578px) {
    margin-left: 5px;
  }
`;

interface IStatus {
  quantity?: number;
}

export const Status = styled.label<IStatus>`
  color: white;
  padding: 5px;
  border-radius: 3px;

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
  }}
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MoreInfo = styled(MoreHoriz)`
  width: 23px;
  height: 23px;
  :hover,
  :active,
  :focus {
    fill: #f49345;
  }
  @media only screen and (max-width: 578px) {
    width: 18px;
    height: 18px;
  }
`;

export const UpdateContainer = styled.div`
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 578px) {
    flex-direction: column;
  }
`;

export const QtdCurrent = styled.div``;

export const QtdChange = styled.div`
  @media only screen and (max-width: 578px) {
    margin-top: 10px;
  }
`;

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
  @media only screen and (max-width: 578px) {
    margin-left: 9%;
  }
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
