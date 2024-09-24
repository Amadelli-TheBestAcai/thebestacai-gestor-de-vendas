import React, {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

import totem_bad from "../../../../assets/totem/svg/totem_bad.svg";
import totem_good from "../../../../assets/totem/svg/totem_good.svg";
import finish_image from "../../../../assets/totem/svg/finish_image.svg";
import totem_normal from "../../../../assets/totem/svg/totem_normal.svg";
import totem_very_bad from "../../../../assets/totem/svg/totem_very_bad.svg";
import totem_very_good from "../../../../assets/totem/svg/totem_very_good.svg";

import { useSale } from "../../../../hooks/useSale";

import { useStore } from "../../../../hooks/useStore";
import { SaleDto } from "../../../../models/dtos/sale";
import { SalesTypes } from "../../../../models/enums/salesTypes";

import { notification } from "antd";

import {
  Container,
  Button,
  Modal,
  NpsContainer,
  EvalutionContainer,
  ButtonNewOrder,
  Header,
  Body,
  Footer,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  inactive: boolean;
  printer: boolean;
}
const Evaluation: React.FC<IProps> = ({ setStep, inactive, printer }) => {
  const { sale } = useSale();
  const { store } = useStore();
  const [openNps, setOpenNps] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [npsScore, setNpsScore] = useState<number>(null);
  const [userName, setUserName] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const npsScores = [
    {
      id: 1,
      element: (
        <EvalutionContainer select={npsScore === 1} loading={loading}>
          <img src={totem_very_bad} />
          <span>Péssima</span>
        </EvalutionContainer>
      ),
      value: 1,
    },
    {
      id: 2,
      element: (
        <EvalutionContainer select={npsScore === 2} loading={loading}>
          <img src={totem_bad} />
          <span>Ruim</span>
        </EvalutionContainer>
      ),
      value: 2,
    },
    {
      id: 3,
      element: (
        <EvalutionContainer select={npsScore === 3} loading={loading}>
          <img src={totem_normal} />
          <span>Regular</span>
        </EvalutionContainer>
      ),
      value: 3,
    },
    {
      id: 4,
      element: (
        <EvalutionContainer select={npsScore === 4} loading={loading}>
          <img src={totem_good} />
          <span>Boa</span>
        </EvalutionContainer>
      ),
      value: 4,
    },
    {
      id: 5,
      element: (
        <EvalutionContainer select={npsScore === 5} loading={loading}>
          <img src={totem_very_good} />
          <span>Incrível</span>
        </EvalutionContainer>
      ),
      value: 5,
    },
  ];

  useEffect(() => {
    if (inactive) {
      onFinish(sale);
    }
  }, [inactive]);

  useEffect(() => {
    if (!openNps) {
      timeoutRef.current = setTimeout(() => {
        setStep(1);
      }, 10000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [openNps]);

  const onFinish = async (payload: SaleDto) => {
    setLoading(true);

    if (printer) {
      const {
        has_internal_error: errorOnPrintCupomTef,
        error_message: error_message_print_cupom_tef,
      } = await window.Main.common.printCouponTef();
      if (errorOnPrintCupomTef) {
        notification.error({
          message: error_message_print_cupom_tef || "Erro ao imprimir cupom",
          description: "Por favor informe o atendente",
          duration: 5,
          className: "notification-totem",
        });
      }
    }

    const codes_nsu = payload.payments
      .map((payment) => payment.code_nsu)
      .filter((code_nsu) => code_nsu !== undefined && code_nsu !== null);

    const {
      has_internal_error: errorOnFinalizaTransacao,
      error_message: error_message_finalize_tef,
    } = await window.Main.tefFactory.finalizeTransaction(codes_nsu);

    if (errorOnFinalizaTransacao) {
      notification.error({
        message:
          error_message_finalize_tef || "Erro ao finalizar transação TEF",
        description: "Por favor informe o atendente",
        duration: 5,
        className: "notification-totem",
      });
      setLoading(false);
      return;
    }

    const nfcePayload = {
      cpf: payload.cpf_used_nfce ? payload.client_cpf : null,
      store_id: store.company_id,
      total: payload.total_sold,
      discount: 0,
      change_amount: 0,
      items: payload.items.map((product) => ({
        product_store_id: product.store_product_id,
        price_sell: product.total,
        quantity: product.quantity,
      })),
      payments: payload.payments.map((payment) => ({
        amount: +payment.amount.toFixed(2),
        type: +payment.type,
        flag_card: payment.flag_card ? +payment.flag_card : payment.flag_card,
        code_nsu: payment.code_nsu ? payment.code_nsu : null,
        cnpj_credenciadora: payment.code_nsu
          ? payment.cnpj_credenciadora
          : null,
        numero_autorizacao: payment.code_nsu
          ? payment.numero_autorizacao
          : null,
        cnpj_beneficiario: payment.code_nsu ? payment.cnpj_beneficiario : null,
        id_terminal_pagamento: payment.code_nsu
          ? payment.id_terminal_pagamento
          : null,
      })),
      ref: payload.ref,
    };

    const {
      response: nfceResponse,
      has_internal_error: errorOnEmitNfce,
      error_message: error_message_emit_nfe,
    } = await window.Main.sale.emitNfce(nfcePayload, payload.id, true);
    if (errorOnEmitNfce) {
      notification.error({
        message: error_message_emit_nfe || "Erro ao emitir NFCe",
        description: "Por favor informe o atendente",
        duration: 5,
        className: "notification-totem",
      });
    } else {
      notification.success({
        message: nfceResponse.mensagem_sefaz,
        description: "Nota emitida com sucesso",
        duration: 5,
        className: "notification-totem",
      });

      payload.nfce_focus_id = nfceResponse.id;
      payload.nfce_url = `https://api.focusnfe.com.br${nfceResponse.caminho_xml_nota_fiscal}`;

      if (printer) {
        const { response: _printDanfe, has_internal_error: errorOnPrintNfce } =
          await window.Main.common.printDanfe(nfceResponse);
        if (errorOnPrintNfce) {
          notification.error({
            message: error_message_emit_nfe || "Erro ao imprimir NFCe",
            description: "Por favor informe o atendente",
            duration: 5,
            className: "notification-totem",
          });
        }
      }
    }

    const {
      has_internal_error: errorOnFinishSAle,
      error_message: error_message_finalize_sale,
    } = await window.Main.sale.finishSale({
      ...payload,
      formated_type: SalesTypes[payload.type],
    });

    if (errorOnFinishSAle) {
      error_message_finalize_sale
        ? notification.warning({
            message: error_message_finalize_sale,
            description: "Por favor informe o atendente",
            duration: 5,
            className: "notification-totem",
          })
        : notification.error({
            message: "Erro ao finalizar venda",
            description: "Por favor informe o atendente",
            duration: 5,
            className: "notification-totem",
          });
    }
    setLoading(false);
    setOpenNps(false);
  };

  const onHandleNps = async (score: number) => {
    if (loading) return;
    setNpsScore(score);

    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        nps_score: score,
      }
    );

    onFinish(updatedSale);
  };

  useEffect(() => {
    const getUserName = async () => {
      const { response, has_internal_error } =
        await window.Main.user.getCustomerByCpf(sale.client_cpf);

      if (response && !has_internal_error) {
        setUserName(response.name);
      } else {
        setUserName("");
      }
    };
    getUserName();
  }, [sale]);

  return (
    <>
      <Container>
        <Header>
          <span className="span-title">
            {`Obrigado${userName ? `, ${userName}` : ""}`}!
          </span>
          <span>Pagamento Concluido!</span>
          <span>
            Curta o seu açai
            {sale.items.some((_item) => _item.product.category.id !== 1)
              ? " e não esqueça de pegar sua bebida no caixa!"
              : ""}
          </span>
        </Header>
        <Body>
          <img src={finish_image} />
        </Body>
        <Footer>
          <ButtonNewOrder
            onClick={() => {
              clearTimeout(timeoutRef.current);
              setStep(1);
            }}
          >
            Iniciar novo pedido
          </ButtonNewOrder>
        </Footer>
      </Container>
      <Modal
        visible={openNps}
        confirmLoading={loading}
        cancelButtonProps={{ hidden: true }}
        closable={false}
        centered
        width={"62.5rem"}
        style={{ height: npsScore !== 0 || !loading ? "44.56rem" : "24rem" }}
        footer={false}
      >
        <>
          <span className="modal-title">Como foi sua experiência?</span>
          <NpsContainer loading={loading} select={npsScore === 0}>
            {npsScores.map((npsScore) => (
              <div
                key={npsScore.id}
                onClick={() => onHandleNps(npsScore.value)}
              >
                {npsScore.element}
              </div>
            ))}
          </NpsContainer>
          <div>
            <Button
              onClick={() => {
                onFinish(sale), setNpsScore(0);
              }}
              loading={loading}
            >
              Pular
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default Evaluation;
