import React, { useState, useEffect } from "react";
import AmountModal from "../../components/AmountModal";
import { currencyFormater } from "../../helpers/currencyFormater";

import Cash from "../../components/StoreCash";
import Spinner from "../../components/Spinner";

import { StoreCashHistoryDTO } from "../../models/dtos/storeCashHistory";
import { Balance as BalanceModel } from "../../models/balance";

import { Modal, Input, message as messageAnt } from "antd";

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
} from "./styles";
import { useSale } from "../../hooks/useSale";

const StoreCash: React.FC = () => {
  const { storeCash } = useSale();
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
  const [UpdatingCashObservation, setUpdatingCashObservation] = useState(false);
  const [justify, setJustify] = useState<string>("");

  useEffect(() => {
    async function init() {
      const isConnected = await window.Main.hasInternet();
      const availableStoreCashes =
        await window.Main.storeCash.getAvailableStoreCashes();
      const _storeCashHistory =
        await window.Main.storeCash.getStoreCashHistoryService();
      const _balance = await window.Main.storeCash.getStoreCashBalance();
      setBalance(_balance);
      setStoreCashHistory(_storeCashHistory);
      setCashes(availableStoreCashes);
      setIsConnected(isConnected);
      setLoading(false);
      if (
        +_storeCashHistory.result_cash !== 0 &&
        !_storeCashHistory.observation
      ) {
        setModalJustify(true);
      }
    }
    init();
  }, []);

  const createClosedStatus = (
    _balance: BalanceModel,
    _storeCashHistory?: StoreCashHistoryDTO
  ) => {
    return [
      {
        id: 1,
        label: "Abertura",
        value: currencyFormater(+_storeCashHistory?.amount_on_open),
      },
      {
        id: 2,
        label: "Entradas",
        value: currencyFormater(+_storeCashHistory?.in_result),
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
        id: 5,
        label: "Saídas",
        value: currencyFormater(+_storeCashHistory?.out_result),
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
        value: currencyFormater(+_storeCashHistory.result_cash),
      },
    ];
  };

  const updateStoreCashObservation = async () => {
    if (justify.length < 3) {
      messageAnt.warning("Digite uma justificativa válida");
      return;
    }

    setUpdatingCashObservation(true);
    await window.Main.storeCash.updateStoreCashObservation(justify);
    setUpdatingCashObservation(false);
    setModalJustify(false);
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
            {!storeCash?.is_opened && (
              <CashContainer>
                {cashes.map((cash) => (
                  <Cash
                    key={cash.store_cash}
                    cash={cash}
                    handleCash={(_storeCash) => {
                      setStoreCashToOpen(_storeCash);
                      setAmountModal(true);
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
        onCancel={() => setModalJustify(false)}
        confirmLoading={UpdatingCashObservation}
        onOk={updateStoreCashObservation}
        destroyOnClose={true}
        closable={true}
        centered
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

export default StoreCash;
