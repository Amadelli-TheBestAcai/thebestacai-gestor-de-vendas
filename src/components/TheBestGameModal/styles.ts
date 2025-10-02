import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 20px;
  gap: 12px;

  span {
    color: #666;
    font-size: 14px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
`;

export const Button = styled.button`
  background-color: var(--orange-250);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--orange-200);
  }

  &:active {
    background-color: var(--orange-200);
  }
`;

export const CloseButton = styled.button`
  background-color: white;
  color: var(--orange-250);
  border: 1px solid var(--orange-250);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background-color: var(--orange-250);
    border-color: var(--orange-250);
    color: white;
  }

  &:active {
    background-color: var(--orange-250);
  }
`;
