import styled from 'styled-components';
import { Button as ButtonAnt, Input as InputAnt } from 'antd'

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
    width: 100%;
    
    span{
        margin-right: 40px;
    }
`;

export const Title = styled.h1`
    font-size: 1.7rem;
`;

export const InfoContent = styled.div`
    width: 95%;
    display: flex;
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
    :nth-child(1){
        border: none
    }
`;

export const SubtitleAuth = styled.span`
 font-size: 1rem;
 display: block;
 font-weight: 500;
 margin: 2.5rem 0 0 0;
`;

export const ButtonLink = styled(ButtonAnt)`
    width: 80%;
    height: 3rem;
    background-color: var(--orange-250);
    color: var(--white);
    border-radius: 10px;
    margin: 2.5rem 0;

    :hover, :active, :focus {
        background-color: var(--orange-250);
        border: none;
        opacity: 70%;
        color: var(--white);
    }
`;

export const Input = styled(InputAnt)`
    width: 100%;
    height: 4.2rem;
    background-color: #F7F7F7;
    border: 1px solid #BEBEBEBE;
    margin: .8rem 0;
    text-transform: uppercase;

    ::placeholder{
        color: #BEBEBEBE;
    }
`;

export const Image = styled.img`
 width: 65%;
`;

export const ImageSize = styled.img`
 width: 40%;
`;