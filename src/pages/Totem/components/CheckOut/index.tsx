import React, { Dispatch, SetStateAction } from "react";

import { SaleDto } from "../../../../models/dtos/sale";

import { Container, Checkbox, Button } from "./styles";
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
      <span>Resumo do Pedido</span>
      <div className="content">
        <div className="info">
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
            <span>{applyCPFMask(sale.client_cpf)}</span>
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setStep(2)}
            >
              {sale.client_cpf ? "TROCAR CPF" : "ADICIONAR CPF"}
            </span>
          </div>
        </div>

        <div className="info">
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
            <span>CLUBE THE BEST</span>
          </div>
          <div className="info-footer">
            <span>PONTOS GANHOS NO CLUBE</span>
            <span>+{getCampaignPointsPlus()}</span>
          </div>
        </div>

        <div className="info">
          <div className="info-header">
            <span>TOTAL DO PEDIDO</span>
          </div>
          <div className="info-footer">
            <span>{sale.items.length} ITENS</span>
            <span>R${sale.total_sold.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>
      <div className="footer">
        <Button onClick={() => setStep(3)}>Voltar</Button>
        <Button onClick={() => setStep(5)}>Concluir Pedido</Button>
      </div>
    </Container>
  );
};

export default CheckOut;
