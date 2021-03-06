import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import Audit from "../../components/Audit";
import Pagination from "../../components/Pagination";
import Centralizer from "../../containers/Centralizer";

import { Audit as AuditModel } from "../../models/dtos/audit";
import { Page } from "../../models/dtos/page";

import { Spin, Empty, message, notification } from "antd";
import { Container, Modal } from "./styles";

interface IProps {
  id: number | undefined;
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  setPaginate: Dispatch<SetStateAction<Page>>;
  paginate: Page;
}

const StockAuditList: React.FC<IProps> = ({
  id,
  visible,
  setVisible,
  paginate,
  setPaginate,
}) => {
  const [audits, setAudits] = useState<AuditModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shouldSearch, setShouldSearch] = useState(false);
  const { page, size } = paginate;

  useEffect(() => {
    async function init() {
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.GetProductStoreHistory(id, page, size);
      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar historícos dos produtos",
          duration: 5,
        });
      }
      const totalElements = products?.totalElements;
      if (products) {
        setLoading(false);
        setAudits(products.audits);
        setPaginate((oldValues) => ({ ...oldValues, totalElements }));
      } else {
        message.error("Erro ao obter auditoria do produto!");
      }
    }
    if (id || shouldSearch) {
      setLoading(true);
      init();
    }
  }, [page, size, shouldSearch, id, setPaginate]);

  return (
    <Container>
      <Modal
        title="Histórico"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        cancelButtonProps={{ hidden: true }}
        closable={true}
        width={1000}
        destroyOnClose={true}
        footer={
          <>
            <Pagination
              setStateSearch={setShouldSearch}
              setPaginate={setPaginate}
              totalElements={paginate.totalElements}
            />
          </>
        }
      >
        {loading ? (
          <Centralizer>
            <Spin />
          </Centralizer>
        ) : audits.length ? (
          audits.map((audit) => <Audit key={audit.id} {...audit} />)
        ) : (
          <Centralizer>
            <Empty description="Nenhum histórico de alteração encontrado" />
          </Centralizer>
        )}
      </Modal>
    </Container>
  );
};

export default StockAuditList;
