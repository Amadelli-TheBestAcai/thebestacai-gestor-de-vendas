import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import Welcome from "./components/Welcome";
import Identification from "./components/Identification";
import Order from "./components/Order";
import CheckOut from "./components/CheckOut";
import Payment from "./components/Payment";
import Invoice from "./components/Invoice";
import Evaluation from "./components/Evaluation";

import { Modal, notification } from "antd";

import { Container, Header, Content } from "./styles";

import logoAmadelli from "../../assets/svg/logoAmadelli.svg";

import { SaleDto } from "../../models/dtos/sale";
import { StoreProductDto } from "../../models/dtos/storeProduct";
import { CampaignDto } from "../../models/dtos/campaign";

type IProps = RouteComponentProps;

const Totem: React.FC<IProps> = ({ history }) => {
  const [sale, setSale] = useState<SaleDto | null>(null);
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);

  const [storeProducts, setStoreProducts] = useState<StoreProductDto[]>([]);
  const [fetchingSale, setFetchingSale] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const [step, setStep] = useState(1);

  const [redirectHomeCount, setRedirectHomeCount] = useState(0);
  const [redirectHomeCountTimer, setredirectHomeCountTimer] = useState(null);

  const handleIncrement = () => {
    const result = redirectHomeCount + 1;

    if (result === 5) {
      Modal.confirm({
        title: `Modo Totem`,
        content: `Tem certeza que gostaria de iniciar o modo Totem`,
        visible: true,
        okText: "Sim",
        okType: "default",
        cancelText: "Não",
        centered: true,
        async onOk() {
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
          duration: 5,
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
      const {
        response: _newSale,
        has_internal_error: errorOnBuildNewSale,
        error_message,
      } = await window.Main.sale.buildNewSale(false);
      if (errorOnBuildNewSale) {
        console.log({ error_message });
        return notification.error({
          message: "Erro ao iniciar uma venda. Contate o atendente",
          duration: 5,
        });
      }

      setSale(_newSale);
      setFetchingSale(false);
    }
    if (step === 1) init();
  }, [step]);

  return (
    <Container>
      {step !== 1 ? (
        <Header>
          <div className="logo-content">
            <img
              src={logoAmadelli}
              alt="logo_amadelli"
              onClick={handleIncrement}
            />
            <span>THE BEST açai</span>
          </div>
        </Header>
      ) : (
        <></>
      )}
      <Content customHeight={step === 1 ? "100%" : "80%"}>
        {step === 1 ? (
          <Welcome
            setStep={setStep}
            is_loading={fetchingSale || fetchingProducts}
          />
        ) : (
          <React.Fragment />
        )}
        {step === 2 ? (
          <Identification setStep={setStep} setSale={setSale} sale={sale} />
        ) : (
          <React.Fragment />
        )}
        {step === 3 ? (
          <Order
            setStep={setStep}
            setSale={setSale}
            sale={sale}
            storeProducts={storeProducts}
          />
        ) : (
          <React.Fragment />
        )}
        {step === 4 ? (
          <CheckOut
            setStep={setStep}
            setSale={setSale}
            sale={sale}
            campaign={campaign}
          />
        ) : (
          <React.Fragment />
        )}
        {step === 5 ? (
          <Payment setStep={setStep} setSale={setSale} sale={sale} />
        ) : (
          <React.Fragment />
        )}
        {step === 6 ? (
          <Invoice setStep={setStep} sale={sale} />
        ) : (
          <React.Fragment />
        )}
        {step === 7 ? (
          <Evaluation setStep={setStep} setSale={setSale} sale={sale} />
        ) : (
          <React.Fragment />
        )}
      </Content>
    </Container>
  );
};

export default withRouter(Totem);
