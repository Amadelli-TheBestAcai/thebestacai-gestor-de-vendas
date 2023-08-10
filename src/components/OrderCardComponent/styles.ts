import styled from 'styled-components';
import { Button as ButtonAnt } from 'antd'

export const CardGeneral = styled.div`
    width: 100%;
    border-bottom: 1px solid var(--grey-60);
`;

export const Button = styled(ButtonAnt)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--green-400);
    color: var(--white);
    border:none;
    border-radius: 5px;
    margin-top: .7rem;

    :hover{
     opacity: 50%;
    }

    :focus, :hover, :active {
     background-color: var(--green-400);
     color: var(--white);
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    background-color: var(--gray-10);
    width: 100%;
    padding: .7rem 1rem;
    cursor: pointer;
`;

export const StatusMessage = styled.span`
    font-size: .8rem;
    font-weight: 600;
    margin-bottom: .5rem;
`;

export const Order = styled.span`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: .7rem;
`;

export const DeliveryBox = styled.div`
    border: 1px solid var(--orange-250);
    background-color: var(--warning);
    color: var(--gray-100);
    height: 1.2rem;
    padding: 2px;
    width: 5rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .7rem;
`;

