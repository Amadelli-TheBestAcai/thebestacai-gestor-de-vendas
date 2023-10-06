import React, { Dispatch, SetStateAction, useState } from "react";
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
import { OrderDto } from "../../models/dtos/ifood";

interface IOrderCardProps {
  selectedOrder: OrderDto;
  order: OrderDto;
  delivery: string;
  orderOn: string;
  fullCode: string;
  onClick: () => void;
  onPrintCard: (id: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onIntegrateCard: (id: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  changingOrderStatus: boolean;
}

const OrderCard: React.FC<IOrderCardProps> = ({
  order,
  delivery,
  orderOn,
  fullCode,
  selectedOrder,
  onClick,
  onPrintCard,
  onIntegrateCard,
  changingOrderStatus,
}) => {
  return (
    <CardGeneral onClick={onClick}>
      <InsideCard isSelected={selectedOrder?.displayId === order?.displayId}>
        <Container isSelected={selectedOrder?.displayId === order?.displayId}>
          <ContentTopInfo>
            <Order>#{order?.displayId}</Order>

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
              {["CONCLUDED", "CANCELLED"].some(
                (status) => status === fullCode
              ) &&
                !changingOrderStatus && (
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
