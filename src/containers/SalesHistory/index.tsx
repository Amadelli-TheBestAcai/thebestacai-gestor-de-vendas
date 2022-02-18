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

interface IProps {
  sales: SaleFromApi[];
  setSelectedSale: Dispatch<SetStateAction<SaleFromApi | null>>;
}
const SalesHistory: React.FC<IProps> = ({ sales, setSelectedSale }) => {
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
        {listView ? (
          <>
            {sales.map((sale, index) => (
              <CardSale key={index} onClick={() => setSelectedSale(sale)}>
                <Col sm={5}>
                  <span>{index + 1}</span>
                </Col>
                <Col sm={5}>R$ {currencyFormater(sale.total_sold)}</Col>
                <Col sm={5}>{sale.quantity}</Col>
                <Col sm={4}>
                  {moment(sale.created_at)
                    .add(3, "hours")
                    .format("DD/MM/YYYY HH:mm:ss")}
                </Col>
                <Col sm={5}>{SalesTypes[sale.type]}</Col>
              </CardSale>
            ))}
          </>
        ) : (
          <>
            {sales.map((sale, index) => (
              <CardSale key={index} onClick={() => setSelectedSale(sale)}>
                <Col sm={24}>
                  Horário:
                  <span>
                    {moment(sale.created_at).add(3, "hours").format("HH:mm:ss")}
                  </span>
                </Col>
              </CardSale>
            ))}
          </>
        )}
      </ListContainer>
    </Container>
  );
};

export default SalesHistory;
