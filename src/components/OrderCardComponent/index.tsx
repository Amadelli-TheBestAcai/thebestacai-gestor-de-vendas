import React, { useState } from "react";
import {
  Container,
  DeliveryBox,
  Order,
  StatusMessage,
  CardGeneral,
  ContentTopInfo,
  PrintIcon,
  ContentDeliveryBox,
  ContentIcons,
  DeliveryDiningIcon,
  CheckCircleFillIcon,
  InsideCard,
  CancelIcon,
  NotificationsCircleIcon,
  IntegrateIcon,
} from "./styles";
import { Tooltip } from "antd";

interface IOrderCardProps {
  order: string;
  delivery: string;
  orderOn: string;
  fullCode: string;
  onClick: () => void;
  onPrintCard: (id: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onIntegrateCard: (id: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const OrderCard: React.FC<IOrderCardProps> = ({
  order,
  delivery,
  orderOn,
  fullCode,
  onClick,
  onPrintCard,
  onIntegrateCard,
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

              <Tooltip title="Imprimir pedido">
                <PrintIcon onClick={(id) => onPrintCard(id)}>
                  Imprimir
                </PrintIcon>
              </Tooltip>
              {["CONCLUDED", "CANCELLED", "DISPATCHED"].some(
                (status) => status === fullCode
              ) && (
                <Tooltip title="Registrar pedido ao caixa">
                  <IntegrateIcon onClick={(id) => onIntegrateCard(id)}>
                    IntegrateIcon
                  </IntegrateIcon>
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
