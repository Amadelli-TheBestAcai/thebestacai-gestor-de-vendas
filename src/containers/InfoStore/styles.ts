import styled from "styled-components";

export const InfoStoreWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1px solid var(--gray-50);
  box-shadow: 0px 0px 6px 1px rgba(163, 163, 163, 0.28);
  flex-direction: column;
  font-size: 0.9rem;
  text-transform: capitalize;

  height: 3.3rem;
  padding: 0.5rem;

  border-radius: 10px;

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    height: 2.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 2.4rem;
    font-size: 0.8rem;
  }

  /*Responsive 1280px*/
  @media (max-width: 1280px) {
    height: 2rem;

    @media (max-height: 800px) {
      height: 3.2rem;
      font-size: 0.75rem;
    }
  }
`;
