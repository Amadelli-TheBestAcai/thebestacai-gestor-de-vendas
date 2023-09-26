import styled from "styled-components";
import { Button as ButtonAnt, Input as InputAnt } from "antd";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
`;

export const Instruction = styled.p`
  color: var(--black);
  font-weight: 700;
  font-size: 1.2rem;
  width: 90%;
`;

export const Title = styled.h1`
  font-size: 1.7rem;
`;

export const InfoContent = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
  text-align: initial;
  padding: 1rem;
  border-top: 1px solid var(--grey-60);
`;

export const ContentButtons = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  align-items: center;

  border-left: 1px solid var(--grey-60);
  :nth-child(1) {
    border: none;
  }

  .secondTitle {
    display: flex;
    margin-left: 6rem;
    color: var(--black);
    font-weight: 700;
    font-size: 1.2rem;
    width: 100%;
  }
`;

export const SubtitleAuth = styled.span`
  font-size: 1rem;
  display: block;
  font-weight: 500;
  width: 90%;
`;

export const ButtonLink = styled(ButtonAnt)`
  width: 80%;
  height: 3rem;
  background-color: var(--orange-250);
  color: var(--white);
  border-radius: 10px;
  margin: 2.5rem 0;

  :hover,
  :active,
  :focus {
    background-color: var(--orange-250);
    border: none;
    opacity: 70%;
    color: var(--white);
  }
`;

export const Input = styled(InputAnt)`
  width: 75%;
  height: 4.2rem;
  background-color: #f7f7f7;
  border: 1px solid #bebebebe;
  margin: 0.38rem 0;
  text-transform: uppercase;

  ::placeholder {
    color: #bebebebe;
  }
`;

export const Image = styled.img`
  width: 65%;
`;

export const ImageSize = styled.img`
  width: 40%;
`;
