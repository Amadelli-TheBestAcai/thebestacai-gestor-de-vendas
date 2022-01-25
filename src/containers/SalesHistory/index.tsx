import React, { useState } from "react";

import {
  Container,
  ActionTypeList,
  ListIcon,
  GridIcon,
  ListContainer,
  CardSale,
  Col,
} from "./styles";

const SalesHistory: React.FC = () => {
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
              <Col sm={5}>
                <span>4178771</span>
              </Col>
              <Col sm={5}>R$ 67,50</Col>
              <Col sm={5}>2</Col>
              <Col sm={4}>08:36:10</Col>
              <Col sm={5}>Loja</Col>
            </>
          ) : (
            <Col sm={24}>
              Horário:<span>08:36:10</span>
            </Col>
          )}
        </CardSale>
      </ListContainer>
    </Container>
  );
};

export default SalesHistory;
