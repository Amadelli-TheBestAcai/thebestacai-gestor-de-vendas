import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { currencyFormater } from "../../helpers/currencyFormater";
import moment from "moment";

import AmountModal from "../../components/AmountModal";
import Spinner from "../../components/Spinner";

import { StoreCashHistoryDTO } from "../../models/dtos/storeCashHistory";
import { Balance as BalanceModel } from "../../models/dtos/balance";

import { Modal, notification } from "antd";

import {
  Container,
  PageContent,
  Header,
  CashStatusContainer,
  HeaderStatus,
  StatusCash,
  Status,
  Left,
  Right,
  ContentStatusCash,
  CardStatus,
  CloseCashContatiner,
  OpenCloseButton,
  Input,
  Footer,
  ButtonCancel,
  ButtonSave,
  StatusWrapper
} from "./styles";
import { useSale } from "../../hooks/useSale";

interface IProp extends RouteComponentProps { }

moment.locale("pt-br");
moment.updateLocale("pt", {
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
});

const StoreCash: React.FC<IProp> = ({ history }) => {
  const { storeCash, setStoreCash } = useSale();
  const [storeCashHistory, setStoreCashHistory] =
    useState<StoreCashHistoryDTO | null>(null);
  const [amountModal, setAmountModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<BalanceModel>();
  const [loading, setLoading] = useState(true);
  const [openingOnlineStoreCash, setOpeningOnlineStoreCash] = useState(false);

  const [modalJustify, setModalJustify] = useState(false);
  const [updatingCashObservation, setUpdatingCashObservation] = useState(false);
  const [justify, setJustify] = useState<string>("");

  useEffect(() => {
    async function init() {
      const {
        response: _currentStoreCash,
        has_internal_error: errorOnGetCurrentStoreCash,
      } = await window.Main.storeCash.getCurrent();
      if (errorOnGetCurrentStoreCash) {
        notification.error({
          message: "Erro ao encontrar caixa atual",
          duration: 5,
        });
        return;
      }
      console.log({ _currentStoreCash });

      if (!_currentStoreCash?.is_opened) {
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

        setStoreCashHistory(_storeCashHistory);

        if (
          _storeCashHistory !== undefined &&
          +_storeCashHistory.result_cash !== 0 &&
          !_storeCashHistory?.observation &&
          _storeCashHistory.closed_at !== null
        ) {
          setModalJustify(true);
        }

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
      setStoreCash(_currentStoreCash);
      setLoading(false);
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
        label: "Delivery - Online",
        value: currencyFormater(_balance?.delivery?.online),
      },
      {
        id: 8,
        label: "Resultado",
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

  const openOnlineStoreCash = async (code?: string) => {
    if (openingOnlineStoreCash) {
      return notification.warning({
        message: "Aguarde que estamos abrindo um caixa pra você",
        duration: 5
      });
    }
    if (code !== 'OFFLINE') {
      return notification.warning({
        message: "Caixa online já está aberto",
        duration: 5
      });
    }
    setOpeningOnlineStoreCash(true);
    const { has_internal_error, error_message } =
      await window.Main.storeCash.openOnlineStoreCash();
    if (has_internal_error) {
      notification.error({
        message: error_message || "Falha ao abrir o caixa",
        duration: 5,
      });
      setOpeningOnlineStoreCash(false);
      return;
    }
    notification.success({
      message: "Caixa online aberto com sucesso",
      duration: 5,
    });
    setOpeningOnlineStoreCash(false);
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
            <CashStatusContainer>
              <HeaderStatus>
                <h2>Status do Caixa</h2>
                <StatusWrapper>
                  <StatusCash>
                    <Status>
                      <Left onClick={() => openOnlineStoreCash(storeCash?.code)}>Caixa {storeCash?.code}</Left>
                      <Right is_opened={storeCash?.is_opened}>
                        {storeCash?.is_opened ? "Aberto" : "Fechado"}
                      </Right>
                    </Status>
                    {!storeCash?.is_opened && storeCash?.created_at && (
                      <span>
                        {moment(
                          storeCash?.created_at,
                          "yyyy-MM-DDHH:mm:ss"
                        ).format("DD [de] MMMM [de] YYYY  HH:mm")}
                      </span>
                    )}
                  </StatusCash>
                  <CloseCashContatiner>
                    <OpenCloseButton onClick={() => setAmountModal(true)} _type={storeCash?.is_opened ? "close" : "open"}>
                      {storeCash?.is_opened ? "Fechar Caixa" : "Abrir Caixa"}
                    </OpenCloseButton>
                  </CloseCashContatiner>
                </StatusWrapper>
              </HeaderStatus>

              <ContentStatusCash>
                {createClosedStatus(balance, storeCashHistory).map(
                  (amoutStatus) => (
                    <CardStatus
                      id_card={amoutStatus.id}
                      key={amoutStatus.id}
                      amount_open={+storeCashHistory?.amount_on_open}
                      result_cash={+storeCashHistory?.result_cash}
                    >
                      <label>{amoutStatus.label}</label>
                      <span> R$ {amoutStatus.value}</span>
                    </CardStatus>
                  )
                )}
              </ContentStatusCash>
            </CashStatusContainer>
          </>
        )}
      </PageContent>
      <AmountModal
        visible={amountModal}
        setVisible={setAmountModal}
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
