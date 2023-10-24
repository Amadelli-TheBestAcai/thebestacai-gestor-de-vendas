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
} from "./styles";
import { message, notification } from "antd";
import { CampaignDto } from "../../models/dtos/campaign";

interface IProps {
  campaign?: CampaignDto;
  getCampaignPointsPlus?: () => number;
}

const ClientInfo: React.FC<IProps> = ({
  campaign,
  getCampaignPointsPlus
}) => {
  const {
    sale,
    setSale,
    isSavingSale,
  } = useSale();
  const [loading, setLoading] = useState(false);
  const { shouldOpenClientInfo, setShouldOpenClientInfo } = useSale();
  const [info, setInfo] = useState({
    cpf: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (shouldOpenClientInfo) {
      setInfo({
        cpf: sale.client_cpf || "",
        phone: sale.client_phone || "",
        email: sale.client_email || "",
      });
    }

  }, [shouldOpenClientInfo]);


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

    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        client_cpf: info.cpf.replace(/\D/g, ""),
        client_phone: info.phone?.replace(/\D/g, ""),
        client_email: info.email,
      }
    );
    setSale(updatedSale);
    setLoading(false);
    setShouldOpenClientInfo(false);
    document.getElementById("mainContainer").focus()
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
    setInfo((oldValues) => ({ ...oldValues, [key]: value }));

    if (key === "cpf") {
      if (value.replace(/\D/g, "").length === 11) {
        setLoading(true);
        const { has_internal_error, response, error_message } =
          await window.Main.user.getCustomerByCpf(value.replace(/\D/g, ""));

        if (has_internal_error) {
          return notification.error({
            message: error_message || "Erro ao obter voucher",
            duration: 5,
          });
        }

        setInfo({
          cpf: value.replace(/\D/g, ""),
          email: response?.email,
          phone: response?.cell_number,
        });

        setLoading(false);
      }
    }
  };

  const onQuit = async () => {
    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        client_cpf: null,
        client_phone: null,
        client_email: null,
      }
    );
    setSale(updatedSale);
    document.getElementById("mainContainer").focus()
    setShouldOpenClientInfo(false)
  }

  return (
    <Container
      visible={shouldOpenClientInfo}
      confirmLoading={loading}
      closable={false}
      onCancel={async () => await onQuit()}
      destroyOnClose
      footer={
        <Footer>
          <ButtonCancel
            onClick={async () => await onQuit()}
          >
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
        <MaskInput
          id="user-cpf"
          mask={"999.999.999.99"}
          maskChar={"_"}
          onKeyPress={onPressEnter}
          autoFocus
          value={info.cpf}
          onChange={(event) => onChange("cpf", event)}
        />
      </InfoWrapper>
      {/* <InfoWrapper>
        <Info>Telefone:</Info>
        <MaskInput
          mask={"(99) 99999-9999"}
          maskChar={"_"}
          onKeyPress={onPressEnter}
          value={info.phone}
          onChange={(event) => onChange("phone", event)}
        />
      </InfoWrapper>
      <InfoWrapper>
        <Info>Email:</Info>
        <MaskInput
          onKeyPress={onPressEnter}
          value={info.email}
          onChange={(event) => onChange("email", event)}
        />
      </InfoWrapper> */}
      <CampaignInfoWrapper>
        {campaign && (
          <ContentReward>
            <InfoClientReward className="borderedInfoClient">
              <TitleReward>Com mais</TitleReward>

              <span>R$ {monetaryFormat(getCampaignPointsPlus())} </span>

              <TitleReward>você ganha +1 ponto</TitleReward>

              <div className="totalPoints">Pontos ganhos nessa compra: {Math.floor(
                sale.total_sold / campaign.average_ticket,
              )}</div>
            </InfoClientReward>
          </ContentReward>
        )}
      </CampaignInfoWrapper>
    </Container>
  );
};

export default ClientInfo;
