import React, { Dispatch, Fragment, SetStateAction } from "react";

import { PaymentType } from "../../models/enums/paymentType";
import { SaleDto } from "../../models/dtos/sale";

import Payment from "../../components/Payment";

import PixLogo from "../../assets/svg/pix.svg";

import {
  Container,
  TypesPaymentsContainer,
  PaymentMethodButton,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  TicketIcon,
  PixIcon,
  PaymentsInfoContainer,
  ValuesContainer,
  Input,
  Modal,
  ValueInfo,
  Footer,
  ButtonCancel,
  ButtonSave,
  Header,
  Column,
  OnlineIcon,
  Select,
  Option,
  RemoveIcon,
  TefVersionAlertBox,
  TefDownloadLinkIcon,
  TefAlertParagraph,
  TefDownloadLinkButton,
  PixTefEnableSection,
  ValueAmountNegative,
  ValueAmountPositive,
  ValueAmountMuted,
} from "./styles";
import { FlagCard } from "../../models/enums/flagCard";
import { Form, Alert } from "antd";
import { useSale } from "../../hooks/useSale";
import { useSettings } from "../../hooks/useSettings";
import { useTef } from "../../hooks/useTef";
import {
  paymentTypeFromModalTitle,
  wouldUseTefForPaymentAttempt,
} from "../../helpers/tefVersionGuard";
import { PaymentDto } from "../../models/dtos/payment";

interface IProps {
  sale: SaleDto;
  removePayment: (payment: PaymentDto) => Promise<void>;
  addPayment: () => Promise<void>;
  handleOpenPayment: (type: number, title: string, flag_card?: number) => void;
  setCurrentPayment: Dispatch<SetStateAction<number>>;
  setFlagCard?: Dispatch<SetStateAction<number>>;
  flagCard?: number;
  setModalState: Dispatch<SetStateAction<boolean>>;
  modalState: boolean;
  modalTitle: string;
  shouldViewValues?: boolean;
  shouldDisableButtons?: boolean;
  usingDelivery?: boolean;
  loadingPayment?: boolean;
  paymentModalConnect?: boolean;
  selectTef?: string;
  setSelectTef?: Dispatch<SetStateAction<string>>;
  activePaymentType?: number;
}

