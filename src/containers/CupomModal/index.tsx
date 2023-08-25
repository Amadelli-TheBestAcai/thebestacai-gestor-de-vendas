import React, { useEffect, useState } from "react";

import { notification } from "antd";
import { useSale } from "../../hooks/useSale";

import { Container, Row, Col, InputCode, Button, Input } from "./styles";

const CupomModal: React.FC = () => {
    const { sale, updateSale, cupomModalState, setCupomModalState } = useSale();
    const [cupom, seCupom] = useState(["", "", "", ""]);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const products = sale.items.map((item) => item.product)

    useEffect(() => {
        if (cupomModalState) {
            const saleHashCode = sale?.customerVoucher?.hash_code;
            if (saleHashCode) {
                seCupom([
                    `${saleHashCode[0]}${saleHashCode[1]}`,
                    `${saleHashCode[2]}${saleHashCode[3]}`,
                    `${saleHashCode[4]}${saleHashCode[5]}`,
                    `${saleHashCode[6]}${saleHashCode[7]}`,
                ]);
            }
        } else {
            seCupom(["", "", "", ""]);
            setPhone("")
        }
    }, [cupomModalState, sale]);


    const handleCupomState = (
        position: number,
        value: string,
        name: string
    ): void => {
        const updatedValue = cupom;
        updatedValue[position] = value;
        seCupom(updatedValue);
        const input = document.getElementsByName(name)[0];
        //@ts-ignore
        if (input.value.toString().length === 2) {
            const nextInputName = +name + 1 === 5 ? 4 : +name + 1;
            const nextInput = document.getElementsByName(nextInputName.toString())[0];
            nextInput.focus();
        }
    };

    const handleKeyDown = (key: string, name: string) => {
        if (key === "Backspace") {
            const input = document.getElementsByName(name)[0];
            //@ts-ignore
            if (input.value.toString().length === 0) {
                const previousInputName = +name - 1 === 1 ? 1 : +name - 1;
                const previousInput = document.getElementsByName(
                    previousInputName.toString()
                )[0];
                previousInput?.focus();
            }
        }
    };

    const onFinish = async (): Promise<void> => {
        try {
            setLoading(true);

            if (!products.length) {
                return notification.warn({
                    message: "É necessário adicionar um produto para adicionar o cupom!",
                    duration: 5,
                });
            }

            const cleanPhoneNumber = phone.replace(/\D/g, '');
            const { has_internal_error, response, error_message } =
                await window.Main.sale.getVoucher(cupom.join("").toUpperCase(), cleanPhoneNumber);

            if (has_internal_error) {
                return notification.error({
                    message: error_message || "Erro ao obter voucher",
                    duration: 5,
                });
            }

            const newTotal = sale.items.reduce((total, item) => {
                const cupomItem = response.voucher.products.find(
                    (voucherProduct) => voucherProduct.product_id === item.product.id
                );

                if (response.voucher.self_service && item.product.id === 1) {

                    return response.voucher.self_service_discount_type === 1
                        ? item.total - item.total * (+response.voucher.self_service_discount_amount / 100) + total
                        : item.total -
                        +response.voucher.self_service_discount_amount +
                        total;
                } else if (cupomItem) {
                    return item.total - +cupomItem.price_sell
                } else {
                    return item.total + total;
                }
            }, 0);
            const validatedTotal = Math.max(newTotal, 0);

            const { error } = await updateSale({
                customerVoucher: response,
                total_sold: validatedTotal,
            });

            if (error) {
                return notification.error({
                    message: error,
                    duration: 5,
                });
            }

            notification.success({
                message: "Cupom aplicado com sucesso",
                duration: 5,
            });

            setCupomModalState(false);
        } catch (e) {
            notification.error({
                message: "Oops! Ocorreu um erro",
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };

    const onCancel = async (): Promise<void> => {
        try {
            setLoading(true);
            const newTotal = sale.items.reduce(
                (total, item) => item.total + total,
                0
            );

            const { error } = await updateSale({
                customerVoucher: null,
                total_sold: newTotal,
            });

            if (error) {
                return notification.error({
                    message: error,
                    duration: 5,
                });
            }

            notification.info({
                message: "Você cancelou a utilização do cupom!",
                description: "Ele ainda poderá ser utilizado",
                duration: 5,
            });

            setCupomModalState(false);
        } catch (e) {
            notification.error({
                message: "Oops, ocorreu um erro",
                duration: 5,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            visible={cupomModalState}
            onCancel={() => setCupomModalState(false)}
            footer={null}
            centered={true}
            width={400}
            destroyOnClose
        >
            <h2>Resgate de cupom</h2>
            <p>Digite o código do cupom e o telefone do cliente abaixo para que o cupom seja resgatado.</p>

            <Row>
                <Col sm={5} xs={5}>
                    <InputCode
                        defaultValue={cupom[0]}
                        maxLength={2}
                        name="1"
                        onChange={({ target: { value } }) =>
                            handleCupomState(0, value, "1")
                        }
                        onKeyDown={({ key }) => handleKeyDown(key, "1")}
                        tabIndex={1}
                    />
                </Col>
                <Col sm={5} xs={5}>
                    <InputCode
                        defaultValue={cupom[1]}
                        maxLength={2}
                        name="2"
                        onKeyDown={({ key }) => handleKeyDown(key, "2")}
                        onChange={({ target: { value } }) =>
                            handleCupomState(1, value, "2")
                        }
                        tabIndex={2}
                    />
                </Col>
                <Col sm={5} xs={5}>
                    <InputCode
                        defaultValue={cupom[2]}
                        maxLength={2}
                        name="3"
                        onKeyDown={({ key }) => handleKeyDown(key, "3")}
                        onChange={({ target: { value } }) =>
                            handleCupomState(2, value, "3")
                        }
                        tabIndex={3}
                    />
                </Col>
                <Col sm={5} xs={5}>
                    <InputCode
                        defaultValue={cupom[3]}
                        maxLength={2}
                        name="4"
                        onKeyDown={({ key }) => handleKeyDown(key, "4")}
                        onChange={({ target: { value } }) =>
                            handleCupomState(3, value, "4")
                        }
                        tabIndex={4}
                    />
                </Col>

                <Col sm={24} className="content-tel">
                    <label htmlFor="phone">Telefone: </label>
                    <Input
                        id='phone'
                        value={phone}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
                        mask="(00) 00000-0000"
                        placeholder="(00) 00000-0000"
                    />
                </Col>
            </Row>
            <span>
                <strong>Obs:</strong>O cupom deve ser aplicado antes de finalizar a
                venda
            </span>
            <br />
            <span>
                <strong>Para recalcular o valor total:</strong>
            </span>
            <span>{" "}Remova os pagamentos</span>
            <Button
                htmlType="submit"
                type="primary"
                loading={loading}
                onClick={sale.customerVoucher ? onCancel : onFinish}
                disabled={
                    !!sale.payments.length ||
                    !phone ||
                    (cupom.some(value => value === "") && !sale.customerVoucher)
                }
            >
                <span className="buttonSpan">
                    {sale.customerVoucher ? "Cancelar" : "Resgatar"}
                </span>
            </Button>
        </Container>
    );
};

export default CupomModal;