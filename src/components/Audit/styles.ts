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

  /*Responsive 1366px*/
   @media (max-width: 1366px) {
    padding: 1 5px;
  }
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
  width: 1rem;
  height: 1rem;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 0.7rem;
    height: 0.7rem;
  }
`;

export const Action = styled.div<IProps>`
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

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.6rem;
    padding: 1px;
  }
`;

export const Col = styled(ColAnt)`
  font-size: 1rem;
  font-weight: bold;
  text-align: center;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;
