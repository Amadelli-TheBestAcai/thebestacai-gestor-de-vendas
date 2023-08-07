import React from 'react'
import { Container, ClockIcon, ContentOrderHeader, Title, SubTitle, OrderBoxInfo, OrderBoxItems, OrderDetailsBox, ContentInsideOrderDetailsBox, PaymentOrderBox } from './styles'

const OrderPageIfood: React.FC = () => {
    return (
        <Container>
            <ContentOrderHeader>
                <Title>Pedido Teste - Ana Carla Paiva </Title>
                <SubTitle>Pedido 123456 ● Feito às 08:44 ● Localizador do pedido 5456 8261</SubTitle>
                <OrderBoxInfo> <ClockIcon /> Entrega prevista: 10:14</OrderBoxInfo>
                <OrderBoxItems>
                    <span>Status do pedido</span>
                    <p>Concluído</p>
                    <span>Há uma hora.</span>
                </OrderBoxItems>
                <OrderDetailsBox>
                    <h3>Itens no pedido</h3>

                    <ContentInsideOrderDetailsBox>
                        <span>1x pedido teste - item1 - não entregar</span>
                        <span className="price">R$ 60,96</span>
                    </ContentInsideOrderDetailsBox>
                    <hr />
                    <ContentInsideOrderDetailsBox>
                        <span className="tax">Taxa de entrega</span>
                        <span className="price">R$ 10,00</span>
                    </ContentInsideOrderDetailsBox>
                    <hr />
                    <ContentInsideOrderDetailsBox>
                        <span className="tax">Subtotal</span>
                        <span className="price">R$ 80,00</span>
                    </ContentInsideOrderDetailsBox>
                </OrderDetailsBox>

                <PaymentOrderBox>
                    <div>
                        <h4>Pago via iFood, não precisa cobrar na entrega</h4>
                        <span>Incluir CPF na nota fiscal 1111111111-11</span>
                    </div>
                </PaymentOrderBox>
            </ContentOrderHeader>
        </Container>
    )
}

export default OrderPageIfood