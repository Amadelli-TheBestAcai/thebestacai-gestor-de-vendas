import React, { useState, useEffect } from "react";

import { cpf as cpfValidator } from "cpf-cnpj-validator";

import { useSale } from "../../hooks/useSale";
import { monetaryFormat } from "../../helpers/monetaryFormat";

import {
  Container,
  MaskInput,
  InfoWrapper,
  Info,
  CampaignInfoWrapper,
  ButtonSave,
  ButtonCancel,
  Footer,
  ContentReward,
  InfoClientReward,
  TitleReward,
  ContentCheck,
  CpfTefContainer,
  ButtonCpfTef,
} from "./styles";
import { message, notification, Checkbox } from "antd";
import { CampaignDto } from "../../models/dtos/campaign";
import { useSettings } from "../../hooks/useSettings";

interface IProps {
  campaign?: CampaignDto;
  getCampaignPointsPlus?: () => number;
}

const ClientInfo: React.FC<IProps> = ({ campaign, getCampaignPointsPlus }) => {
  const { sale, setSale, isSavingSale } = useSale();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const { shouldOpenClientInfo, setShouldOpenClientInfo } = useSale();
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [info, setInfo] = useState({
    cpf: "",
    phone: "",
    email: "",
    cpf_used_club: false,
    cpf_used_nfce: false,
  });

  useEffect(() => {
    if (shouldOpenClientInfo) {
      setInfo({
        cpf: sale.client_cpf || "",
        phone: sale.client_phone || "",
        email: sale.client_email || "",
        cpf_used_club: sale.cpf_used_club ? sale.cpf_used_club : false,
        cpf_used_nfce: sale.cpf_used_nfce ? sale.cpf_used_nfce : false,
      });
    }
  }, [shouldOpenClientInfo]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key.toLowerCase();
    setPressedKey(key);

    if (key === "b" || key === "q") {
      event.preventDefault();

      setInfo((oldValues) => ({
        ...oldValues,
        cpf_used_club:
          key === "b" ? !oldValues.cpf_used_club : oldValues.cpf_used_club,
        cpf_used_nfce:
          key === "q" ? !oldValues.cpf_used_nfce : oldValues.cpf_used_nfce,
      }));
    }
  };

  const validateCPF = () => {
    const cpfValue = info.cpf.replace(/\D/g, "");
    if (cpfValue && !cpfValidator.isValid(cpfValue)) {
      message.error("Digite um CPF válido.");
      return false;
    }
    return true;
  };

  const onFinish = async () => {
    setLoading(true);
    const isValidCPF = validateCPF();
    if (!isValidCPF) {
      setLoading(false);
      return;
    }

    const { has_internal_error, response, error_message } =
      await window.Main.user.getCustomerByCpf(info.cpf);

    if (has_internal_error) {
      setLoading(false);
      return notification.error({
        message: error_message || "Erro ao obter voucher",
        duration: 5,
      });
    }

    setInfo((oldValues) => ({
      ...oldValues,
      email: response?.email,
      phone: response?.cell_number,
      cpf_used_club: true,
      cpf_used_nfce:
        pressedKey === "q" ? !oldValues.cpf_used_nfce : oldValues.cpf_used_nfce,
    }));

    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        client_cpf: info.cpf.replace(/\D/g, ""),
        client_phone: info.phone?.replace(/\D/g, ""),
        client_email: info.email,
        cpf_used_club: info.cpf_used_club,
        cpf_used_nfce: info.cpf_used_nfce,
        client_id: sale.customerVoucher?.customer_id,
      }
    );

    setSale(updatedSale);
    setLoading(false);
    setShouldOpenClientInfo(false);
    document.getElementById("balanceInput").focus();
  };

  const onPressEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading) return;
    if (event.key === "Enter" || event.key === "F1") {
      await onFinish();
    }
  };

  const onChange = async (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (key === "cpf") {
      const length = value.replace(/\D/g, "").length;
      let useInClub = false;
      if (length === 11) {
        console.log("true");
        useInClub = true;
      }
      setInfo((oldValues) => ({
        ...oldValues,
        cpf_used_club: useInClub,
      }));
    }
    setInfo((oldValues) => ({ ...oldValues, [key]: value }));
  };

  const onQuit = async () => {
    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        client_cpf: null,
        client_phone: null,
        client_email: null,
        cpf_used_club: null,
        cpf_used_nfce: null,
        client_id: null,
      }
    );
    setSale(updatedSale);
    document.getElementById("balanceInput").focus();
    setShouldOpenClientInfo(false);
  };

  const tefCpfInsert = async () => {
    if (loading) return;
    setLoading(true);
    const { response, has_internal_error, error_message } =
      await window.Main.tefFactory.getCpf();
    if (response) {
      setInfo((oldValues) => ({
        ...oldValues,
        cpf: response,
        cpf_used_club: true,
      }));
    }
    if (has_internal_error) {
      return notification.error({
        message: error_message || "Erro ao adicionar CPF Tef",
        duration: 5,
      });
    }
    setLoading(false);
  };

  return (
    <Container
      visible={shouldOpenClientInfo}
      confirmLoading={loading}
      closable={false}
      afterClose={() => document.getElementById("balanceInput")?.focus()}
      onCancel={async () => await onQuit()}
      destroyOnClose
      footer={
        <Footer>
          <ButtonCancel onClick={async () => await onQuit()}>
            Cancelar
          </ButtonCancel>
          <ButtonSave
            onClick={async () => {
              if (loading) return;
              await onFinish();
            }}
            disabled={isSavingSale || loading}
            style={{
              background:
                isSavingSale || loading ? "#ff9d0a63" : "var(--orange-250)",
            }}
          >
            Salvar
          </ButtonSave>
        </Footer>
      }
    >
      <InfoWrapper>
        <Info>CPF:</Info>
        {settings.should_request_cpf_in_tef ? (
          <CpfTefContainer>
            <MaskInput
              id="user-cpf"
              mask={"999.999.999.99"}
              maskChar={"_"}
              autoFocus
              value={info.cpf}
              disabled
              style={{ width: "70%" }}
            />
            <ButtonCpfTef onClick={() => tefCpfInsert()} disabled={loading}>
              Solicitar CPF Tef
            </ButtonCpfTef>
          </CpfTefContainer>
        ) : (
          <MaskInput
            id="user-cpf"
            mask={"999.999.999.99"}
            maskChar={"_"}
            onKeyPress={onPressEnter}
            autoFocus
            value={info.cpf}
            onChange={(event) => onChange("cpf", event)}
            onKeyDown={onKeyDown}
          />
        )}
        <ContentCheck>
          <div>
            <Checkbox
              disabled={loading}
              checked={info.cpf_used_club}
              onChange={() =>
                setInfo((oldValues) => ({
                  ...oldValues,
                  cpf_used_club: !oldValues.cpf_used_club,
                }))
              }
            />
            <span>Clube The Best [B]</span>
          </div>

          <div>
            <Checkbox
              disabled={loading}
              checked={info.cpf_used_nfce}
              onChange={() =>
                setInfo((oldValues) => ({
                  ...oldValues,
                  cpf_used_nfce: !oldValues.cpf_used_nfce,
                }))
              }
            />
            <span>Habilitar CPF na Nota Fiscal [Q]</span>
          </div>
        </ContentCheck>
      </InfoWrapper>
      <CampaignInfoWrapper>
        {campaign && (
          <ContentReward>
            <InfoClientReward className="borderedInfoClient">
              <TitleReward>Com mais</TitleReward>

              <span>R$ {monetaryFormat(getCampaignPointsPlus())} </span>

              <TitleReward>você ganha +1 ponto</TitleReward>

              <div className="totalPoints">
                Pontos ganhos nessa compra:{" "}
                {Math.floor(sale.total_sold / campaign.average_ticket)}
              </div>
            </InfoClientReward>
          </ContentReward>
        )}
      </CampaignInfoWrapper>
    </Container>
  );
};

export default ClientInfo;
