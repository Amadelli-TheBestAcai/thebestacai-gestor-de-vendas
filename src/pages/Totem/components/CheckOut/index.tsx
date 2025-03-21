import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import cupom from "../../../../assets/totem/svg/cupom.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";
import totem_club_flag from "../../../../assets/totem/img/totem_club_flag.png";

import { applyCPFMask } from "../../helpers/applyCPFMask";

import { useSale } from "../../../../hooks/useSale";
import { useSettings } from "../../../../hooks/useSettings";

import { ItemDto } from "../../../../models/dtos/item";
import { CampaignDto } from "../../../../models/dtos/campaign";
import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import ModalCupomInfo from "../ModalCupomInfo";
import ModalSaleCancel from "../ModalSaleCancel";
import ModalItensOffer from "../ModalItensOffer";
import ModalRemoveCupom from "../ModalRemoveCupom";
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
  ButtonCupom,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  campaign: CampaignDto | null;
  cancelSale: () => void;
  stepChange: (step: number) => void;
  storeProducts: StoreProductDto[];
  handleIncrement: () => void;
}

const CheckOut: React.FC<IProps> = ({
  campaign,
  setStep,
  cancelSale,
  stepChange,
  storeProducts,
  handleIncrement,
}) => {
  const { sale, setSale, onAddItem, onDecressItem } = useSale();
  const { settings } = useSettings();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalOffer, setVisibleModalOffer] = useState<boolean>(false);
  const [visibleModalInfoCupom, setVisibleModalInfoCupom] =
    useState<boolean>(false);
  const [visibleModalRemoveCupom, setVisibleModalRemoveCupom] =
    useState<boolean>(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    discountUpdate();
  }, [sale]);

  useEffect(() => {
    const totalSale = sale?.items?.reduce(
      (total, _item) => total + _item?.total,
      0
    );

    let points = campaign?.average_ticket
      ? Math.floor(totalSale / campaign?.average_ticket)
      : 0;
    setTotalPoints(points);
  }, [sale]);

  useEffect(() => {
    const discountSaleUpdate = async () => {
      const { response: updatedSale } = await window.Main.sale.updateSale(
        sale.id,
        {
          ...sale,
          discount: sale.discount ? discount : sale.discount,
        }
      );
      setSale(updatedSale);
    };
    discountSaleUpdate();
  }, [discount]);

  const discountUpdate = async () => {
    const totalSale = sale?.items?.reduce(
      (total, _item) => total + _item?.total,
      0
    );

    setDiscount(+(totalSale * 0.1 || 0)?.toFixed(2));
  };

  const shopkeeperDiscountAdd = async () => {
    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        discount: sale.discount ? 0 : discount,
      }
    );
    setSale(updatedSale);
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

  const addItemList = async (item: ItemDto) => {
    if (sale.customerVoucher) {
      setVisibleModalInfoCupom(true);
      return;
    }
    const findProduct = storeProducts.find(
      (_product) => +_product.id === +item.store_product_id
    );
    onAddItem(findProduct, 1, +findProduct.price_unit);
    discountUpdate();
  };

  const onDecressItemList = async (
    item: ItemDto,
    totemNotification: boolean
  ) => {
    if (sale.customerVoucher) {
      setVisibleModalInfoCupom(true);
      return;
    }
    await onDecressItem(item.id, totemNotification);
    discountUpdate();
  };

  const removeAllItems = async (item: ItemDto): Promise<void> => {
    if (sale.customerVoucher) {
      setVisibleModalInfoCupom(true);
      return;
    }
    for (let i = 0; i < item.quantity; i++) {
      await onDecressItem(item.id, true);
    }
    discountUpdate();
  };

  const offerItem = async () => {
    const findItem = sale?.items?.every(
      (_item) =>
        !_item?.product?.category?.name?.toLowerCase()?.includes("bebida")
    );
    if (findItem) {
      setVisibleModalOffer(true);
    } else {
      stepChange(5);
    }
  };

  return (
    <>
      <Header>
        <div className="div-img">
          <img src={totem_club_flag} onClick={handleIncrement} />
        </div>
        <div className="div-title">
          <span>Resumo do Pedido</span>
        </div>
      </Header>
      <Container>
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
                {sale.client_cpf
                  ? applyCPFMask(sale.client_cpf, true)
                  : "NENHUM CPF/CNPJ "}
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
                <span>Você está deixando de pontuar no clube!</span>
              )}

              <span style={{ fontWeight: "800" }}>+{totalPoints}</span>
            </div>
          </ClubInfo>
          {settings.should_active_discount_storekeeper && (
            <ClubInfo style={{ height: "6rem" }}>
              <div className="info-header">
                <Checkbox
                  checked={sale.discount ? true : false}
                  onChange={() => shopkeeperDiscountAdd()}
                />
                <span>Sou Lojista</span>
              </div>
            </ClubInfo>
          )}

          <OrderInfo style={{ height: "36rem", justifyContent: "flex-start" }}>
            <div className="info-header">
              <span>ITENS</span>
              <ButtonCupom
                onClick={() => setStep(4.5)}
                disabled={!!sale.customerVoucher}
              >
                <img src={cupom} /> Adicionar cupom
              </ButtonCupom>
            </div>
            <OrderProductList
              useCupom={true}
              useDiscount={!!sale.discount}
              addItemList={addItemList}
              onDecressItemList={onDecressItemList}
              removeAllItems={removeAllItems}
              setVisibleModalRemoveCupom={setVisibleModalRemoveCupom}
            />
          </OrderInfo>
          <OrderInfo>
            <div>
              <span>TOTAL DO PEDIDO</span>
            </div>

            <div className="info-footer">
              <span>{sale.items.length === 1 ? "ITEM" : "ITENS"}</span>
              <span style={{ fontWeight: "800" }}>
                R$
                {(sale?.total_sold - sale?.discount)
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </div>
          </OrderInfo>
        </Body>
        <Footer>
          <div style={{ justifyContent: "space-between" }}>
            <Button
              onClick={() =>
                sale.customerVoucher
                  ? setVisibleModalInfoCupom(true)
                  : setStep(3)
              }
            >
              {" "}
              <img src={arrow_left} />
              Voltar
            </Button>
            <ButtonFinalize
              onClick={() =>
                !sale.customerVoucher ? offerItem() : stepChange(5)
              }
              disabled={!sale?.items?.length}
            >
              Avançar
            </ButtonFinalize>
          </div>
          <Button onClick={() => setVisibleModal(true)}>Cancelar Pedido</Button>
        </Footer>
      </Container>
      <ModalSaleCancel
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
      <ModalRemoveCupom
        visible={visibleModalRemoveCupom}
        setVisible={setVisibleModalRemoveCupom}
      />
      <ModalCupomInfo
        visible={visibleModalInfoCupom}
        setVisible={setVisibleModalInfoCupom}
      />
    </>
  );
};

export default CheckOut;
