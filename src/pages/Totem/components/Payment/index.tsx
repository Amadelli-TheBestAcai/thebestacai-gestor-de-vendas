import React, { Dispatch, SetStateAction } from "react";
import moment from "moment";
import { v4 } from "uuid";

import { Container, Button } from "./styles";
import { SaleDto } from "../../../../models/dtos/sale";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
}
const Payment: React.FC<IProps> = ({ setStep, sale }) => {
  const onFinish = () => {
    const updatedSale = { ...sale };

    //TODO: REMOVER ESSE MOCK DE PAGAMENTO APÓS A IMPLEMENTAÇÃO DO TEF
    updatedSale.payments.push({
      id: v4(),
      amount: sale.total_sold,
      type: 2,
      flag_card: 1,
      formated_type: "DEBITO",
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    });
    console.log(sale);
    setStep(6);
  };

  return (
    <Container>
      <div className="content">Adicionar integração ao TEF Aqui</div>
      <div className="footer">
        <Button onClick={() => setStep(4)}>Voltar</Button>
        <Button onClick={onFinish}>Finalizar</Button>
      </div>
    </Container>
  );
};

export default Payment;
