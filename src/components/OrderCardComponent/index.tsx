import React, { useState } from "react";
import {
  Container,
  DeliveryBox,
  Order,
  StatusMessage,
  CardGeneral,
  ContentTopInfo,
  TrashIcon,
  ContentDeliveryBox,
  ContentIcons,
  DeliveryDiningIcon,
  CheckCircleFillIcon,
  InsideCard,
  CancelIcon,
  NotificationsCircleIcon,
} from "./styles";
import { Tooltip } from "antd";

interface IOrderCardProps {
  order: string;
  delivery: string;
  orderOn: string;
  fullCode: string;
  onClick: () => void;
  onDeleteCard: (id: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const OrderCard: React.FC<IOrderCardProps> = ({
  order,
  delivery,
  orderOn,
  fullCode,
  onClick,
  onDeleteCard,
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
              <Tooltip title="Novo pedido">
                {fullCode === "PLACED" && (
                  <div>
                    <NotificationsCircleIcon />
                    <StatusMessage>Novo pedido!</StatusMessage>
                  </div>
                )}
              </Tooltip>

              <Tooltip title="Pedido à caminho">
                {fullCode === "DISPATCHED" && <DeliveryDiningIcon />}
              </Tooltip>
              <Tooltip title="Pedido entregue">
                {fullCode === "CONCLUDED" && <CheckCircleFillIcon />}
              </Tooltip>
              <Tooltip title="Pedido cancelado">
                {fullCode === "CANCELLED" && <CancelIcon />}
              </Tooltip>

              {(fullCode.toUpperCase() === "CONCLUDED" ||
                fullCode.toUpperCase() === "CANCELLED") && (
                <Tooltip title="Deletar pedido">
                  <TrashIcon onClick={(id) => onDeleteCard(id)}>
                    excluir
                  </TrashIcon>
                </Tooltip>
              )}
            </ContentIcons>
          </ContentTopInfo>

          <ContentDeliveryBox>
            <DeliveryBox>
              <DeliveryDiningIcon className="delivery-box" /> {delivery}
            </DeliveryBox>
            <DeliveryBox>{orderOn}</DeliveryBox>
          </ContentDeliveryBox>
        </Container>
      </InsideCard>
    </CardGeneral>
  );
};

export default OrderCard;
