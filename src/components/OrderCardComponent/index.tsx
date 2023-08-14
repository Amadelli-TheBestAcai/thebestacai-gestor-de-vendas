import React from 'react'
import { Container, DeliveryBox, Order, StatusMessage, CardGeneral, Button, ContentTopInfo, TrashIcon, ContentDeliveryBox } from './styles'
import { Tooltip } from 'antd';

interface IOrderCardProps {
    order: string;
    delivery: string;
    message: string;
    orderOn: string;
    fullCode: string;
    onClick: () => void;
    onDeleteCard: (id: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const OrderCard: React.FC<IOrderCardProps> = ({
    order,
    delivery,
    onClick,
    message,
    onDeleteCard,
    orderOn,
    fullCode
}) => {

    return (
        <CardGeneral onClick={onClick}>
            <Container>
                <ContentTopInfo>
                    <Order>#{order}</Order>
                    <Tooltip title="Deletar pedido">
                        <TrashIcon onClick={(id) => onDeleteCard(id)}>excluir</TrashIcon>
                    </Tooltip>
                </ContentTopInfo>
                <StatusMessage>
                    {message}
                </StatusMessage>

                <ContentDeliveryBox>
                    <DeliveryBox>
                        {delivery}
                    </DeliveryBox>
                    <DeliveryBox>
                        {orderOn}
                    </DeliveryBox>
                </ContentDeliveryBox>
                {fullCode === 'confirmed' && <Button>Despachar pedido</Button>}
            </Container>
        </CardGeneral>
    )
}

export default OrderCard