import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import moment from "moment";
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
  ContentBoxes,
} from "./styles";
import { calculateTimeAgo } from "../../helpers/orderTime";
import { Col, Modal, notification } from "antd";
import { orderStatus } from "../../models/dtos/ifood/orderStatus";

import { OrderDto } from "../../models/dtos/ifood";

import { useIfood } from "../../hooks/useIfood";

interface IPageIfoodProps {
  order: OrderDto;
  closePage: () => void;
  changingStatus: boolean;
  setChangingStatus: Dispatch<SetStateAction<boolean>>;
}

const OrderPageIfood: React.FC<IPageIfoodProps> = ({
  order,
  closePage,
  changingStatus,
  setChangingStatus,
}) => {
  const timeAgo = calculateTimeAgo(order.delivery.deliveryDateTime);
  const [modalState, setModalState] = useState(false);
  const [reasonsToCancel, setReasonsToCancel] = useState<
    {
      cancelCodeId: string;
      description: string;
    }[]
  >([]);
  const [cancellingStatus, setCancellingStatus] = useState(false);
  const [reasonOption, setReasonOption] = useState("");
  const [form] = Form.useForm();

  const { setIfood } = useIfood();

  useEffect(() => {
    async function init() {
      const { response, has_internal_error, error_message } =
        await window.Main.ifood.reasonsToCancel(order.id);
      if (has_internal_error) {
        notification.error({
          message: error_message || "Oops, ocorreu um erro!",
          duration: 5,
        });
      } else {
        setReasonsToCancel(response || []);
      }
    }
    if (order.fullCode !== "CANCELLED") {
      init();
    }
  }, [order]);

  const getAction = {
    placed: "confirm",
    confirmed: "readyToPickup",
    ready_to_pickup: "dispatch",
  };

  const handleChangeOrderStatus = async () => {
    setChangingStatus(true);
    await window.Main.ifood.updateOrderStatus(
      order.id,
      getAction[order.fullCode.toLowerCase()],
      {
        cancellationCode: "",
        reason: reasonOption,
      }
    );
    const { has_internal_error, response } = await window.Main.ifood.pooling();
    if (!has_internal_error && !response.has_error) {
      setIfood(response.response);
    }
    setChangingStatus(false);

    document.getElementById("change-order-status-btn")?.blur();
  };

  const handleCancelOrder = async () => {
    if (reasonOption) {
      setCancellingStatus(true);
      const reason = reasonsToCancel.find(
        (_r) => _r.cancelCodeId === reasonOption
      );
      await window.Main.ifood.updateOrderStatus(
        order.id,
        "requestCancellation",
        {
          reason: reason.description,
          cancellationCode: reason.cancelCodeId,
        }
      );
      const { has_internal_error, response } =
        await window.Main.ifood.pooling();
      if (!has_internal_error && !response.has_error) {
        setIfood(response.response);
      }
      setModalState(false);
      setCancellingStatus(false);
    }
  };

  return (
    <Container id="ifood-container">
      <ContentOrderHeader>
        <ContentGoBack>
          <button onClick={closePage}>{"<"} Voltar</button>
        </ContentGoBack>
        <ContainerGeneral>
          <Title>{order.customer.name}</Title>
          <SubTitle>Pedido nº {order.displayId}</SubTitle>

          <ContentBoxes>
            <OrderBoxInfo>
              <ClockIcon /> Entrega prevista:{" "}
              {moment(order.delivery.deliveryDateTime).format("HH:mm")}
            </OrderBoxInfo>

            {order.customer.ordersCountOnMerchant === 0 && (
              <OrderBoxInfo>
                <SparklesIcon /> Primeiro pedido na loja!
              </OrderBoxInfo>
            )}
          </ContentBoxes>

          <OrderBoxItems>
            <span>Status do pedido</span>
            <p>{orderStatus[order.fullCode.toLowerCase()]}</p>
            <span>{timeAgo}</span>
          </OrderBoxItems>
          <OrderDetailsBox>
            <h3>Itens no pedido</h3>
            {order.items.map((item) => (
              <>
                <ContentInsideOrderDetailsBox key={item.id}>
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="price">R$ {item.totalPrice.toFixed(2)}</span>
                </ContentInsideOrderDetailsBox>
                <>
                  {item.observations && (
                    <>
                      <span>Observação:</span>
                      <span>{item.observations}</span>
                    </>
                  )}
                </>
              </>
            ))}
            <hr />
            <ContentInsideOrderDetailsBox>
              <span className="tax">Taxa de entrega</span>
              <span className="price">
                R$ {order.total.deliveryFee.toFixed(2)}
              </span>
            </ContentInsideOrderDetailsBox>
            <hr />
            <ContentInsideOrderDetailsBox>
              <span className="tax">Subtotal</span>
              <span className="price">
                R$ {order.total.orderAmount.toFixed(2)}
              </span>
            </ContentInsideOrderDetailsBox>
          </OrderDetailsBox>
          <PaymentOrderBox>
            {order.payments.methods.map((method, index) => (
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
                {order.customer.documentNumber ? (
                  <span>Incluir CPF na nota fiscal</span>
                ) : (
                  <span>Usuário sem CPF vinculado</span>
                )}
              </div>
            ))}
          </PaymentOrderBox>
          <ContentAcceptORDeniedOrder>
            <>
              <div className="btn-content">
                {!["cancelled", "concluded"].some(
                  (status) => status === order.fullCode.toLowerCase()
                ) && (
                  <CancelButton onClick={() => setModalState(true)}>
                    Recusar
                  </CancelButton>
                )}
                {["placed", "confirmed", "ready_to_pickup"].some(
                  (status) => status === order.fullCode.toLowerCase()
                ) && (
                  <Button
                    id="change-order-status-btn"
                    onClick={handleChangeOrderStatus}
                    loading={changingStatus}
                  >
                    {order.fullCode === "PLACED"
                      ? "Confirmar"
                      : order.fullCode === "READY_TO_PICKUP"
                      ? "Despachar"
                      : "Pronto para retirada"}
                  </Button>
                )}
              </div>
            </>
          </ContentAcceptORDeniedOrder>
        </ContainerGeneral>
      </ContentOrderHeader>

      <Modal
        title="Cancelar pedido"
        visible={modalState}
        onCancel={() => setModalState(false)}
        destroyOnClose={true}
        closable={true}
        width={"60%"}
        centered
        footer={
          <Footer>
            <CancelButton
              className="cancel-btn"
              disabled={cancellingStatus}
              onClick={() => setModalState(false)}
            >
              Voltar
            </CancelButton>
            <Button
              onClick={handleCancelOrder}
              disabled={!reasonOption}
              loading={cancellingStatus}
            >
              Cancelar pedido
            </Button>
          </Footer>
        }
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <p>
              Cancelar muitos pedidos pode afetar o desempenho da sua loja no
              iFood. Assim que possível, ajuste sua operação para não cancelar
              novos pedidos pelo mesmo motivo.
            </p>
            <p className="attention">
              ATENÇÃO: Muitos cancelamentos podem fechar sua loja no iFood.
            </p>
            <p>
              Selecione o motivo pelo qual você não pode aceitar esse pedido
            </p>
            <Col sm={24}>
              <Form.Item
                name="reason"
                rules={[{ required: true, message: "Selecione um motivo" }]}
              >
                <RadioGroup
                  onChange={({ target }) => {
                    setReasonOption(target.value);
                  }}
                  value={reasonOption}
                >
                  {reasonsToCancel?.map((option, index) => (
                    <Radio key={index} value={option.cancelCodeId}>
                      {option.description}
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
