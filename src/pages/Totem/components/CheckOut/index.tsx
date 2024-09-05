import React, { Dispatch, SetStateAction } from "react";

import { applyCPFMask } from "../../helpers/applyCPFMask";

import { useSale } from "../../../../hooks/useSale";

import { CampaignDto } from "../../../../models/dtos/campaign";

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

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  campaign: CampaignDto | null;
}

const CheckOut: React.FC<IProps> = ({ campaign, setStep }) => {
  const { sale, setSale } = useSale();
  const getCampaignPointsPlus = () => {
    let points = campaign?.average_ticket
      ? Math.floor(sale?.total_sold / campaign?.average_ticket)
      : 0;

    return points;
  };

  const updateCheck = async (name: string, check: boolean) => {
    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        [name]: check,
      }
    );
    setSale(updatedSale);
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
              onChange={() => updateCheck("cpf_used_nfce", !sale.cpf_used_nfce)}
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
              onChange={() => updateCheck("cpf_used_club", !sale.cpf_used_club)}
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
            <span style={{ fontWeight: "800" }}>
              R${sale.total_sold.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </OrderInfo>
      </Body>
      <Footer>
        <div style={{ justifyContent: "space-between" }}>
          <Button onClick={() => setStep(3)}>Voltar</Button>
          <ButtonFinalize onClick={() => setStep(5)}>
            Concluir Pedido
          </ButtonFinalize>
        </div>
        <Button onClick={() => setStep(1)}>Cancelar Pedido</Button>
      </Footer>
    </Container>
  );
};

export default CheckOut;
