import React from "react";

import { Container, Column, Description } from "./styles";

import { currencyFormater } from "../../helpers/currencyFormater";

import { AppSale as AppSaleModel } from "../../models/appSales";

const AppSale: React.FC<AppSaleModel> = (props) => {
  const {
    codigo_pedido,
    valor_pedido,
    valor_produtos,
    valor_entrega,
    data_pedido,
    data_conclusao,
  } = props;
  return (
    <Container>
      <Column span={2}>
        <Description>{codigo_pedido}</Description>
      </Column>
      <Column span={4}>
        <Description>{currencyFormater(+valor_pedido)}R$</Description>
      </Column>
      <Column span={4}>
        <Description>{currencyFormater(+valor_produtos)}R$</Description>
      </Column>
      <Column span={4}>
        <Description>{currencyFormater(+valor_entrega)}R$</Description>
      </Column>
      <Column span={5}>
        <Description>{data_pedido.replace(/-/g, "/")}</Description>
      </Column>
      <Column span={5}>
        <Description>{data_conclusao.replace(/-/g, "/")}</Description>
      </Column>
    </Container>
  );
};

export default AppSale;
