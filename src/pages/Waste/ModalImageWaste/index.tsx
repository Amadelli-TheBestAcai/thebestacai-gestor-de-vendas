import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  ProductStoreWasteDto,
  ProductWasteDTO,
} from "../../../models/dtos/productWaste";
import { Tooltip } from "antd";
import moment from "moment";
import Spinner from "../../../components/Spinner";
import {
  Center,
  Container,
  ImageIcon,
  Preview,
  Table,
  TrashIcon,
  ViewButton,
} from "./styles";

interface IProps {
  products: ProductStoreWasteDto[];
  visible: boolean;
  loading: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ModalImageWaste: React.FC<IProps> = ({
  products,
  setVisible,
  visible,
  loading,
}) => {
  const columns = [
    {
      title: "Imagem",
      dataIndex: "url_file",
      key: "url_file",
      render: (text, record) => (
        <span>
          <Preview
            src={text}
            alt="Imagem do desperdício"
            onClick={() => console.log(text)}
          />
        </span>
      ),
    },
    {
      title: "Data/Hora",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (
        <span>
          {moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },

    {
      title: <Center>Ação</Center>,
      key: "Ação",
      width: "25%",
      render: (text, record) => (
        <Center>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Tooltip title={"Visualizar"}>
                <ViewButton
                  href={record}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageIcon />
                </ViewButton>
              </Tooltip>

              <Tooltip title={"Excluir"}>
                <TrashIcon onClick={() => console.log(record)} />
              </Tooltip>
            </>
          )}
        </Center>
      ),
    },
  ];

  return (
    <Container
      title={`Imagens`}
      visible={visible}
      centered
      onCancel={() => setVisible(false)}
      width={700}
      footer={null}
    >
      <Table
        pagination={false}
        columns={columns}
        dataSource={products?.map((entity) => ({
          ...entity,
          key: entity.id,
        }))}
      />
    </Container>
  );
};

export default ModalImageWaste;
