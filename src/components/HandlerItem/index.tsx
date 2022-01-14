import React from "react";

import {
  Container,
  Column,
  Description,
  RemoveIcon,
  PrinterIcon,
} from "./styles";

import { Handler as HandlerModel } from "../../models/dtos/handler";

type IProps = {
  handler: HandlerModel;
  onDelete?: (id: number) => void;
};

const HandlerItem: React.FC<IProps> = ({ handler, onDelete }) => {
  const { id, type, amount, created_at, reason } = handler;
  const time = created_at.split(" ")[1];

  // const onPrint = (_handler: HandlerModel) => {
  //   ipcRenderer.send("handler:print", _handler);
  // };
  return (
    <Container>
      <Column span={4}>
        <Description>{id}</Description>
      </Column>
      <Column span={4}>
        <Description>{type === 0 ? "Entrada" : "Saída"}</Description>
      </Column>
      <Column span={4}>
        <Description>{(+amount).toFixed(2).replace(".", ",")}R$</Description>
      </Column>
      <Column span={4}>
        <Description>{time}</Description>
      </Column>
      <Column span={4}>
        <Description>{reason}</Description>
      </Column>
      <>
        <Column span={4}>
          {window.Main.user.hasPermission("handler.delete_handler") && (
            <RemoveIcon onClick={() => onDelete(id)} />
          )}
          {/* <PrinterIcon onClick={() => onPrint(handler)} /> */}
        </Column>
      </>
    </Container>
  );
};

export default HandlerItem;
