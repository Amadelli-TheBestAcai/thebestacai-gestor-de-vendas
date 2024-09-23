import React, { Dispatch, SetStateAction, useState } from "react";

import { applyCPFMask } from "../../helpers/applyCPFMask";

import { useSale } from "../../../../hooks/useSale";

import { CampaignDto } from "../../../../models/dtos/campaign";

import ModalInfo from "../ModalInfo";

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
  OrderProductList,
  OrderProduct,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  campaign: CampaignDto | null;
  cancelSale: () => void;
  stepChange: (step: number) => void;
}

const CheckOut: React.FC<IProps> = ({ campaign, setStep, cancelSale, stepChange }) => {
  const { sale, setSale } = useSale();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

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
    <>
      <Container>
        <Header>
          <span>Resumo do Pedido</span>
        </Header>
        <Body>
          <CpfInfo>
            <div className="info-header">
              {sale.client_cpf && (
                <Checkbox
                  disabled={!sale.client_cpf}
                  checked={sale.cpf_used_nfce}
                  onChange={() =>
                    updateCheck("cpf_used_nfce", !sale.cpf_used_nfce)
                  }
                />
              )}
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
              {sale.client_cpf && (
                <Checkbox
                  disabled={!sale.client_cpf}
                  checked={sale.cpf_used_club}
                  onChange={() =>
                    updateCheck("cpf_used_club", !sale.cpf_used_club)
                  }
                />
              )}

              <span>Clube The Best</span>
            </div>
            <div className="info-footer">
              {sale.client_cpf ? (
                <span>PONTOS GANHOS NO CLUBE</span>
              ) : (
                <span>Adicione seu CPF para ganhar pontos!</span>
              )}

              {sale.client_cpf && (
                <span style={{ fontWeight: "800" }}>
                  +{getCampaignPointsPlus()}
                </span>
              )}
            </div>
          </ClubInfo>

          <OrderInfo style={{ height: "36rem", justifyContent: "flex-start" }}>
            <div className="info-header">
              <span>ITENS</span>
            </div>
            <OrderProductList>
              {sale.items
                .map((item) => (
                  <OrderProduct key={item.id} sm={24}>
                    <div className="order-item-content">
                      <div className="order-item-info">
                        <span className="order-item-name">
                          {item.product.category.id === 1
                            ? `${item.quantity * 1000}g`
                            : `${item.quantity} x`}
                        </span>
                        <span className="order-item-name">
                          {item.product.name}
                        </span>
                      </div>
                    </div>
                    <div className="order-item-price">
                      <span>R$ {item.total?.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </OrderProduct>
                ))
                .reverse()}
            </OrderProductList>
          </OrderInfo>
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
            <ButtonFinalize onClick={() => stepChange(5)}>
              Avançar
            </ButtonFinalize>
          </div>
          <Button onClick={() => setVisibleModal(true)}>Cancelar Pedido</Button>
        </Footer>
      </Container>
      <ModalInfo
        visible={visibleModal}
        setVisible={setVisibleModal}
        cancelSale={cancelSale}
      />
    </>
  );
};

export default CheckOut;
