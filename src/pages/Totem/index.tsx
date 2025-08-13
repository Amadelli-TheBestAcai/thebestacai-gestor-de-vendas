import React, { useState, useEffect, useRef } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import the_best_acai_logo from "../../assets/totem/svg/the_best_acai_logo.svg";

import Welcome from "./components/Welcome";
import Order from "./components/Order";
import Cupom from "./components/Cupom";
import Payment from "./components/Payment";
import CheckOut from "./components/CheckOut";
import Evaluation from "./components/Evaluation";
import Identification from "./components/Identification";

import { useSale } from "../../hooks/useSale";

import { CampaignDto } from "../../models/dtos/campaign";
import { StoreProductDto } from "../../models/dtos/storeProduct";

import { notification } from "antd";

import { Container, Header, Content, Modal, ButtonContinue } from "./styles";

type IProps = RouteComponentProps;

const Totem: React.FC<IProps> = ({ history }) => {
  const { sale, setSale } = useSale();
  const [fetchingSale, setFetchingSale] = useState<boolean>(false);
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);

  const [storeProducts, setStoreProducts] = useState<StoreProductDto[]>([]);

  const [step, setStep] = useState(1);
  const [redirectHomeCount, setRedirectHomeCount] = useState(0);
  const [redirectHomeCountTimer, setredirectHomeCountTimer] = useState(null);

  const [printerDanfe, setPrinterDanfe] = useState<boolean>(false);
  const [printerTef, setPrinterTef] = useState<boolean>(false);

  const [cancelTimer, setCancelTimer] = useState<boolean>(false);
  const [inactive, setInactive] = useState<boolean>(false);
  const [openInactive, setOpenInactive] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenInactive(false);
    setVisibleModal(false);

    if (!cancelTimer) {
      timeoutRef.current = setTimeout(() => {
        setOpenInactive(true);
        setTimeLeft(15);
        timeoutRef.current = setTimeout(() => {
          setInactive(true);
        }, 15000);
      }, 90000);
    }
  };

  useEffect(() => {
    if (inactive && step !== 6 && step !== 1) {
      cancelSale();
      setVisibleModal(false);
    }
    if (openInactive && !visibleModal && step !== 6 && step !== 1) {
      setVisibleModal(true);
    }
  }, [inactive, openInactive]);

  useEffect(() => {
    const handleUserActivity = () => {
      setInactive(false);
      resetTimer();
    };

    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("touchmove", handleUserActivity);
    window.addEventListener("touchend", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);

    resetTimer();

    if (step === 1 || step === 6) {
      setCancelTimer(false);
    }

    return () => {
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("touchmove", handleUserActivity);
      window.removeEventListener("touchend", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [step, cancelTimer]);

  useEffect(() => {
    if (visibleModal && timeLeft > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time > 0) {
            return time - 1;
          } else {
            clearInterval(intervalRef.current);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visibleModal]);

  useEffect(() => {
    window.Main.message("enter-fullscreen");
  }, []);

  const handleIncrement = () => {
    const result = redirectHomeCount + 1;

    if (result === 10) {
      Modal.confirm({
        title: `Modo Totem`,
        content: `Tem certeza que gostaria de sair do modo Totem`,
        visible: true,
        okText: "Sim",
        okType: "default",
        cancelText: "Não",
        centered: true,
        async onOk() {
          window.Main.message("exit-fullscreen");
          history.push("/home");
        },
      });
    }

    setRedirectHomeCount(result);

    if (redirectHomeCountTimer) {
      clearTimeout(redirectHomeCountTimer);
    }

    setredirectHomeCountTimer(setTimeout(() => setRedirectHomeCount(0), 5000));
  };

  useEffect(() => {
    return () => {
      if (redirectHomeCountTimer) {
        clearTimeout(redirectHomeCountTimer);
      }
    };
  }, [redirectHomeCountTimer]);

  useEffect(() => {
    async function fetchProducts() {
      setFetchingProducts(true);
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.getProducts(true);

      const {
        response: taggedProducts,
        has_internal_error: errorOnTaggedProducts,
      } = await window.Main.product.getProductsByTags(["totem"]);

      if (errorOnTaggedProducts) console.log({ errorOnTaggedProducts });

      if (errorOnProducts || errorOnTaggedProducts) {
        notification.error({
          message: "Erro ao encontrar todos produtos",
          description: "Por favor informe o atendente",
          duration: 5,
          className: "notification-totem",
        });
      }

      const { response: currentCampaign } =
        await window.Main.sale.getCurrentCampaign();
      setCampaign(currentCampaign);

      const filterProductWithTag = products.filter((storeProduct) =>
        taggedProducts.some(
          (_taggedProduct) => _taggedProduct.id === storeProduct.id
        )
      );

      setFetchingProducts(false);
      setStoreProducts(filterProductWithTag);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    async function init() {
      setFetchingSale(true);
      const { response: _sale, has_internal_error: errorOnSale } =
        await window.Main.sale.getCurrentSale();
      if (errorOnSale) {
        return notification.error({
          message: "Erro ao iniciar uma venda.",
          description: "Por favor informe o atendente",
          duration: 5,
          className: "notification-totem",
        });
      }

      setSale(_sale);
      setFetchingSale(false);
    }
    if (step === 1) init();
  }, [step]);

  const cancelSale = async () => {
    const { has_internal_error } = await window.Main.sale.deleteSale({
      id: sale.id,
    });
    if (!has_internal_error) setStep(1);
  };

  const stepChange = async (step: number) => {
    let hasInternet = await window.Main.hasInternet();
    if (hasInternet || step === 2) {
      setStep(step);
    } else {
      notification.info({
        message: "Problema de conexão",
        description:
          "Espere um momento e tente novamente, caso o problema persista informe o atendente.",
        duration: 5,
        className: "notification-totem",
      });
    }
  };

  const getHeader = () => {
    if (step === 1 || (step >= 3 && step <= 5 && step !== 4.5)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Container>
        {getHeader() ? (
          <></>
        ) : (
          <Header>
            <div className="logo-content">
              <img
                src={the_best_acai_logo}
                alt="the_best_acai_logo"
                onClick={handleIncrement}
              />
            </div>
          </Header>
        )}
        <Content
          customHeight={getHeader() ? "100%" : "90%"}
          customJustifyContent={"flex-start"}
        >
          {step === 1 ? (
            <Welcome
              stepChange={stepChange}
              is_loading={fetchingSale || fetchingProducts}
            />
          ) : (
            <React.Fragment />
          )}
          {step === 2 ? (
            <Identification
              setStep={setStep}
              cancelSale={cancelSale}
              stepChange={stepChange}
            />
          ) : (
            <React.Fragment />
          )}
          {step === 3 ? (
            <Order
              stepChange={stepChange}
              storeProducts={storeProducts}
              cancelSale={cancelSale}
              handleIncrement={handleIncrement}
            />
          ) : (
            <React.Fragment />
          )}
          {step === 4 ? (
            <CheckOut
              setStep={setStep}
              stepChange={stepChange}
              campaign={campaign}
              cancelSale={cancelSale}
              storeProducts={storeProducts}
              handleIncrement={handleIncrement}
            />
          ) : (
            <React.Fragment />
          )}
          {step === 4.5 ? <Cupom setStep={setStep} /> : <React.Fragment />}
          {step === 5 ? (
            <Payment
              setStep={setStep}
              cancelSale={cancelSale}
              setCancelTimer={setCancelTimer}
              handleIncrement={handleIncrement}
              printerTef={printerTef}
              setPrinterTef={setPrinterTef}
              printerDanfe={printerDanfe}
              setPrinterDanfe={setPrinterDanfe}
            />
          ) : (
            <React.Fragment />
          )}
          {step === 6 ? (
            <Evaluation
              setStep={setStep}
              printerTef={printerTef}
              printerDanfe={printerDanfe}
            />
          ) : (
            <React.Fragment />
          )}
        </Content>
      </Container>
      <Modal
        visible={visibleModal}
        cancelButtonProps={{ hidden: true }}
        closable={false}
        centered
        width={"62.5rem"}
        style={{ height: "44.56rem" }}
        footer={false}
      >
        <>
          <span className="modal-title">{"Ei! Você ainda está ai?"}</span>
          <div className="modal-div-body">
            <span className="modal-body">
              {"Notamos que o seu pedido está parado há algum tempo!"}
            </span>
            <span className="modal-body">{`A operação será cancelada em`}</span>
            <span className="modal-count-timer">{`${timeLeft} segundos.`}</span>
          </div>
          <div className="modal-footer">
            <ButtonContinue>Continuar pedido</ButtonContinue>
          </div>
        </>
      </Modal>
    </>
  );
};

export default withRouter(Totem);
