import React, { useState } from "react";
import { SaleDto } from "../../models/dtos/sale";
import { currencyFormater } from "../../helpers/currencyFormater";
import {
  Container,
  ActionTypeList,
  ListIcon,
  GridIcon,
  ListContainer,
  CardSale,
  Col,
} from "./styles";

interface IProps {
  sales: SaleDto[];
}
const SalesHistory: React.FC<IProps> = ({ sales }) => {
  const [listView, setListView] = useState<boolean>(false);

  return (
    <Container>
      <header>
        <h3>Histórico de vendas</h3>
        <ActionTypeList>
          <GridIcon onClick={() => setListView(false)} listView={listView} />
          <ListIcon onClick={() => setListView(true)} listView={listView} />
        </ActionTypeList>
      </header>
      <ListContainer listView={listView}>
        <CardSale>
          {listView ? (
            <>
              {sales.map((sale, index) => (
                <React.Fragment key={index}>
                  <Col sm={5}>
                    <span>{index + 1}</span>
                  </Col>
                  <Col sm={5}>R$ {currencyFormater(sale.total_sold)}</Col>
                  <Col sm={5}>{sale.quantity}</Col>
                  <Col sm={4}>{sale.created_at}</Col>
                  <Col sm={5}>{sale.type}</Col>
                </React.Fragment>
              ))}
            </>
          ) : (
            <Col sm={24}>
              {sales.map((sale, index) => (
                <React.Fragment key={index}>
                  Horário:<span>{sale.created_at.split(" ")[1]}</span>
                </React.Fragment>
              ))}
            </Col>
          )}
        </CardSale>
      </ListContainer>
    </Container>
  );
};

export default SalesHistory;
