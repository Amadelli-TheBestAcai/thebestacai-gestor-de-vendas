import React, { useState } from 'react';
import { CustomerDto, OrderItemDto, OrderPaymentMethodDto, TotalOrderDto } from '../../models/dtos/ifood/order';
import moment from 'moment';
import { calculateTimeAgo } from '../../helpers/orderTime';
import {
    Container,
    ClockIcon,
    ContentOrderHeader,
    Title,
    SubTitle,
    OrderBoxInfo,
    OrderBoxItems,
    OrderDetailsBox,
    ContentInsideOrderDetailsBox,
    PaymentOrderBox,
    ContentGoBack,
    ContainerGeneral,
    Checked,
    MoneyIcon,
    ContentAcceptORDeniedOrder,
    Button,
    Footer,
    Radio,
    Form,
    Row,
    RadioGroup,
    CancelButton,
    SparklesIcon,
    ContentBoxes
} from './styles';
import { Col, Modal } from 'antd';
import { orderStatus } from '../../models/dtos/ifood/orderStatus';

const optionsCancel = [
    "Problemas de sistema na loja",
    "A loja está sem entregadores disponíveis",
    "Suspeita de golpe ou trote",
    "A entrega é uma área de risco",
    "O pedido está duplicado",
    "O cardápio está desatualizado",
    "Fora de horário de funcionamento",
    "A loja só abrirá mais tarde",
    "Item indisponível",
    "O pedido está fora da área de entrega",
    "A loja está passando por dificuldades internas"
];

interface IPageIfoodProps {
    fullcode:
    | "PLACED"
    | "CONFIRMED";
    id: string;
    ordersCountOnMerchant: number;
    name: string;
    displayId: string;
    deliveryDateTime: string;
    methods: OrderPaymentMethodDto[];
    customer: CustomerDto;
    items: OrderItemDto[];
    total: TotalOrderDto;
    closePage: () => void;
}

