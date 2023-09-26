import React, { useState, useEffect } from "react";
import { notification } from "antd";

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
import { useSale } from "../../hooks/useSale";
import { monetaryFormat } from "../../helpers/monetaryFormat";

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

      const fetchCampaign = async () => {
        const { response } = await window.Main.sale.getCurrentCampaign();
        if (response) {
          setCampaign(response);
        }
        console.log(response, 'ana teste de response')
      };

      if (!campaign) {
        fetchCampaign();
      }

    }
  }, [shouldOpenClientInfo, campaign, setCampaign]);

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

  return (
    <Container
      visible={shouldOpenClientInfo}
      confirmLoading={loading}
      closable={false}
      onCancel={() => setShouldOpenClientInfo(false)}
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
            disabled={
              info.phone.trim() === "" ||
              info.email.trim() === "" ||
              info.cpf.trim() === ""
            }
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
          <span>
            Nenhuma campanha carregada. Para insights de venda sobre a camapanha
            click no botão acima.
          </span>
        )}
        {campaign && (
          <ContentReward>
            <InfoClientReward className="borderedInfoClient">
              <TitleReward>
                Com mais
              </TitleReward>

              <span>
                R${" "}{monetaryFormat(campaign.average_ticket -
                  (sale?.total_sold - (sale.customer_nps_reward_discount || 0) - sale?.discount))}{" "}
              </span>

              <TitleReward>
                você ganha +1 ponto
              </TitleReward>
            </InfoClientReward>

            {/* <InfoClientReward>
              <TitleReward>
                Total da compra
              </TitleReward>
              <span>
                R${" "}
                {monetaryFormat(
                  sale?.total_sold -
                  +(sale.customer_nps_reward_discount || 0) -
                  sale?.discount
                )}
              </span>
            </InfoClientReward> */}
          </ContentReward>
        )}

      </CampaignInfoWrapper>
    </Container>
  );
};

export default ClientInfo;
