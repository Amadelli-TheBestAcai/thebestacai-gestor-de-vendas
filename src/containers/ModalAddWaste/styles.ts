import styled from "styled-components";
import { Row, Col as ColAnt, Input as InputAnt, Form as FormAnt } from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const ContentModal = styled(Container)`
  ${Container}
  justify-content: start;
`;

export const ContentLeft = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`;
export const ContentRight = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-left: 85px;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

export const ButtonCancel = styled.button`
  font-size: 0.9rem;
  color: var(--orange-250);
  font-weight: 500;

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.8rem;
  }
`;

export const Input = styled(InputAnt)`
  height: 2.7rem;
`;

export const UploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const UploadContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: var(--orange-250);

  span {
    color: var(--orange-250);
  }

  button {
    color: var(--orange-250);
  }
`;

export const ButtonSave = styled.button`
  padding: 3px 7px;
  font-weight: 500;
  border-radius: 1rem;
  font-size: 0.9rem;
  background: var(--orange-250);
  color: white;
  transition: 0.5s;

  :hover {
    background: var(--orange-200);
  }

  :disabled {
    cursor: not-allowed;
    opacity: 50%;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ColModal = styled(ColAnt)`
  display: flex;
  flex-direction: column;
`;

export const ContentModalBody = styled(Row)``;

export const Form = styled(FormAnt)`
  display: flex;

  .ant-select-selection-item {
    color: var(--gray-70);
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: var(--white-70);
    border: none;
    border-radius: 8px;
    height: 2.7rem;
  }

  .ant-form-item-control-input {
    background-color: transparent;
    padding: 0;
  }
`;
