import React from 'react'
import { Container, DeliveryBox, Header, Order, StatusMessage, CardGeneral } from './styles'

interface IOrderCardProps {
    order: string;
    status: string;
    delivery: string;
    onClick: () => void;
}

const OrderCard: React.FC<IOrderCardProps> = ({
    order,
    status,
    delivery,
    onClick
}) => {
    return (
        <CardGeneral onClick={onClick}>
            <Header status={status}>Em andamento <span>1 pedido</span></Header>
            <Container>
                <Order>#{order}</Order>
                <StatusMessage>
                    {status}
                </StatusMessage>
                <DeliveryBox>
                    {delivery}
                </DeliveryBox>
            </Container>
        </CardGeneral>
    )
}

export default OrderCard