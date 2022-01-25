import React, { useState, useEffect } from "react";
import axios from "axios";
import DisconectedForm from "../../containers/DisconectedForm";
import Centralizer from "../../containers/Centralizer";
import Spinner from "../../components/Spinner";
import HandlerItem from "../../components/HandlerItem";

import { Handler as HandlerModel } from "../../models/dtos/handler";

import { Empty, message, Modal } from "antd";
import moment from "moment";
import {
  Container,
  Content,
  Name,
  HandlersContainer,
  HandlersHeader,
  Column,
  Title,
  HandlersList,
  Button,
} from "./styles";

const { confirm } = Modal;

const Handler: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [handlers, setHandlers] = useState<HandlerModel[]>([]);
  const [isConected, setIsConected] = useState(true);
  const [historyId, setHistoryId] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      const handlers = await window.Main.handler.getCashHandlersByStoreCash();
      const isConnected = await window.Main.hasInternet();
      setHistoryId(handlers.history_id);
      setIsConected(isConnected);
      setHandlers(handlers.handlers);
      setIsLoading(false);
    }
    init();
  }, []);

  const onDelete = (id: number): void => {
    confirm({
      title: "Remoção de Movimentação",
      content: "Tem certeza que gostaria de prosseguir?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      async onOk() {
        setIsLoading(true);
        const success =
          await window.Main.handler.deleteCashHandlerFromApiService(id);
        const data = await window.Main.handler.getCashHandlersByStoreCash();
        setIsLoading(false);
        if (!success) {
          message.warning("Falha ao remover movimentação");
        }
        setHandlers(data.handlers);
        message.success("Movimentação removida com sucesso");
      },
    });
  };

  const onPdf = async () => {
    if ((await window.Main.user.getUser()).token) {
      return message.warning(
        "Usuário em modo offline. Refaça o login com conexão à internet"
      );
    }
    const { data: response } = await axios({
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${(await window.Main.user.getUser()).token}`,
      },
      url: `${window.Main.env.API_DASH}/cash_handler/pdf/${historyId}`,
    });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    console.log(url);
    link.href = url;
    link.setAttribute(
      "download",
      `movimentacoes_${moment(new Date()).format("DD-MM-YYYY")}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Content>
        <Name>Movimentações</Name>
        {isLoading ? (
          <Spinner />
        ) : isConected ? (
          handlers?.length ? (
            <>
              <Button onClick={() => onPdf()} type="primary">
                Baixar PDF
              </Button>
              <HandlersContainer>
                <HandlersHeader>
                  <Column span={4}>
                    <Title>ID</Title>
                  </Column>
                  <Column span={4}>
                    <Title>Tipo</Title>
                  </Column>
                  <Column span={4}>
                    <Title>Valor</Title>
                  </Column>
                  <Column span={4}>
                    <Title>Hora</Title>
                  </Column>
                  <Column span={4}>
                    <Title>Razão</Title>
                  </Column>
                  <Column span={4}>
                    <Title>Ações</Title>
                  </Column>
                </HandlersHeader>
                <HandlersList>
                  {handlers.map((handler) => (
                    <HandlerItem
                      key={handler.id}
                      handler={handler}
                      onDelete={onDelete}
                    />
                  ))}
                </HandlersList>
              </HandlersContainer>
            </>
          ) : (
            <Centralizer>
              <Empty description="Nenhuma movimentação encontrada" />
            </Centralizer>
          )
        ) : (
          <DisconectedForm />
        )}
      </Content>
    </Container>
  );
};

export default Handler;
