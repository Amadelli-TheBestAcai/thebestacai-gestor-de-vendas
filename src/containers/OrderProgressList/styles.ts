import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  width: 100%;
  max-height: 100%;
`;

export const CardOrder = styled.div`
  display: flex;
  flex-direction: column;
  width: 221px;
  height: 195px;
  background: var(--white);
  border: 1px solid #bebebe;

  span {
    width: 100%;
    padding: 0.4rem;
    border-bottom: 1px solid #bebebe;
    background: #f2f2f2;
    font-size: 1rem;
    color: #7b7b7b;
  }
`;
