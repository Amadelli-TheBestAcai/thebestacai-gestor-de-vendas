import React, { useEffect, useState } from "react";
import { Container, Content, Header, PageContent } from "./styles";

import Spinner from "../../components/Spinner";
import WasteList from "../../containers/WasteList";
import { ProductDto } from "../../models/dtos/product";

const Waste: React.FC = () => {
  const [productStoreList, setProductStoreList] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductStoreList() {
      setLoading(true);
      const { response: products } =
        await window.Main.product.getAllProductStore();
      setProductStoreList(products);
      setLoading(false);
    }

    fetchProductStoreList();
  }, []);

  return (
    <Container>
      <PageContent>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Header>
              <h2>Desperdício</h2>
            </Header>
            <Content>
              <WasteList
                products={productStoreList}
                setLoading={setLoading}
                loading={false}
              />
            </Content>
          </>
        )}
      </PageContent>
    </Container>
  );
};

export default Waste;
