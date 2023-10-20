import React from "react";

import { Container, Column, RemoveIcon, PrinterIcon } from "./styles";

import { Handler as HandlerModel } from "../../models/dtos/handler";
import { useUser } from "../../hooks/useUser";
import { Tooltip, notification } from "antd";

type IProps = {
  handler: HandlerModel;
  onDelete: (id: number) => void;
};

const HandlerItem: React.FC<IProps> = ({ handler, onDelete }) => {
  const { hasPermission } = useUser();
  const { id, type, amount, created_at, reason } = handler;
  const time = created_at.split(" ")[1];

  const printHandler = async (handler: any) => {
    const { response: _settings, has_internal_error: errorOnSettings } =
      await window.Main.settings.getSettings();
      
    if (_settings.should_use_printer === false) {
      return notification.warning({
        message: "Habilite a impressora na tela de configurações.",
        duration: 5,
      });
    }

    if (errorOnSettings) {
      return notification.error({
        message: "Erro ao encontrar configurações",
        duration: 5,
      });
    }

    const { response: _printHandler, has_internal_error: errorOnHandler } =
      await window.Main.common.printHandler(handler)

    // @ts-ignore
    if (!_printHandler) {
      return notification.warning({
        message: "Não foi possível concluir a impressão da movimentação.",
        description: "Por favor, verifique a conexão da sua impressora.",
        duration: 5,
      });
    }

    if (errorOnHandler) {
      return notification.error({
        message: "Erro ao tentar imprimir",
        duration: 5,
      });
    }
  }

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
              onClick={async () => await printHandler(handler)} />
          </Tooltip>
        </Column>
      </>
    </Container>
  );
};

export default HandlerItem;
