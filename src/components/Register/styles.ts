import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

export const ContentValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 67%;
  background: var(--white-30);
  border: 1px solid var(--grey-70);
  box-sizing: border-box;
  border-radius: 3px;
  margin-bottom: 11px;

  span {
    color: var(--grey-100);
    font-size: 1rem;
    strong {
      font-size: 3rem;
      color: var(--black-opaco);
    }
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      span {
        font-size: 0.9rem;
        strong {
          font-size: 2.8rem;
        }
      }
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    span {
      font-size: 0.8rem;
      strong {
        font-size: 2.5rem;
      }
    }
  }
`;

export const ButtonFinisher = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 25%;
  background: var(--orange-450);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  font-size: 1.3rem;
  color: var(--black-opaco);
  font-weight: bold;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      font-size: 1.1rem;
    }
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    font-size: 1rem;
  }
`;
