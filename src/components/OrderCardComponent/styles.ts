import styled, { css } from 'styled-components';

interface Status {
    status: string;
}

export const CardGeneral = styled.div`
    width: 100%;
    border-bottom: 1px solid var(--grey-60);
    margin-top: 1rem;
`;

export const Header = styled.header<Status>`
    display: flex;
    background-color: var(--orange-250);
    width: 100%;
    padding: .2rem 1rem;
    justify-content: space-between;

    ${({ status }) =>
        (status === 'preparo' || status === 'pendente' || status === 'cancelado') &&
        css`
            color: var(--orange-250);
        `}
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
    font-size: 1.1rem;
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
`;

