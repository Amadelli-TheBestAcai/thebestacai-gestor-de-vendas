import React, { Dispatch, SetStateAction } from "react";

import { SaleDto } from "../../../../models/dtos/sale";

import {
  Container,
  Checkbox,
  Button,
  Body,
  Header,
  Footer,
  CpfInfo,
  ClubInfo,
  OrderInfo,
  ButtonFinalize,
} from "./styles";
import { CampaignDto } from "../../../../models/dtos/campaign";
import { applyCPFMask } from "../../helpers/applyCPFMask";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  campaign: CampaignDto | null;
  sale: SaleDto | null;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
}

const CheckOut: React.FC<IProps> = ({ sale, campaign, setStep, setSale }) => {
  const getCampaignPointsPlus = () => {
    let points = Math.floor(sale.total_sold / campaign.average_ticket);

    return points;
  };

  return (
    <Container>
      <Header>
        <span>Resumo do Pedido</span>
      </Header>
      <Body>
        <CpfInfo>
          <div className="info-header">
            <Checkbox
              disabled={!sale.client_cpf}
              checked={sale.cpf_used_nfce}
              onChange={() =>
                setSale((oldValues) => ({
                  ...oldValues,
                  cpf_used_nfce: !sale.cpf_used_nfce,
                }))
              }
            />
            <span>CPF/CNPJ NA NOTA?</span>
          </div>
          <div className="info-footer">
            <span className="info-footer-cpf">
              {applyCPFMask(sale.client_cpf, true)}
            </span>
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setStep(2)}
            >
              {sale.client_cpf ? "TROCAR CPF" : "ADICIONAR CPF"}
            </span>
          </div>
        </CpfInfo>

        <ClubInfo>
          <div className="info-header">
            <Checkbox
              disabled={!sale.client_cpf}
              checked={sale.cpf_used_club}
              onChange={() =>
                setSale((oldValues) => ({
                  ...oldValues,
                  cpf_used_club: !sale.cpf_used_club,
                }))
              }
            />
            <span>Clube The Best</span>
          </div>
          <div className="info-footer">
            <span>PONTOS GANHOS NO CLUBE</span>
            <span style={{ fontWeight: "800" }}>
              +{getCampaignPointsPlus()}
            </span>
          </div>
        </ClubInfo>

        <OrderInfo>
          <div className="info-header">
            <span>TOTAL DO PEDIDO</span>
          </div>
          <div className="info-footer">
            <span>{sale.items.length} ITENS</span>
            <span style={{ fontWeight: "800" }}>R${sale.total_sold.toFixed(2).replace(".", ",")}</span>
          </div>
        </OrderInfo>
      </Body>
      <Footer>
        <Button onClick={() => setStep(3)}>Voltar</Button>
        <ButtonFinalize onClick={() => setStep(5)}>Concluir Pedido</ButtonFinalize>
      </Footer>
    </Container>
  );
};

export default CheckOut;
