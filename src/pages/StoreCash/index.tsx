import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import AmountModal from "../../components/AmountModal";
import { currencyFormater } from "../../helpers/currencyFormater";

import Cash from "../../components/StoreCash";
import Spinner from "../../components/Spinner";

import { StoreCashHistoryDTO } from "../../models/dtos/storeCashHistory";
import { Balance as BalanceModel } from "../../models/balance";

import { Modal, notification } from "antd";

import {
  Container,
  PageContent,
  Header,
  CashContainer,
  CashStatusContainer,
  HeaderStatus,
  StatusCash,
  Status,
  Left,
  Right,
  ContentStatusCash,
  CardStatus,
  CloseCashContatiner,
  CloseButton,
  Input,
  Footer,
  ButtonCancel,
  ButtonSave,
} from "./styles";
import { useSale } from "../../hooks/useSale";

interface IProp extends RouteComponentProps {}

const StoreCash: React.FC<IProp> = ({ history }) => {
  const { storeCash, setStoreCash } = useSale();
  const [storeCashHistory, setStoreCashHistory] =
    useState<StoreCashHistoryDTO | null>(null);
  const [amountModal, setAmountModal] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [balance, setBalance] = useState<BalanceModel>();
  const [cashes, setCashes] = useState<
    { store_cash: string; available: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [storeCashToOpen, setStoreCashToOpen] = useState<string>();

  const [modalJustify, setModalJustify] = useState(false);
  const [updatingCashObservation, setUpdatingCashObservation] = useState(false);
  const [justify, setJustify] = useState<string>("");

  useEffect(() => {
    async function init() {
      const isConnected = await window.Main.hasInternet();
      const {
        response: availableStoreCashes,
        has_internal_error: errorOnStoreCashes,
      } = await window.Main.storeCash.getAvailableStoreCashes();
      if (errorOnStoreCashes) {
        notification.error({
          message: "Erro ao encontrar caixas disponíveis",
          duration: 5,
        });
        return;
      }
      const {
        response: _storeCashHistory,
        has_internal_error: errorOnGetCashHistory,
      } = await window.Main.storeCash.getStoreCashHistory();
      if (errorOnGetCashHistory) {
        notification.error({
          message: "Erro ao obter Histórico do caixa",
          duration: 5,
        });
      }

      const { response: _balance, has_internal_error: errorOnBalance } =
        await window.Main.storeCash.getStoreCashBalance();
      if (errorOnBalance) {
        return notification.error({
          message: "Erro ao encontrar balanço",
          duration: 5,
        });
      }

      setBalance(_balance);
      setStoreCashHistory(_storeCashHistory);
      setCashes(availableStoreCashes);
      setIsConnected(isConnected);
      setLoading(false);
      if (
        _storeCashHistory !== undefined &&
        +_storeCashHistory.result_cash !== 0 &&
        !_storeCashHistory?.observation &&
        _storeCashHistory.closed_at !== null
      ) {
        setModalJustify(true);
      }
      if (storeCash?.is_opened && !storeCash?.is_online && isConnected) {
        Modal.confirm({
          title: "Conexão disponível para sincronizar caixa offline",
          content:
            "Selecione um dos caixas disponíveis para sincronizar caixa offline ao servidor",
          okText: "ok",
          okType: "default",
          cancelText: "Não",
          cancelButtonProps: {
            hidden: true,
          },
          centered: true,
        });
      }
    }
    init();
  }, []);

  const createClosedStatus = (
    _balance: BalanceModel,
    _storeCashHistory?: StoreCashHistoryDTO
  ) => {
    const response = [];

    if (!storeCash?.is_opened) {
      response.push(
        {
          id: 2,
          label: "Entradas",
          value: currencyFormater(+_storeCashHistory?.in_result),
        },

        {
          id: 5,
          label: "Saídas",
          value: currencyFormater(+_storeCashHistory?.out_result),
        }
      );
    }

    response.push(
      {
        id: 1,
        label: "Abertura",
        value: currencyFormater(+_storeCashHistory?.amount_on_open),
      },
      {
        id: 3,
        label: "Vendas - Débito",
        value: currencyFormater(
          _balance?.store?.debit + _balance?.delivery?.debit
        ),
      },
      {
        id: 4,
        label: "Fechamento",
        value: currencyFormater(+_storeCashHistory?.amount_on_close),
      },
      {
        id: 6,
        label: "Vendas - Crédito",
        value: currencyFormater(
          _balance?.store?.credit + _balance?.delivery?.credit
        ),
      },
      {
        id: 7,
        label: "Balanço",
        value: currencyFormater(+_storeCashHistory?.result_cash),
      }
    );

    return response;
  };

  const updateStoreCashObservation = async () => {
    if (justify.length < 3) {
      notification.warning({
        message: "Oops! Motivo inválido.",
        description:
          "Digite um motivo válido para para a divengência do fechamento de caixa.",
        duration: 5,
      });
      return;
    }

    setUpdatingCashObservation(true);
    const { has_internal_error: errorOnUpdateCash } =
      await window.Main.storeCash.updateStoreCashObservation(justify);
    if (errorOnUpdateCash) {
      notification.error({
        message: "Erro ao atualizar o caixa",
        duration: 5,
      });
      return;
    }
    setUpdatingCashObservation(false);
    setModalJustify(false);
  };

  const connectOfflineStoreCash = async (cashCode: string) => {
    Modal.confirm({
      title: "Conectando caixa offline ao servidor",
      content: `O caixa ${cashCode} será aberto com o valor ${storeCash.amount_on_open.toFixed(
        2
      )}`,
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        setLoading(true);
        const { response: _storeCash, has_internal_error: errorOnStoreCash } =
          await window.Main.storeCash.openStoreCash(
            cashCode,
            +storeCash.amount_on_open
          );
        if (errorOnStoreCash) {
          notification.error({
            message: "Erro ao abrir o caixa",
            duration: 5,
          });
          return;
        }
        setStoreCash(_storeCash);
        notification.success({
          message: `Caixa offline conectado ao servidor no caixa ${cashCode} com sucesso`,
          duration: 5,
        });
        setLoading(false);
        return history.push("/home");
      },
    });
  };

  return (
    <Container>
      <PageContent>
        <Header>
          <h2>Gerenciamento de Caixa</h2>
        </Header>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {(!storeCash?.is_opened ||
              (storeCash?.is_opened &&
                !storeCash?.is_online &&
                isConnected)) && (
              <CashContainer>
                {cashes.map((cash) => (
                  <Cash
                    key={cash.store_cash}
                    cash={cash}
                    handleCash={(_storeCash) => {
                      if (storeCash?.is_opened && !storeCash?.is_online) {
                        connectOfflineStoreCash(_storeCash);
                      } else {
                        setStoreCashToOpen(_storeCash);
                        setAmountModal(true);
                      }
                    }}
                  />
                ))}
              </CashContainer>
            )}

            <CashStatusContainer>
              <HeaderStatus>
                <h2>Status do Caixa</h2>
                <StatusCash>
                  <Status>
                    <Left>Caixa {storeCash?.code}</Left>
                    <Right is_opened={storeCash?.is_opened}>
                      {storeCash?.is_opened ? "Aberto" : "Fechado"}
                    </Right>
                  </Status>
                  <span>{storeCash?.created_at}</span>
                </StatusCash>
              </HeaderStatus>

              <ContentStatusCash>
                {createClosedStatus(balance, storeCashHistory).map(
                  (amoutStatus) => (
                    <CardStatus id_card={amoutStatus.id} key={amoutStatus.id}>
                      <label>{amoutStatus.label}</label>
                      R$ {amoutStatus.value}
                    </CardStatus>
                  )
                )}
              </ContentStatusCash>

              {storeCash?.is_opened && (
                <CloseCashContatiner>
                  <CloseButton onClick={() => setAmountModal(true)}>
                    Fechar Caixa
                  </CloseButton>
                </CloseCashContatiner>
              )}
            </CashStatusContainer>
          </>
        )}
      </PageContent>
      <AmountModal
        visible={amountModal}
        setVisible={setAmountModal}
        storeCashToOpen={storeCashToOpen}
      />
      <Modal
        title={`Caixa anterior fechado com um valor incorreto. [${currencyFormater(
          +storeCashHistory?.result_cash
        )}]`}
        visible={modalJustify}
        confirmLoading={updatingCashObservation}
        destroyOnClose={true}
        closable={true}
        onCancel={() => setModalJustify(false)}
        centered
        footer={
          <Footer>
            <ButtonCancel onClick={() => setModalJustify(false)}>
              Cancelar
            </ButtonCancel>
            <ButtonSave onClick={() => updateStoreCashObservation()}>
              Salvar Alteração
            </ButtonSave>
          </Footer>
        }
      >
        <Input
          autoFocus={true}
          placeholder="Digite o motivo"
          onChange={({ target: { value } }) => setJustify(value)}
        />
      </Modal>
    </Container>
  );
};

export default withRouter(StoreCash);
