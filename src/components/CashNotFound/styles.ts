import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    .ant-empty-image {
      height: 250px !important;
    }

    .ant-empty-description {
      font-size: 0.8rem;
    }
  }
`;
