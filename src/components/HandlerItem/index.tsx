import React from "react";

import { Container, Column, RemoveIcon, PrinterIcon } from "./styles";

import { Handler as HandlerModel } from "../../models/dtos/handler";
import { useUser } from "../../hooks/useUser";
import { Tooltip } from "antd";

type IProps = {
  handler: HandlerModel;
  onDelete: (id: number) => void;
};

const HandlerItem: React.FC<IProps> = ({ handler, onDelete }) => {
  const { hasPermission } = useUser();
  const { id, type, amount, created_at, reason } = handler;
  const time = created_at.split(" ")[1];

  return (
    <Container>
      <Column span={4}>{id}</Column>
      <Column span={4}>{type === 0 ? "Entrada" : "Saída"}</Column>
      <Column span={4}>R$ {(+amount).toFixed(2).replace(".", ",")}</Column>
      <Column span={4}>{time}</Column>
      <Column span={4}>{reason}</Column>
      <>
        <Column span={4}>
          {hasPermission("handler.delete_handler") && (
            <Tooltip title="Remover" placement="bottom">
              <RemoveIcon onClick={() => onDelete(id)} />
            </Tooltip>
          )}
          <Tooltip title="Imprimir" placement="bottom">
            <PrinterIcon
              onClick={() => window.Main.common.printHandler(handler)} />
          </Tooltip>
        </Column>
      </>
    </Container>
  );
};

export default HandlerItem;