const OrderPageIfood: React.FC<IPageIfoodProps> = ({
    id,
    name,
    displayId,
    deliveryDateTime,
    closePage,
    fullcode,
    items,
    total,
    customer,
    methods,
    ordersCountOnMerchant
}) => {
    const timeAgo = calculateTimeAgo(deliveryDateTime);
    const [modalState, setModalState] = useState(false);
    const [reasonOption, setReasonOption] = useState("");
    const [form] = Form.useForm();

    const getAction = {
        "placed": "confirm",
        "confirmed": "dispatch"
    }

    const handleChangeOrderStatus = async () => {
        await window.Main.ifood.updateOrderStatus(id, getAction[fullcode.toLowerCase()], {
            cancellationCode: "",
            reason: reasonOption,
        })
    }

    const handleCancelOrder = async () => {
        if (reasonOption) {
            await window.Main.ifood.updateOrderStatus(id, "requestCancellation", {
                reason: reasonOption,
                cancellationCode: "",
            });
            setModalState(false);
        }
    }


    return (
        <Container>
            <ContentOrderHeader>
                <ContentGoBack>
                    <button onClick={closePage}>{"<"} Voltar</button>
                </ContentGoBack>
                <ContainerGeneral>
                    <Title>{name}</Title>
                    <SubTitle>
                        Pedido nº {displayId}
                    </SubTitle>

                    <ContentBoxes>
                        <OrderBoxInfo>
                            <ClockIcon /> Entrega prevista: {moment(deliveryDateTime).format('HH:mm')}
                        </OrderBoxInfo>

                        {ordersCountOnMerchant === 0 && (<OrderBoxInfo>
                            <SparklesIcon /> Primeiro pedido na loja!
                        </OrderBoxInfo>)}
                    </ContentBoxes>

                    <OrderBoxItems>
                        <span>Status do pedido</span>
                        <p>{orderStatus[fullcode.toLowerCase()]}</p>
                        <span>{timeAgo}</span>
                    </OrderBoxItems>
                    <OrderDetailsBox>
                        <h3>Itens no pedido</h3>
                        {items.map((item) => (
                            <ContentInsideOrderDetailsBox key={item.id}>
                                <span>
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="price">
                                    R$ {item.totalPrice.toFixed(2)}
                                </span>
                            </ContentInsideOrderDetailsBox>
                        ))}
                        <hr />
                        <ContentInsideOrderDetailsBox>
                            <span className="tax">Taxa de entrega</span>
                            <span className="price">
                                R$ {total.deliveryFee.toFixed(2)}
                            </span>
                        </ContentInsideOrderDetailsBox>
                        <hr />
                        <ContentInsideOrderDetailsBox>
                            <span className="tax">Subtotal</span>
                            <span className="price">
                                R$ {total.orderAmount.toFixed(2)}
                            </span>
                        </ContentInsideOrderDetailsBox>
                    </OrderDetailsBox>
                    <PaymentOrderBox>
                        {methods.map((method, index) => (
                            <div key={index}>
                                {method.prepaid ? (
                                    <ContentOrderHeader>
                                        <span>
                                            <Checked /> Pago via iFood, não precisa cobrar na entrega
                                        </span>
                                        <span>
                                            <MoneyIcon />
                                            Dados do pagamento - {method.card.brand} - {method.type}
                                        </span>
                                    </ContentOrderHeader>
                                ) : (
                                    <span>Cobrar pedido na entrega</span>
                                )}
                                {customer.documentNumber ? (
                                    <span>Incluir CPF na nota fiscal</span>
                                ) : (
                                    <span>Usuário sem CPF vinculado</span>
                                )}
                            </div>
                        ))}
                    </PaymentOrderBox>

                    {fullcode === "CONFIRMED" || fullcode === "PLACED" ?
                        <ContentAcceptORDeniedOrder>
                            <div>
                                <span>Novo pedido</span>
                            </div>

                            <div className='btn-content'>
                                <CancelButton onClick={() => setModalState(true)}>Recusar</CancelButton>

                                <Button onClick={handleChangeOrderStatus}>
                                    {fullcode === "CONFIRMED" ? "Despachar pedido" : "Confirmar"}
                                </Button>
                            </div>
                        </ContentAcceptORDeniedOrder>
                        : <></>}
                </ContainerGeneral>
            </ContentOrderHeader>

            <Modal
                title="Cancelar pedido"
                visible={modalState}
                onCancel={() => setModalState(false)}
                destroyOnClose={true}
                closable={true}
                width={'60%'}
                centered
                footer={
                    <Footer>
                        <CancelButton className='cancel-btn' onClick={() => setModalState(false)}>
                            Voltar
                        </CancelButton>
                        <Button onClick={handleCancelOrder} disabled={!reasonOption}>
                            Cancelar pedido
                        </Button>
                    </Footer>
                }
            >
                <Form layout="vertical" form={form}>
                    <Row gutter={24}>
                        <p>Cancelar muitos pedidos pode afetar o desempenho da sua loja no iFood.
                            Assim que possível, ajuste sua operação para não cancelas novos pedidos pelo mesmo motivo
                        </p>
                        <p className="attention">ATENÇÃO: Muitos  cancelamos pela fatla de confirmação podem fechar seu restaurante na plataforma</p>
                        <p>Selecione o motivo pelo qual você não pode aceitar esse pedido</p>
                        <Col sm={24}>
                            <Form.Item
                                name="reason"
                                rules={[{ required: true, message: "Selecione um motivo" }]}
                            >
                                <RadioGroup
                                    onChange={({ target }) => {
                                        setReasonOption(target.value);
                                        console.log(target.value)
                                    }}
                                    value={reasonOption}
                                >
                                    {optionsCancel.map((option, index) => (
                                        <Radio key={index} value={option}>
                                            {option}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Container>
    );
};

export default OrderPageIfood;
