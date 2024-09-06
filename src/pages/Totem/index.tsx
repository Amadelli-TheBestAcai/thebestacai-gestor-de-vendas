import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ipcRenderer } from "electron"; // Importa ipcRenderer

import Welcome from "./components/Welcome";
import Identification from "./components/Identification";
import Order from "./components/Order";
import CheckOut from "./components/CheckOut";
import Payment from "./components/Payment";
import Invoice from "./components/Invoice";
import Evaluation from "./components/Evaluation";

import { Modal, notification } from "antd";

import { Container, Header, Content } from "./styles";

import the_best_acai_logo from "../../assets/totem/svg/the_best_acai_logo.svg";

import { StoreProductDto } from "../../models/dtos/storeProduct";
import { CampaignDto } from "../../models/dtos/campaign";
import { useSale } from "../../hooks/useSale";

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
      if (errorOnProducts) {
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

      setFetchingProducts(false);
      setStoreProducts(products);
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
    if (hasInternet) {
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

  return (
    <Container>
      {step !== 1 ? (
        <Header>
          <div className="logo-content">
            <img
              src={the_best_acai_logo}
              alt="the_best_acai_logo"
              onClick={handleIncrement}
            />
          </div>
        </Header>
      ) : (
        <></>
      )}
      <Content customHeight={step === 1 ? "100%" : "90%"}>
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
          />
        ) : (
          <React.Fragment />
        )}
        {step === 5 ? (
          <Payment setStep={setStep} cancelSale={cancelSale} />
        ) : (
          <React.Fragment />
        )}
        {step === 6 ? <Evaluation setStep={setStep} /> : <React.Fragment />}
      </Content>
    </Container>
  );
};

export default withRouter(Totem);
