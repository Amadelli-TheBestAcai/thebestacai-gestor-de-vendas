import React, { useState, Dispatch, SetStateAction } from "react";
import { SaleFromApi } from "../../models/dtos/salesFromApi";
import { currencyFormater } from "../../helpers/currencyFormater";
import { SalesTypes } from "../../models/enums/salesTypes";
import moment from "moment";
import {
  Container,
  ActionTypeList,
  ListIcon,
  GridIcon,
  ListContainer,
  CardSale,
  Col,
} from "./styles";
import { Row } from "antd";

interface IProps {
  sales: SaleFromApi[];
  selectedSale: SaleFromApi;
  setSelectedSale: Dispatch<SetStateAction<SaleFromApi | null>>;
  filteredSales: SaleFromApi[];
}
const SalesHistory: React.FC<IProps> = ({
  sales,
  selectedSale,
  setSelectedSale,
  filteredSales,
}) => {
  const [listView, setListView] = useState<boolean>(true);

  const sortedSales = [...(filteredSales || sales)].sort((a, b) => moment(b.created_at).diff(a.created_at))

  return (
    <Container>
      <header>
        <h3>Histórico de vendas</h3>
        <ActionTypeList>
          <ListIcon onClick={() => setListView(true)} listView={listView} />
          <GridIcon onClick={() => setListView(false)} listView={listView} />
        </ActionTypeList>
      </header>
      <ListContainer listView={listView}>
        {listView ? (
          <>
            {(filteredSales || sales).map((sale, index) => (
              <CardSale
                key={index}
                style={{ flexDirection: "row" }}
                isSelected={sales[index] == selectedSale ? true : false}
                isAbstract={sales[index].abstract_sale}
                onClick={() => setSelectedSale(sale)}
              >
                <Col sm={5}>
                  <span>{index + 1}</span>
                </Col>
                <Col sm={5}>R$ {currencyFormater(sale.total_sold)}</Col>
                <Col sm={5}>{sale.quantity}</Col>
                <Col sm={4}>
                  {moment(sale.created_at).add(3, 'hours').format("DD/MM/YYYY HH:mm:ss")}
                </Col>
                <Col sm={5}>{SalesTypes[sale.type]}</Col>
              </CardSale>
            ))}
          </>
        ) : (
          <>
            {sortedSales.map((sale, index) => (
              <CardSale
                key={index}
                isSelected={sale === selectedSale}
                isAbstract={sale.abstract_sale}
                onClick={() => setSelectedSale(sale)}
              >
                <Row>
                  <Col sm={24}>
                    Horário:
                    <span>{moment(sale.created_at).add(3, 'hours').format("HH:mm:ss")}</span>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24}>
                    Valor:
                    <span>R$ {sale.total_sold.toFixed(2)}</span>
                  </Col>
                </Row>
              </CardSale>
            ))}
          </>
        )}
      </ListContainer>
    </Container>
  );
};

export default SalesHistory;
