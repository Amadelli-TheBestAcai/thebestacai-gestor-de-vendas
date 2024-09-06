import styled, { css } from "styled-components";
import { Button as ButtonAnt } from "antd";

interface IProp {
  urlImage: string;
}

export const Container = styled.div<IProp>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 2s ease-in-out;

  ${({ urlImage }) => {
    return css`
      background-image: linear-gradient(to top, #000000AA 0%, #00000033 20%, #00000033 20%, transparent 100%), url(${urlImage});
    `;
  }}
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
`;

interface IText {
  colorTextImage: boolean;
}

export const TextHeader = styled.div<IText>`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 5.5rem;
  left: 2.8rem;

  p {
    font-family: "Heavitas";
    font-weight: 400;
    font-size: 3rem;
    color: var(--white);
    transition: color 2s ease-in-out;
  }

  ${({ colorTextImage }) => {
    if (colorTextImage) {
      return css`
        p {
          color: var(--black);
        }
      `;
    }
  }}
`;

export const Button = styled(ButtonAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27.81rem;
  height: 7.68rem;
  padding: 2.5rem;
  background: var(--orange-250);
  color: var(--black);
  border-radius: 0.625rem;
  font-family: "VisbyCF";
  font-weight: 700;
  font-size: 2.25rem;
  border: none;
  box-shadow: #00000040 1.95px 1.95px 2.6px;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;