const PaymentsContainer: React.FC<IProps> = ({
  sale,
  removePayment,
  addPayment,
  setModalState,
  modalState,
  setCurrentPayment,
  handleOpenPayment,
  modalTitle,
  shouldViewValues,
  shouldDisableButtons,
  usingDelivery,
  setFlagCard,
  flagCard,
  loadingPayment,
  paymentModalConnect,
  selectTef,
  setSelectTef,
  activePaymentType,
}) => {
  const { onRemoveDiscount } = useSale();
  const { settings } = useSettings();
  const { tefVersionStatus } = useTef();

  const onModalCancel = (): void => {
    setSelectTef?.("Sim");
    setModalState(false);
    setFlagCard?.(99);
  };

  const getAmount = (amount: number): void => {
    setCurrentPayment(amount);
  };

  const setValue = (event) => {
    setSelectTef(event);
  };

  const buttonsPaymentsStyle = [
    {
      icon: <MoneyIcon />,
      label: "Dinheiro [A]",
      background: "var(--green-400)",
      action: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    },
    {
      icon: <CreditIcon />,
      label: "Crédito [S]",
      background: "var(--blue-300)",
      action: () =>
        handleOpenPayment(PaymentType.CREDITO, "C. Crédito", flagCard),
    },
    {
      icon: <DebitIcon />,
      label: "Débito [D]",
      background: "var(--blue-400)",
      action: () =>
        handleOpenPayment(PaymentType.DEBITO, "C. Débito", flagCard),
    },
    {
      icon: usingDelivery ? <OnlineIcon /> : <TicketIcon />,
      label: usingDelivery ? "Online [O]" : "Ticket [T]",
      background: usingDelivery ? "var(--orange-400)" : "var(--purple-450)",
      action: usingDelivery
        ? () => handleOpenPayment(PaymentType.ONLINE, "Online")
        : () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    },
    {
      icon: <PixIcon src={PixLogo} />,
      label: "Pix [P]",
      background: "var(--teal-400)",
      action: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    },
  ];

  const getChangeAmount = () => {
    if (sale.total_paid + sale.discount > sale.total_sold) {
      const result = (
        sale.total_paid -
        sale.total_sold +
        sale.discount
      ).toFixed(2);
      return result;
    } else {
      return "0";
    }
  };

  const paymentTypeResolved =
    activePaymentType ?? paymentTypeFromModalTitle(modalTitle);

  const wouldRequestTefElectronic = wouldUseTefForPaymentAttempt(
    settings,
    paymentTypeResolved,
    selectTef,
    paymentModalConnect ?? false
  );

  const recommendedMismatch = Boolean(
    tefVersionStatus &&
      !tefVersionStatus.isRequired &&
      tefVersionStatus.currentVersion?.trim() &&
      tefVersionStatus.requiredVersion?.trim() &&
      tefVersionStatus.currentVersion !== tefVersionStatus.requiredVersion
  );

  /* TEMP_TEF_VERSION_GUARD_REMOVE_ME */
  const showRequiredTefAlert =
    modalState &&
    settings?.should_use_tef &&
    tefVersionStatus?.isRequired &&
    wouldRequestTefElectronic;

  const showRecommendedTefAlert =
    modalState &&
    settings?.should_use_tef &&
    recommendedMismatch &&
    modalTitle !== "Dinheiro";

  const blockTefAction =
    Boolean(tefVersionStatus?.isRequired) && wouldRequestTefElectronic;

  const openTefDownload = (): void => {
    const url = tefVersionStatus?.downloadUrl?.trim();
    if (url) {
      window.Main.shell.openExternal(url);
    }
  };

  return (
    <Container>
      <TypesPaymentsContainer>
        {buttonsPaymentsStyle.map((buttonStyle, index) => (
          <PaymentMethodButton
            key={index}
            $background={buttonStyle.background}
            onClick={buttonStyle.action}
            disabled={shouldDisableButtons && !sale?.items?.length}
          >
            {buttonStyle.icon} {buttonStyle.label}
          </PaymentMethodButton>
        ))}
      </TypesPaymentsContainer>

      <PaymentsInfoContainer>
        <Header>
          <Column sm={6}>Forma de Pagamento</Column>
          <Column sm={6}>Bandeira</Column>
          <Column sm={6}>Valor</Column>
          <Column sm={6}>Ação</Column>
        </Header>
        {sale?.payments?.map((payment) => (
          <Payment
            key={payment.id}
            payment={payment}
            removePayment={removePayment}
            loadingPayment={loadingPayment}
          />
        ))}
      </PaymentsInfoContainer>

      {shouldViewValues && (
        <ValuesContainer>
          <ValueInfo>
            R$ Diferença <br />{" "}
            <ValueAmountNegative>
              {(
                sale?.total_paid +
                (sale?.discount + (sale?.customer_nps_reward_discount || 0)) -
                sale?.total_sold -
                +getChangeAmount()
              )
                .toFixed(2)
                .replace(".", ",")}
            </ValueAmountNegative>
          </ValueInfo>
          <ValueInfo>
            R$ Troco
            <br />{" "}
            <ValueAmountNegative>
              {(+getChangeAmount()).toFixed(2).replace(".", ",")}
            </ValueAmountNegative>
          </ValueInfo>
          <ValueInfo>
            R$ Desconto
            <br />{" "}
            <ValueAmountPositive>
              {((sale.customer_nps_reward_discount || 0) + sale?.discount)
                .toFixed(2)
                .replace(".", ",")}
              {sale?.discount > 0 && (
                <RemoveIcon onClick={() => onRemoveDiscount(sale.id)} />
              )}
            </ValueAmountPositive>
          </ValueInfo>
          <ValueInfo>
            R$ Valor Pago <br />{" "}
            <ValueAmountPositive>
              {sale?.total_paid.toFixed(2).replace(".", ",")}
            </ValueAmountPositive>
          </ValueInfo>
          <ValueInfo>
            Quantidade Itens <br />{" "}
            <ValueAmountMuted>{sale?.quantity || 0}</ValueAmountMuted>
          </ValueInfo>
        </ValuesContainer>
      )}

      <Modal
        title={`Pagamento em ${modalTitle}`}
        visible={modalState}
        onCancel={onModalCancel}
        destroyOnClose={true}
        closable={true}
        centered
        afterClose={() => document.getElementById("balanceInput")?.focus()}
        footer={
          <Footer>
            <ButtonCancel onClick={onModalCancel}>Cancelar</ButtonCancel>
            <ButtonSave
              loading={loadingPayment}
              onClick={addPayment}
              disabled={loadingPayment || blockTefAction}
            >
              {settings?.should_use_tef &&
              modalTitle !== "Dinheiro" &&
              selectTef !== "Não" &&
              paymentModalConnect &&
              !(modalTitle === "PIX" && !settings.cnpj_credenciadora)
                ? "Solicitar Pagamento TEF"
                : "Salvar Alteração"}
            </ButtonSave>
          </Footer>
        }
      >
        {(showRequiredTefAlert || showRecommendedTefAlert) && tefVersionStatus && (
          <TefVersionAlertBox>
            <Alert
              type={showRequiredTefAlert ? "error" : "warning"}
              showIcon
              message={
                showRequiredTefAlert
                  ? "Atualização obrigatória do ServerTEF"
                  : "Atualização recomendada do ServerTEF"
              }
              description={
                <Fragment>
                 
                  <TefAlertParagraph>
                    Versão atual: {tefVersionStatus.currentVersion ?? "—"}.
                    Versão necessária: {tefVersionStatus.requiredVersion}.
                  </TefAlertParagraph>
                  <TefAlertParagraph>
                    Após baixar, feche o Gestor, execute{" "}
                    <strong>
                      ServerTEF-Setup-{tefVersionStatus.requiredVersion}
                    </strong>{" "}
                    e abra o aplicativo novamente.
                  </TefAlertParagraph>
                  {showRequiredTefAlert ? (
                    <TefAlertParagraph>
                      Para seguir sem TEF, desative a opção nas configurações.
                      Se não puder instalar, contate o <strong>SAF</strong>.
                    </TefAlertParagraph>
                  ) : (
                    <TefAlertParagraph>
                      Se não puder instalar, contate o <strong>SAF</strong>.
                    </TefAlertParagraph>
                  )}
                  {tefVersionStatus.downloadUrl?.trim() ? (
                    <TefDownloadLinkButton
                      type="link"
                      onClick={openTefDownload}
                    >
                      Baixar instalador
                      <TefDownloadLinkIcon />
                    </TefDownloadLinkButton>
                  ) : null}
                </Fragment>
              }
            />
          </TefVersionAlertBox>
        )}
        Valor:
        <Input
          autoFocus={true}
          getValue={getAmount}
          onEnterPress={addPayment}
          defaultValue={
            modalTitle !== "Dinheiro"
              ? sale?.total_sold -
                sale?.total_paid -
                sale?.discount -
                (sale?.customer_nps_reward_discount || 0)
              : 0
          }
        />
        {(!settings?.should_use_tef || !paymentModalConnect) &&
          (modalTitle === "C. Crédito" || modalTitle === "C. Débito") && (
            <>
              Bandeira:
              <Form.Item>
                <Select
                  placeholder="Escolha a opção"
                  onChange={(value) => setFlagCard(+value)}
                  defaultValue={"Outros"}
                >
                  {FlagCard.map((_flagCard) => (
                    <Option key={_flagCard.id}>{_flagCard.value}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        {settings?.should_use_tef &&
          modalTitle === "PIX" &&
          settings?.cnpj_credenciadora && (
            <PixTefEnableSection>
              Habilitar pagamento TEF
              <Form.Item>
                <Select
                  placeholder="Escolha a opção"
                  onChange={setValue}
                  value={selectTef}
                >
                  <Option key={"Não"}>Não</Option>
                  <Option key={"Sim"}>Sim</Option>
                </Select>
              </Form.Item>
            </PixTefEnableSection>
          )}
      </Modal>
    </Container>
  );
};

export default PaymentsContainer;
