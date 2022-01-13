import React, { SetStateAction, Dispatch, useState } from "react";
// import { ipcRenderer } from "electron";
import currentUser from "../../helpers/currentUser";

import { SaleDto } from "../../models/dtos/sale";
import { PaymentType } from "../../models/enums/paymentType";
import { Modal } from "antd";
import NfeForm from "../../containers/NfeForm";
import {
  Container,
  Row,
  Col,
  Description,
  Panel,
  RemoveIcon,
  ColHeader,
  PrinterIcon,
  NfceIcon,
} from "./styles";
import moment from "moment";

type IProps = {
  sale: SaleDto;
  onDelete?: (id: string) => void;
  setShouldSearch: Dispatch<SetStateAction<boolean>>;
};

const Sale: React.FC<IProps> = ({ sale, onDelete, setShouldSearch }) => {
  const [nfceModal, setNfceModal] = useState(false);
  const {
    id,
    type,
    total_sold,
    created_at,
    quantity,
    change_amount,
    discount,
    items,
    payments,
  } = sale;
  const time = moment(created_at).format("HH:mm:ss");
  const getType = (type: number): string => {
    if (type === 0) return "Loja";
    if (type === 1) return "IFOOD";
    if (type === 2) return "UBBEREATS";
    if (type === 3) return "WHATSAPP";
    if (type === 4) return "TELEFONE";
    if (type === 5) return "APP";
  };

  const onPrinter = () => {
    Modal.confirm({
      title: "Imprimir Venda",
      content: "Gostaria de prosseguir e imprir esta venda?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      async onOk() {
        const formatedItems = sale.items.map((item) => ({
          category_id: +item.product.category.id,
          name: item.product.name,
          quantity: +item.quantity,
          price_unit: +item.storeProduct.price_unit,
        }));

        const total = formatedItems.reduce(
          (total, item) =>
            total + +(item.quantity || 0) * +(item.price_unit || 0),
          0
        );

        const formatedSale = {
          id: sale.id,
          items: formatedItems,
          nfce_url: sale.nfce_url,
          total,
        };
        // ipcRenderer.send("sale:print", formatedSale);
      },
    });
  };

  const getTotalSold = (sale: SaleDto) => {
    return (
      sale.payments.reduce((total, payment) => total + +payment.amount, 0) -
      +sale.discount -
      +sale.change_amount
    )
      .toFixed(2)
      .replace(".", ",");
  };
  return (
    <Container>
      <Panel
        header={
          <Row>
            <ColHeader span={4}>{id}</ColHeader>
            <ColHeader span={4}>{getTotalSold(sale)}R$</ColHeader>
            <ColHeader span={4}>{quantity}</ColHeader>
            <ColHeader span={4}>{time}</ColHeader>
            <ColHeader span={4}>{getType(type)}</ColHeader>
            <ColHeader span={4}>
              <PrinterIcon onClick={() => onPrinter()} />
              {currentUser.hasPermission("sales.remove_sale") && (
                <RemoveIcon onClick={() => onDelete(id)} />
              )}
              {currentUser.hasPermission("sales.emit_nfce") &&
                !sale.nfce_id && (
                  <NfceIcon onClick={() => setNfceModal(true)} />
                )}
            </ColHeader>
          </Row>
        }
        key={id}
      >
        <Row>
          <Col span={4}>
            <Description>Troco: </Description>{" "}
            {(+change_amount).toFixed(2).replace(".", ",")}
            R$
          </Col>
          <Col span={4}>
            <Description>Desconto: </Description>{" "}
            {(+discount).toFixed(2).replace(".", ",")}
            R$
          </Col>
        </Row>
        {items?.length > 0 && (
          <Container>
            <Panel header="Itens" key="itens">
              {items.map((item) => (
                <Row key={item?.id}>
                  <Col span={12}>{item.product?.name}</Col>
                  <Col span={12}>
                    <Description>Quantidade: </Description>{" "}
                    {item?.quantity?.toString().replace(".", ",")}
                  </Col>
                </Row>
              ))}
            </Panel>
          </Container>
        )}
        <Container>
          <Panel header="Pagamentos" key="payments">
            {payments?.map(({ id, amount, type }) => (
              <Row key={id}>
                <Col span={12}>{PaymentType[type]}</Col>
                <Col span={12}>
                  <Description>Valor: </Description>{" "}
                  {(+amount).toFixed(2).replace(".", ",")}R$
                </Col>
              </Row>
            ))}
          </Panel>
        </Container>
      </Panel>
      <NfeForm
        setShouldSearch={setShouldSearch}
        modalState={nfceModal}
        setModalState={setNfceModal}
        sale={sale}
      />
    </Container>
  );
};

export default Sale;
