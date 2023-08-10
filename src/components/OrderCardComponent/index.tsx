import React from 'react'
import { Container, DeliveryBox, Order, StatusMessage, CardGeneral, Button } from './styles'

interface IOrderCardProps {
    order: string;
    delivery: string;
    onClick: () => void;
    message?: string;
}

const OrderCard: React.FC<IOrderCardProps> = ({
    order,
    delivery,
    onClick,
    message
}) => {

    return (
        <CardGeneral onClick={onClick}>
            <Container>
                <Order>#{order}</Order>
                
                <StatusMessage>
                    {message}
                </StatusMessage>
                <DeliveryBox>
                    {delivery}
                </DeliveryBox>
                <Button>Despachar pedido</Button>
            </Container>
        </CardGeneral>
    )
}

export default OrderCard