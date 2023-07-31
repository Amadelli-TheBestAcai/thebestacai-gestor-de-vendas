import React, { useEffect, useState } from "react";
import {
  Container,
  Content,
  Header,
  PageContent,
  SearchContainer,
  DatePicker,
} from "./styles";
import Spinner from "../../components/Spinner";
import WasteList from "../../containers/WasteList";
import { Modal, notification } from "antd";
import moment from "moment";
import { ProductDto } from "../../models/dtos/product";
import { ProductWasteDTO } from "../../models/dtos/productWaste";
import { useSale } from "../../hooks/useSale";
import CashNotFound from "../../components/CashNotFound";

const Waste: React.FC = () => {
  const [products, setProducts] = useState<ProductWasteDTO[]>([]);
  const [productStoreList, setProductStoreList] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isConnected, setIsConnected] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProductWasteDTO[]>([]);

  const { storeCash } = useSale();

  useEffect(() => {
    async function fetchData() {
      if (storeCash?.is_opened) {
        setLoading(true);

        const dataFormatted = formatDate(selectedDate);
        const {
          response: productWaste,
          has_internal_error: errorOnProductsWaste,
        } = await window.Main.productWaste.getWasteProducts(
          dataFormatted,
          dataFormatted
        );

        if (errorOnProductsWaste) {
          notification.error({
            message: "Erro ao encontrar os produtos",
            duration: 5,
          });
        }

        const isConnected = await window.Main.hasInternet();
        setIsConnected(isConnected);
        setProducts(productWaste);
        setLoading(false);
        setShouldSearch(true); 
      } else {
        setProducts([]);
        setLoading(false);
        setShouldSearch(false); 
        notification.warning({
          message: "Caixa fechado",
          description:
            "O caixa está fechado. Não é possível fazer a requisição de produtos.",
          duration: 5,
        });
      }
    }

    async function fetchProductStoreList() {
      const { response: products } =
        await window.Main.product.getAllProductStore();
      setProductStoreList(products);
    }

    fetchData();
    fetchProductStoreList();
  }, [selectedDate, shouldSearch, storeCash?.is_opened]);

  const deleteWaste = async (id: number): Promise<void> => {
    const confirmDelete = async (): Promise<void> => {
      setLoading(true);
      try {
        const { has_internal_error: error } =
          await window.Main.productWaste.deleteProductWaste(id);

        if (error) {
          throw new Error("Erro ao remover desperdício");
        }

        notification.success({
          message: "Desperdício removido com sucesso!",
          description: "O desperdício selecionado foi removido.",
          duration: 5,
        });
        setShouldSearch(true);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: "Erro ao remover desperdício",
          duration: 5,
        });
        setLoading(false);
      } finally {
        setLoading(false);
        setShouldSearch(false);
      }
    };

    Modal.confirm({
      content: "Gostaria de prosseguir e remover esse desperdício?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      onOk: confirmDelete,
    });
  };

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const findProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = new RegExp(value, "i");

    const filteredProductsItem = products.filter((product) =>
      regex.test(removeAccents(product.name))
    );

    setFilteredProducts(filteredProductsItem);
  };

  const formatDate = (date: moment.Moment) => {
    return date.format("DD/MM/YYYY");
  };

  return (
    <Container>
      <PageContent>
        {loading ? (
          <Spinner />
        ) : isConnected ? (
          storeCash?.is_opened ? (
            <>
              <Header>
                <h2>Desperdício</h2>
              </Header>
              <SearchContainer>
                <DatePicker
                  value={selectedDate}
                  allowClear={false}
                  format="DD/MM/YYYY"
                  onChange={(date) => setSelectedDate(date)}
                />
              </SearchContainer>
              <Content>
                <WasteList
                  products={products}
                  productsStore={productStoreList}
                  setLoading={setLoading}
                  loading={false}
                  findProduct={findProduct}
                  filteredProducts={filteredProducts}
                  deleteWaste={deleteWaste}
                  setShouldSearch={setShouldSearch}
                />
              </Content>
            </>
          ) : (
            <CashNotFound description="Nenhum caixa aberto no momento. Abra o caixa para cadastrar o desperdício." />
          )
        ) : (
          <Spinner />
        )}
      </PageContent>
    </Container>
  );
};

export default Waste;
