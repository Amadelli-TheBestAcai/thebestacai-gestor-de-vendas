import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100%;

  .option-list {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

export const Option = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 5px;
  height: 10rem;
  width: 10rem;
  margin: 0.25rem;

  cursor: pointer;
`;
