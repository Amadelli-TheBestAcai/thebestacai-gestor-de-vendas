import styled, { css } from "styled-components";

import { Divider as DividerAnt, Row as RowAnt, Col as ColAnt } from "antd";

import { ArrowRight } from "../../styles/Icons";

interface IProps {
  newvalue: string | number;
  oldvalue: string | number;
}

export const Container = styled(RowAnt)<IProps>`
  display: flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
  margin-bottom: 5px;
  border-radius: 4px;
  text-transform: capitalize;
  padding: 0 10px;

  ${({ newvalue, oldvalue }) => {
    if (!oldvalue && newvalue > 0) {
      return css`
        border: 1px solid #c9f2a0;
        background: #f6ffed;
      `;
    }

    if (oldvalue && newvalue) {
      return css`
        border: 1px solid #f49345;
        background: #fffbe6;
      `;
    }

    return css`
      border: 1px solid #a43c3f;
      background: #fff1f0;
    `;
  }}
`;

export const Information = styled.label``;

export const Divider = styled(DividerAnt)`
  height: 16px;
  border-left: 2px solid #00000075;
  @media only screen and (max-width: 578px) {
    font-size: 14px;
  }
`;

export const ArrowRightIcon = styled(ArrowRight)`
  width: 16px;
  height: 16px;
  @media only screen and (max-width: 578px) {
    width: 14px;
    height: 14px;
  }
`;

export const Action = styled.div<IProps>`
  margin-left: 5px;
  color: white;
  border-radius: 4px;
  padding: 2px;
  text-transform: uppercase;
  font-size: 12px;

  ${({ newvalue, oldvalue }) => {
    if (!oldvalue && newvalue > 0) {
      return css`
        background: #a6e665;
      `;
    }

    if (oldvalue && newvalue) {
      return css`
        background: #f49345;
      `;
    }

    return css`
      background: #a43c3f;
    `;
  }};
`;

export const Col = styled(ColAnt)`
  font-size: 16px;
  font-weight: bold;
  @media only screen and (max-width: 578px) {
    font-size: 14px;
  }
  text-align: center;
`;
