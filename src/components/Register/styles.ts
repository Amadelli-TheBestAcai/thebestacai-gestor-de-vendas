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
    strong {
      font-size: 3rem;
      color: var(--black-opaco);
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
`;
