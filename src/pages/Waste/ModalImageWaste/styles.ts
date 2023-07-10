import styled, { css } from "styled-components";

import { Trash } from "../../../styles/Icons";

import { Modal as ModalAnt, Table as TableAnt } from "antd";

export const Container = styled(ModalAnt)`
  max-height: 40rem;
`;

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Table = styled(TableAnt)`
  .ant-table-thead > tr > th {
    background: white;

    padding: 0.6rem;

    color: var(--gray-530);

    font-weight: 500;
  }

  .ant-table-tbody > tr > td {
    background: white;

    padding: 0.6rem;

    color: var(--gray-45);

    font-weight: 500;
    font-size: 1rem;

    text-transform: capitalize;
    text-overflow: ellipsis;

    white-space: nowrap;

    @media only screen and (max-width: 500px) {
      font-size: 0.7rem;
      padding: 0.8rem 0.2rem;
    }
  }
`;

export const Preview = styled.img`
  height: 6.2rem;
  object-fit: contain;
  @media only screen and (max-width: 500px) {
    height: 3rem;
  }
`;

const IconCSS = css`
  width: 1.4rem;
  height: 1.4rem;
  cursor: pointer;
`;

export const ViewButton = styled.a`
  color: var(--orange-350);
  margin-left: 5%;
`;

export const RemoveButton = styled(Trash)`
  ${IconCSS}
  color: var(--maroon);
  margin-left: 5%;
`;
