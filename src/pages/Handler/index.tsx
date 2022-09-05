import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import DisconectedForm from "../../containers/DisconectedForm";
import Centralizer from "../../containers/Centralizer";
import Spinner from "../../components/Spinner";
import HandlerItem from "../../components/HandlerItem";

import { Handler as HandlerModel } from "../../models/dtos/handler";
import { HandlerTotal } from "../../models/dtos/HandlerTotal";
import notHandler from "../../assets/svg/notHandler.svg";

import { Empty, Modal, notification, Row } from "antd";

import {
  Container,
  PageContent,
  Header,
  ButtonDownloader,
  Content,
  HeaderList,
  Col,
  HandlerContentList,
  ButtonMoreInfo,
  ContainerHeader,
  ModalMoreInfo,
  RowModal,
  ColModal,
} from "./styles";

const { confirm } = Modal;

const Handler: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [handlers, setHandlers] = useState<HandlerModel[]>([]);
  const [handlersTotal, setHandlersTotal] = useState<HandlerTotal[]>([]);
  const [isConected, setIsConected] = useState(true);
  const [historyId, setHistoryId] = useState<number | null>(null);
  const [modalMoreInfo, setModalMoreInfo] = useState(false);

  useEffect(() => {
    async function init() {
      const { response: handlers, has_internal_error: errorOnGetHandler } =
        await window.Main.handler.getCashHandlersByStoreCash();
      if (errorOnGetHandler) {
        return notification.error({
          message: "Erro ao obter movimentações",
          duration: 5,
        });
      }

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
        const { response: handlers, has_internal_error: errorOnGetHandler } =
          await window.Main.handler.getCashHandlersByStoreCash();
        if (errorOnGetHandler) {
          return notification.error({
            message: "Erro ao obter movimentações",
            duration: 5,
          });
        }
        setIsLoading(false);
        if (!success) {
          return notification.error({
            message: "Falha ao remover movimentação!",
            description: `A movimentação selecionada [${id}] não pode ser excluída.
            Tente novamente. Caso o erro persista, entre em contato através do chat de suporte.`,
            duration: 5,
          });
        }
        setHandlers(handlers.handlers);
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

  async function handlerLocal() {
    const { response: handlersTotal, has_internal_error: errorOnGetHandler } =
      await window.Main.handler.getLocalCashHandlers();
    if (errorOnGetHandler) {
      return notification.error({
        message: "Erro ao obter movimentações",
        duration: 5,
      });
    }

    const totalTransactions = handlersTotal.map((cashHandle) => {
      return cashHandle.cashHandler;
    });
    setHandlersTotal(totalTransactions);
  }

  const totalInOutByTypeReason = (
    type: string,
    reason: string,
    cashHandlers: HandlerTotal[]
  ) => {
    let sumType: HandlerTotal[];
    let sumReason: HandlerTotal[];

    sumType = cashHandlers.filter((cashHandlers) => cashHandlers.type == type);

    if (reason == "total") {
      return sumType
        .reduce((sum, sumType) => sum + sumType.amount, 0)
        .toFixed(2);
    }
    if (reason == "Outros") {
      sumReason = sumType.filter(
        (sumType) =>
          sumType.reason == "Outros" ||
          (sumType.reason != "Troco" &&
            sumType.reason != "Sangria" &&
            sumType.reason != "Pagamento fornecedor" &&
            sumType.reason != "Pagamento freelance")
      );
      return sumReason.reduce((sum, sumReason) => sum + sumReason.amount, 0);
    }

    sumReason = sumType.filter((sumType) => sumType.reason == reason);
    return sumReason.reduce((sum, sumReason) => sum + sumReason.amount, 0);
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
                  <ContainerHeader>
                    <ButtonDownloader onClick={() => onPdf()}>
                      BAIXAR PDF
                    </ButtonDownloader>
                    <ButtonMoreInfo
                      onClick={() => {
                        setModalMoreInfo(true);
                        handlerLocal();
                      }}
                    >
                      Mais Informações
                    </ButtonMoreInfo>
                  </ContainerHeader>
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

      <ModalMoreInfo
        title="Mais Informações"
        visible={modalMoreInfo}
        destroyOnClose={true}
        closable={true}
        onCancel={() => setModalMoreInfo(false)}
        centered
        width={1000}
        footer={false}
      >
        <Content>
          <span className="saida">Saídas</span>
          <HeaderList>
            <ColModal span={8}>Sangria</ColModal>
            <ColModal span={8}>Pagamento Freelance</ColModal>
            <ColModal span={8}>Pagamento Fornecedor</ColModal>
          </HeaderList>
          <RowModal>
            <ColModal span={8}>
              R$:
              {totalInOutByTypeReason("saida", "Sangria", handlersTotal)}
            </ColModal>
            <ColModal span={8}>
              R$:
              {totalInOutByTypeReason(
                "saida",
                "Pagamento freelance",
                handlersTotal
              )}
            </ColModal>
            <ColModal span={8}>
              R$:
              {totalInOutByTypeReason(
                "saida",
                "Pagamento fornecedor",
                handlersTotal
              )}
            </ColModal>
          </RowModal>
          <HeaderList>
            <ColModal span={8}>Troco</ColModal>
            <ColModal span={8}>Outros</ColModal>
            <ColModal span={8}>Total Saídas</ColModal>
          </HeaderList>
          <RowModal>
            <ColModal span={8}>
              R$:{totalInOutByTypeReason("saida", "Troco", handlersTotal)}
            </ColModal>
            <ColModal span={8}>
              R$:{totalInOutByTypeReason("saida", "Outros", handlersTotal)}
            </ColModal>
            <ColModal span={8}>
              R$:{totalInOutByTypeReason("saida", "total", handlersTotal)}
            </ColModal>
          </RowModal>
          <span className="entrada">Entradas</span>
          <HeaderList>
            <ColModal span={8}>Troco</ColModal>
            <ColModal span={8}>Outros</ColModal>
            <ColModal span={8}>Total Entradas</ColModal>
          </HeaderList>
          <RowModal>
            <ColModal span={8}>
              R$:{totalInOutByTypeReason("entrada", "Troco", handlersTotal)}
            </ColModal>
            <ColModal span={8}>
              R$:{totalInOutByTypeReason("entrada", "Outros", handlersTotal)}
            </ColModal>
            <ColModal span={8}>
              R$:{totalInOutByTypeReason("entrada", "total", handlersTotal)}
            </ColModal>
          </RowModal>
        </Content>
      </ModalMoreInfo>
    </Container>
  );
};

export default Handler;
