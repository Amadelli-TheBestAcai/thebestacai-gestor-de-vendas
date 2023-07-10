import React, { Dispatch, SetStateAction } from "react";
import { wasteDTO } from "../../../models/dtos/waste";
import moment from "moment";
import { Center, Container, Preview, Table, ViewButton } from "./styles";
import Spinner from "../../../components/Spinner";
import { Tooltip } from "antd";

interface IProps {
  productsWaste: any | undefined;
  visible: boolean;
  loading: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const ModalImageWaste: React.FC<IProps> = ({
  productsWaste,
  setVisible,
  visible,
  setLoading,
  loading,
}) => {
  const columns = [
    {
      title: "Imagem",
      dataIndex: "url_file",
      key: "url_file",
      render: (text) => (
        <span>
          <Preview src={text} alt="Image do pedido" />
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
                  href={record.url_file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <ImageIcon /> */}
                  <p>teste</p>
                </ViewButton>
              </Tooltip>

              <Tooltip title={"Excluir"}>
                {/* <RemoveButton onClick={() => deleteImage(record)} /> */}
                remover
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
        columns={columns}
        dataSource={productsWaste?.map((entity) => ({
          ...entity,
          key: entity.id,
        }))}
        scroll={{ y: 400 }}
      />
    </Container>
  );
};

export default ModalImageWaste;
