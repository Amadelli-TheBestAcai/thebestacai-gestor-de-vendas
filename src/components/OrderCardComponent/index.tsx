import React, { useState } from 'react'
import { Container, DeliveryBox, Order, StatusMessage, CardGeneral, Button, ContentTopInfo, TrashIcon, ContentDeliveryBox, ContentIcons, DeliveryDiningIcon, CheckCircleFillIcon, InsideCard, CancelIcon } from './styles'
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
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    const handleCardClick = () => {
        setSelectedOrder(selectedOrder === order ? null : order);
    };

    return (
        <CardGeneral onClick={onClick}>
            <InsideCard
                onClick={handleCardClick}
                isSelected={selectedOrder === order}
            >
                <Container>
                    <ContentTopInfo>
                        <Order>#{order}</Order>

                        <ContentIcons>
                            <Tooltip title="Pedido à caminho">
                                {fullCode === 'DISPATCHED' && <DeliveryDiningIcon />}
                            </Tooltip>
                            <Tooltip title="Pedido entregue">
                                {fullCode === 'CONCLUDED' && <CheckCircleFillIcon />}
                            </Tooltip>
                            <Tooltip title="Pedido cancelado">
                                {fullCode === 'CANCELLED' && <CancelIcon />}
                            </Tooltip>
                            <Tooltip title="Deletar pedido">
                                <TrashIcon onClick={(id) => onDeleteCard(id)}>excluir</TrashIcon>
                            </Tooltip>
                        </ContentIcons>
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
                    {fullCode === 'CONFIRMED' && <Button>Despachar pedido</Button>}
                </Container>
            </InsideCard>
        </CardGeneral>
    )
}

export default OrderCard