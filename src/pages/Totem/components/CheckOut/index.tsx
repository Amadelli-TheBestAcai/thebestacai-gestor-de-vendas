import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { applyCPFMask } from "../../helpers/applyCPFMask";

import { useSale } from "../../../../hooks/useSale";

import { CampaignDto } from "../../../../models/dtos/campaign";
import { StoreProductDto } from "../../../../models/dtos/storeProduct";
import { ItemDto } from "../../../../models/dtos/item";

import ModalInfo from "../ModalInfo";
import ModalItensOffer from "../ModalItensOffer";
import OrderProductList from "../OrderProductList";

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
  cancelSale: () => void;
  stepChange: (step: number) => void;
  storeProducts: StoreProductDto[];
}

const CheckOut: React.FC<IProps> = ({
  campaign,
  setStep,
  cancelSale,
  stepChange,
  storeProducts,
}) => {
  const { sale, setSale, onAddItem, onDecressItem } = useSale();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalOffer, setVisibleModalOffer] = useState<boolean>(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    let points = campaign?.average_ticket
      ? Math.floor(sale?.total_sold / campaign?.average_ticket)
      : 0;
    setTotalPoints(points);
  }, [sale]);

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

  const addItemList = async (item: ItemDto) => {
    const findProduct = storeProducts.find(
      (_product) => +_product.id === +item.store_product_id
    );
    onAddItem(findProduct, 1, +findProduct.price_unit);
  };

  const removeAllItems = async (item: ItemDto): Promise<void> => {
    for (let i = 0; i < item.quantity; i++) {
      await onDecressItem(item.id, true);
    }
  };

  const offerItem = async () =>{
    const findItem = sale?.items?.every((_item) => !_item?.product?.category?.name?.toLowerCase()?.includes("bebida"));
    if(findItem){
      setVisibleModalOffer(true);
    }else{
      stepChange(5)
    }
  }

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
                <span style={{ fontWeight: "800" }}>+{totalPoints}</span>
              )}
            </div>
          </ClubInfo>

          <OrderInfo style={{ height: "36rem", justifyContent: "flex-start" }}>
            <div className="info-header">
              <span>ITENS</span>
            </div>
            <OrderProductList
              addItemList={addItemList}
              onDecressItem={onDecressItem}
              removeAllItems={removeAllItems}
            />
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
            <ButtonFinalize
              onClick={() => offerItem()}
              disabled={!sale?.items?.length}
            >
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
      <ModalItensOffer
        visible={visibleModalOffer}
        setVisible={setVisibleModalOffer}
        stepChange={stepChange}
        storeProducts={storeProducts}
      />
    </>
  );
};

export default CheckOut;
