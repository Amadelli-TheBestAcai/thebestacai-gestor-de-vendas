import React, { useState, Dispatch, SetStateAction } from "react";

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
}
const Evaluation: React.FC<IProps> = ({ setStep }) => {
  const { sale } = useSale();
  const { store } = useStore();
  const [loading, setLoading] = useState(false);
  const [openNps, setOpenNps] = useState(true);

  const npsScores = [
    {
      id: 1,
      element: (
        <EvalutionContainer>
          <img src={totem_very_bad} />
          <span>Péssima</span>
        </EvalutionContainer>
      ),
      value: 1,
    },
    {
      id: 2,
      element: (
        <EvalutionContainer>
          <img src={totem_bad} />
          <span>Ruim</span>
        </EvalutionContainer>
      ),
      value: 2,
    },
    {
      id: 3,
      element: (
        <EvalutionContainer>
          <img src={totem_normal} />
          <span>Regular</span>
        </EvalutionContainer>
      ),
      value: 3,
    },
    {
      id: 4,
      element: (
        <EvalutionContainer>
          <img src={totem_good} />
          <span>Boa</span>
        </EvalutionContainer>
      ),
      value: 4,
    },
    {
      id: 5,
      element: (
        <EvalutionContainer>
          <img src={totem_very_good} />
          <span>Incrível</span>
        </EvalutionContainer>
      ),
      value: 5,
    },
  ];

  const onFinish = async (payload: SaleDto) => {
    setLoading(true);

    const {
      has_internal_error: errorOnPrintCupomTef,
      error_message: error_message_print_cupom_tef,
    } = await window.Main.common.printCouponTef();

    if (errorOnPrintCupomTef) {
      notification.error({
        message: error_message_print_cupom_tef || "Erro ao imprimir cupom",
        duration: 5,
      });
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
        duration: 5,
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
    } = await window.Main.sale.emitNfce(nfcePayload, null, true);
    if (errorOnEmitNfce) {
      if (error_message_emit_nfe === "Store token not found.") {
        notification.error({
          message: "O token da nota fiscal não está cadastrado na loja.",
          duration: 5,
        });
        return;
      }
      return notification.error({
        message: error_message_emit_nfe || "Erro ao emitir NFCe",
        duration: 5,
      });
    }

    if (nfceResponse.status_sefaz !== "100") {
      notification.error({
        message: nfceResponse.mensagem_sefaz || nfceResponse.mensagem,
        duration: 5,
      });
      return;
    } else {
      notification.success({
        message: nfceResponse.mensagem_sefaz,
        duration: 5,
      });

      payload.nfce_focus_id = nfceResponse.id;
      payload.nfce_url = `https://api.focusnfe.com.br${nfceResponse.caminho_xml_nota_fiscal}`;
    }

    const {
      has_internal_error: errorOnFinishSAle,
      error_message: error_message_finalize_sale,
    } = await window.Main.sale.finishSale({
      ...payload,
      formated_type: SalesTypes[payload.type],
    });

    if (errorOnFinishSAle) {
      setLoading(false);

      error_message_finalize_sale
        ? notification.warning({
            message: error_message_finalize_sale,
            duration: 5,
          })
        : notification.error({
            message: "Erro ao finalizar venda",
            duration: 5,
          });
    }
    setLoading(false);
    setOpenNps(false);
  };

  const onHandleNps = async (score: number) => {
    if (loading) return;

    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        nps_score: score,
      }
    );

    onFinish(updatedSale);
  };

  return (
    <>
      <Container>
        <Header>
          <span className="span-title">Obrigado</span>
          <span>Pagamento Concluido!</span>
          <span>Curta o seu açai</span>
        </Header>
        <Body>
          <img src={finish_image} />
        </Body>
        <Footer>
          <ButtonNewOrder onClick={() => setStep(1)}>
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
        style={{ height: "44.56rem" }}
        footer={false}
      >
        <>
          <span className="modal-title">Como foi sua experiência?</span>
          <NpsContainer>
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
            <Button onClick={() => onFinish(sale)}>Pular</Button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default Evaluation;
