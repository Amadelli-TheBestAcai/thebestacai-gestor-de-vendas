import styled, { css } from "styled-components";
import { Row as RowAnt, Col as ColAnt } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
`;

export const Row = styled(RowAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rem;
`;

interface IPinpad {
  letters?: boolean;
  width: string;
}

export const PinPadOption = styled(ColAnt)<IPinpad>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 0.37rem;
  height: 5rem;
  font-family: "Atkinson Hyperlegible" !important;
  font-size: 1.5rem;
  cursor: pointer;
  margin: 0.5rem;

  ${({ letters, width }) => {
    return css`
      width: ${width};
      font-weight: ${letters ? "400" : "700"};
    `;
  }}
`;

export const EraseIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  background-size: cover;
  background-position: center;
`;
