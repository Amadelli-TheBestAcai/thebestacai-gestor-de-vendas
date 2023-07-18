import styled, { css } from "styled-components";

export const DropContainer = styled.div.attrs({
  className: "dropzone",
})<any>`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 8rem;
  border: 1px dashed var(--orange-250);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: height 0.2s ease;

  ${({ dragActive, dragReject, sizeFiles }) => {
    if (dragReject) {
      return css`
        border-color: #e57878;
      `;
    }
    if (dragActive) {
      return css`
        border-color: #78e5d5;
      `;
    }
    if (sizeFiles === 25) {
      return css`
        width: 100%;
        height: 4rem;
        align-items: center;
      `;
    }
  }}
`;

const messageColors = {
  default: "#999",
  error: "#e57878",
  success: "#78e5d5",
};

export const UploadMessage = styled.p.attrs({
  className: "uploadMessage",
})<any>`
  display: flex;
  color: var(--orange-250);
  justify-content: center;
  align-items: center;
  margin-bottom: 0;

  ${({ sizeFiles }) => {
    if (sizeFiles === 25) {
      return css`
        height: 4rem;
      `;
    }
  }}
`;

export const Container = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
