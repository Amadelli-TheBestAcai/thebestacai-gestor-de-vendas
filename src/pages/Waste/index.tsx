import React, { useEffect, useState } from "react";
import { Container, Content, Header, PageContent, SearchContainer, DatePicker } from "./styles";
import Spinner from "../../components/Spinner";
import WasteList from "../../containers/WasteList";
import { Modal, notification } from "antd";
import moment from "moment";
import { ProductDto } from "../../models/dtos/product";
import { ProductWasteDTO } from "../../models/dtos/productWaste";

const Waste: React.FC = () => {
  const [products, setProducts] = useState<ProductWasteDTO[]>([]);
  const [productStoreList, setProductStoreList] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isConnected, setIsConnected] = useState(false);
  const [filteredProducts, setFilteredProducts] =
    useState<ProductWasteDTO[]>(products);

  const dataInicial = moment(selectedDate, "DD/MM/YYYY").format("DD/MM/YYYY");
  const dataFinal = moment(selectedDate, "DD/MM/YYYY")
    .add(1, "days")
    .format("DD/MM/YYYY");

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { response: productWaste, has_internal_error: errorOnProducts } =
        await window.Main.productWaste.getWasteProducts(dataInicial, dataFinal);

      const { response: products } =
        await window.Main.product.getAllProductStore();

      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar os produtos",
          duration: 5,
        });
      }

      const isConnected = await window.Main.hasInternet();
      setIsConnected(isConnected);
      setProducts(productWaste);
      setProductStoreList(products);
      setLoading(false);
    }

    init();
  }, [dataInicial, dataFinal, shouldSearch]);

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

  return (
    <Container>
      <PageContent>
        {isConnected ? (
          <>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Header>
                  <h2>Desperdício</h2>
                </Header>
                <>
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
              </>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </PageContent>
    </Container>
  );
};

export default Waste;
