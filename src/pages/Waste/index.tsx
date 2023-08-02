import React, { useEffect, useState } from "react";
import { Container, Content, Header, PageContent } from "./styles";

import Spinner from "../../components/Spinner";
import WasteList from "../../containers/WasteList";
import { ProductDto } from "../../models/dtos/product";

const Waste: React.FC = () => {
  const [productList, setProductList] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductStoreList() {
      setLoading(true);
      const { response: products } =
        await window.Main.productWaste.getAllProductsToWaste();
      console.log(products);
      setProductList(products);
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
                products={productList}
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
