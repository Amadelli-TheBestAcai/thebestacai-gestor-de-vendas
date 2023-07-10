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
import moment from "moment";
import { Modal, notification } from "antd";
import { wasteDTO } from "../../models/dtos/waste";

export interface ITableProps {
  data: string;
  id: number;
  produto: string;
  quantidade: number;
}

const columns: ITableProps[] = [
  {
    data: "10/10/2023",
    id: 1,
    produto: "Morango",
    quantidade: 0.526,
  },
  {
    data: "10/10/2023",
    id: 2,
    produto: "Uva",
    quantidade: 1,
  },
  {
    data: "10/10/2023",
    id: 3,
    produto: "Morango",
    quantidade: 2.548,
  },
];

const Waste: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [products, setProducts] = useState<wasteDTO[]>([]);
  const [isConected, setIsConected] = useState(false);
  const [filteredProducts, setFilteredProducts] =
    useState<ITableProps[]>(columns);

  useEffect(() => {
    async function init() {
      const { response: response, has_internal_error: errorOnProducts } =
        await window.Main.productWaste.getWasteProducts();
      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar os produtos",
          duration: 5,
        });
      }
      const _isConnected = await window.Main.hasInternet();

      // setProducts(response);
      console.log(products);
      setLoading(false);
      setIsConected(_isConnected);
    }
    init();
  }, []);

  const deleteWaste = async (id: number) => {
    Modal.confirm({
      title: "Remover desperdício",
      content: "Tem certeza que gostaria de remover este desperdício?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      async onOk() {
        try {
          setLoading(true);
        //   await api.delete(`product_categories/${id}`);

          notification.success({
            message: "Desperdício deletado com sucesso",
            duration: 5,
          });
          setLoading(false);
        } catch (error) {
          const _message = "Erro ao deletar desperdício";

          //@ts-ignore
          const _description = error?.response?.data?.error?.message;

          notification.error({
            message: _message,
            description: _description,
            duration: 5,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const findProduct = ({ target: { value } }) => {
    const regex = new RegExp(value, "i");

    const filteredProductsItem = columns.filter((product) =>
      regex.test(removeAccents(product.produto))
    );

    setFilteredProducts(filteredProductsItem);
  };

  return (
    <Container>
      <PageContent>
        {isConected ? (
          <>
            <Header>
              <h2>Desperdício</h2>
            </Header>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <SearchContainer>
                  <DatePicker
                    value={selectedDate}
                    placeholder="DD/MM/AAAA"
                    format="DD/MM/YYYY"
                    onChange={(date) => setSelectedDate(date)}
                  />
                </SearchContainer>
                <Content>
                  <WasteList
                    products={[]}
                    setLoading={setLoading}
                    loading={false}
                    findProduct={findProduct}
                    filteredProducts={filteredProducts}
                    deleteWaste={deleteWaste}
                  />
                </Content>
              </>
            )}
          </>
        ) : (
          <p>Conecte-se à internet.</p>
        )}
      </PageContent>
    </Container>
  );
};

export default Waste;
