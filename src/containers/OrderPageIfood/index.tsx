import React from 'react'
import { CustomerDto, OrderItemDto, OrderPaymentMethodDto, TotalOrderDto } from '../../models/dtos/ifood/order';
import moment from 'moment';
import { calculateTimeAgo } from '../../helpers/orderTime'
import {
    Container,
    ClockIcon,
    ContentOrderHeader,
    Title, SubTitle,
    OrderBoxInfo,
    OrderBoxItems,
    OrderDetailsBox,
    ContentInsideOrderDetailsBox,
    PaymentOrderBox,
    ContentGoBack,
    ContainerGeneral,
    Checked,
    MoneyIcon
} from './styles'
interface IPageIfoodProps {
    name: string;
    displayId: string;
    fullcode: string;
    deliveryDateTime: string;
    closePage: () => void;
    methods?: OrderPaymentMethodDto[];
    customer: CustomerDto;
    items: OrderItemDto[];
    total: TotalOrderDto;
}

const OrderPageIfood: React.FC<IPageIfoodProps> = ({
    name,
    displayId,
    deliveryDateTime,
    closePage,
    fullcode,
    items,
    total,
    customer,
    methods
}) => {
    const timeAgo = calculateTimeAgo(deliveryDateTime);

    return (
        <Container>
            <ContentOrderHeader>
                <ContentGoBack>
                    <button onClick={closePage}>{"<"} Voltar</button>
                </ContentGoBack>
                <ContainerGeneral>
                    <Title>{name}</Title>
                    <SubTitle>
                        Pedido {displayId} ● Feito {" "}
                        {moment(deliveryDateTime).format("HH:mm")}
                    </SubTitle>
                    <OrderBoxInfo>
                        <ClockIcon /> Entrega prevista: 10:14
                    </OrderBoxInfo>
                    <OrderBoxItems>
                        <span>Status do pedido</span>
                        <p>{fullcode}</p>
                        <span>{timeAgo}</span>
                    </OrderBoxItems>
                    <OrderDetailsBox>
                        <h3>Itens no pedido</h3>

                        {items && items.map((item) => (
                            <ContentInsideOrderDetailsBox key={item.id}>
                                <span>{item.quantity}x {" "} {item.name}</span>
                                <span className="price">
                                    R$ {item.totalPrice.toFixed(2)}
                                </span>
                            </ContentInsideOrderDetailsBox>
                        ))}

                        <hr />
                        <ContentInsideOrderDetailsBox>
                            <span className="tax">Taxa de entrega</span>
                            <span className="price">R$ {total.deliveryFee.toFixed(2)}</span>
                        </ContentInsideOrderDetailsBox>
                        <hr />
                        <ContentInsideOrderDetailsBox>
                            <span className="tax">Subtotal</span>
                            <span className="price">R$ {total.orderAmount.toFixed(2)}</span>
                        </ContentInsideOrderDetailsBox>
                    </OrderDetailsBox>

                    <PaymentOrderBox>
                        {methods.map((method, index) => (
                            <div key={index}>
                                {method.prepaid ?
                                    <ContentOrderHeader>
                                        <span> <Checked /> Pago via iFood, não precisa cobrar na entrega</span>
                                        <span> <MoneyIcon />Dados do pagamento - {method.card.brand} - {method.type}</span>
                                    </ContentOrderHeader>
                                    : <span>Cobrar pedido na entrega</span>}
                                {customer.documentNumber ? <span>Incluir CPF na nota fiscal</span> : <span>Usuário sem CPF vinculado</span>}
                            </div>
                        ))}
                    </PaymentOrderBox>
                </ContainerGeneral>
            </ContentOrderHeader>
        </Container>
    );
};

export default OrderPageIfood