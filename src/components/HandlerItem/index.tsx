import React from "react";

import { Container, Column, RemoveIcon, PrinterIcon } from "./styles";

import { Handler as HandlerModel } from "../../models/dtos/handler";

type IProps = {
  handler: HandlerModel;
  onDelete: (id: number) => void;
};

const HandlerItem: React.FC<IProps> = ({ handler, onDelete }) => {
  const { id, type, amount, created_at, reason } = handler;
  const time = created_at.split(" ")[1];

  // const onPrint = (_handler: HandlerModel) => {
  //   ipcRenderer.send("handler:print", _handler);
  // };
  return (
    <Container>
      <Column span={4}>{id}</Column>
      <Column span={4}>{type === 0 ? "Entrada" : "Saída"}</Column>
      <Column span={4}>R$ {(+amount).toFixed(2).replace(".", ",")}</Column>
      <Column span={4}>{time}</Column>
      <Column span={4}>{reason}</Column>
      <>
        <Column span={4}>
          {window.Main.user.hasPermission("handler.delete_handler") && (
            <RemoveIcon onClick={() => onDelete(id)} />
          )}
          <PrinterIcon />
        </Column>
      </>
    </Container>
  );
};

export default HandlerItem;
