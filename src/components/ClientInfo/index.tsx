import React, { useState, useEffect } from "react";
import { notification } from "antd";

import {
  Container,
  MaskInput,
  InfoWrapper,
  Info,
  FetchButtonWrapper,
  Button,
  CampaignInfoWrapper,
  ButtonSave,
  ButtonCancel,
  Footer,
} from "./styles";
import { useSale } from "../../hooks/useSale";

interface IProps { }

const ClientInfo: React.FC<IProps> = () => {
  const {
    sale,
    setSale,
    shouldOpenClientInfo,
    setShouldOpenClientInfo,
    onRegisterSale,
    campaign,
    setCampaign,
  } = useSale();
  const [loading, setLoading] = useState(false);
  const [fetchingLastCampaign, setFetchingLastCampaign] = useState(false);
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

  useEffect(() => {
    const fetchCampaign = async () => {
      const { response } = await window.Main.sale.getCurrentCampaign();
      if (response) {
        setCampaign(response);
      }
    };
    if (!campaign) {
      fetchCampaign();
    }
  }, [campaign]);

  const onFinish = async () => {
    setLoading(true);
    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        client_cpf: info.cpf.replace(/\D/g, ""),
        client_phone: info.phone.replace(/\D/g, ""),
        client_email: info.email,
      }
    );
    setSale(updatedSale);
    await onRegisterSale();
    setLoading(false);
    setShouldOpenClientInfo(false);
  };

  const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onFinish();
    }
  };

  const onChange = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInfo((oldValues) => ({ ...oldValues, [key]: value }));
  };

  const onFetchLastCampaign = async () => {
    setFetchingLastCampaign(true);
    const { has_internal_error, error_message, response } =
      await window.Main.sale.getCurrentCampaign();
    if (has_internal_error) {
      return notification.error({
        message: error_message || "Oops, ocorreu um erro ao obter campanha",
        duration: 5,
      });
    }

    setCampaign(response);

    setFetchingLastCampaign(false);
  };

  return (
    <Container
      visible={shouldOpenClientInfo}
      confirmLoading={loading}
      closable={false}
      destroyOnClose
      footer={
        <Footer>
          <ButtonCancel
            onClick={() => {
              setShouldOpenClientInfo(false);
            }}
          >
            Cancelar
          </ButtonCancel>
          <ButtonSave
            onClick={onFinish}
            disabled={info.phone.trim() === '' || info.email.trim() === '' || info.cpf.trim() === ''}
          >
            Salvar
          </ButtonSave>
        </Footer>
      }
    >
      <FetchButtonWrapper>
        <Button onClick={onFetchLastCampaign} loading={fetchingLastCampaign}>
          Buscar última campanha
        </Button>
      </FetchButtonWrapper>
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
      <InfoWrapper>
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
      </InfoWrapper>
      <CampaignInfoWrapper>
        {!campaign && (
          <>
            Nenhuma campanha carregada. Para insights de venda sobre a camapanha
            click no botão acima.
          </>
        )}
        {/* {!campaign?.actived && <>Nenhuma campanha ativa no momento</>} */}
        {campaign && <>Campanha carregada, exibir insights</>}
      </CampaignInfoWrapper>
    </Container>
  );
};

export default ClientInfo;
