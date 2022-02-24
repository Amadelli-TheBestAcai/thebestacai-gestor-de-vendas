import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import DisconectedForm from "../../containers/DisconectedForm";
import Centralizer from "../../containers/Centralizer";
import Spinner from "../../components/Spinner";
import HandlerItem from "../../components/HandlerItem";

import { Handler as HandlerModel } from "../../models/dtos/handler";
import notHandler from "../../assets/svg/notHandler.svg";

import { Empty, message, Modal, notification } from "antd";

import {
  Container,
  PageContent,
  Header,
  ButtonDownloader,
  Content,
  HeaderList,
  Col,
  HandlerContentList,
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
      centered: true,
      async onOk() {
        setIsLoading(true);
        const success =
          await window.Main.handler.deleteCashHandlerFromApiService(id);
        const data = await window.Main.handler.getCashHandlersByStoreCash();
        setIsLoading(false);
        if (!success) {
          return notification.error({
            message: "Falha ao remover movimentação!",
            description: `A movimentação selecionada [${id}] não pode ser excluída.
            Tente novamente. Caso o erro persista, entre em contato através do chat de suporte.`,
            duration: 5,
          });
        }
        setHandlers(data.handlers);
        return notification.success({
          message: "Movimentação removida com sucesso!",
          description: `A movimentação selecionada [${id}] foi excluída com sucesso.`,
          duration: 5,
        });
      },
    });
  };

  const onPdf = async () => {
    const { response: _user, has_internal_error: errorOnGetUser } =
      await window.Main.user.getUser();
    if (errorOnGetUser) {
      notification.error({
        message: "Erro ao obter usuário",
        duration: 5,
      });
      return;
    }
    const { data: response } = await axios({
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${_user?.token}`,
      },
      url: `${window.Main.env.API_DASH}/cash_handler/pdf/${historyId}`,
    });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
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
      <PageContent>
        {isLoading ? (
          <Spinner />
        ) : isConected ? (
          <>
            {handlers?.length ? (
              <>
                <Header>
                  <h2>Movimentações</h2>
                  <ButtonDownloader onClick={() => onPdf()}>
                    BAIXAR PDF
                  </ButtonDownloader>
                </Header>
                <Content>
                  <HeaderList>
                    <Col span={4}>ID</Col>
                    <Col span={4}>Tipo</Col>
                    <Col span={4}>Valor</Col>
                    <Col span={4}>Hora</Col>
                    <Col span={4}>Razão</Col>
                    <Col span={4}>Ações</Col>
                  </HeaderList>
                  <HandlerContentList>
                    {handlers.map((handler) => (
                      <HandlerItem
                        key={handler.id}
                        handler={handler}
                        onDelete={onDelete}
                      />
                    ))}
                  </HandlerContentList>
                </Content>
              </>
            ) : (
              <Centralizer>
                <Empty
                  description="Nenhuma movimentação encontrada."
                  image={notHandler}
                  imageStyle={{
                    height: 350,
                  }}
                />
              </Centralizer>
            )}
          </>
        ) : (
          <DisconectedForm />
        )}
      </PageContent>
    </Container>
  );
};

export default Handler;
