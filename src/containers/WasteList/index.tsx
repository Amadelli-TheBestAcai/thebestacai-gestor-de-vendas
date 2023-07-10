import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Col,
  Container,
  Content,
  Header,
  TrashIcon,
  ImageIcon,
  Footer,
  ButtonCancel,
  ButtonSave,
  Input,
  ContentLeft,
  ContentRight,
  Tupla,
  ButtonWaste,
  ContentWaste,
  SelectSearch,
  Option,
  ContentModalBody,
  ColModal,
  Typography,
} from "./styles";
import { Spinner } from "styled-icons/fa-solid";
import { Modal, Tooltip, Radio } from "antd";
import { SearchIcon } from "../../pages/Waste/styles";
import ModalImageWaste from "../../pages/Waste/ModalImageWaste";

interface ITableProps {
  data: string;
  id: number;
  produto: string;
  quantidade: number;
  total?: string;
}

enum Options {
  Unidade = 0,
  Quilograma = 1,
}

interface IProps {
  products: ITableProps[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  findProduct: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredProducts: ITableProps[];
  deleteWaste: (id: number) => void;
}

const columns: ITableProps[] = [
  {
    data: "10/10/2023",
    id: 1,
    produto: "Morango",
    quantidade: 5,
    total: "0.244 kg",
  },
  {
    data: "10/10/2023",
    id: 2,
    produto: "Uva",
    quantidade: 5,
    total: "0.244 kg",
  },
  {
    data: "10/10/2023",
    id: 3,
    produto: "Morango",
    quantidade: 5,
    total: "2 un",
  },
];

const WasteList: React.FC<IProps> = ({
  products,
  setLoading,
  loading,
  findProduct,
  filteredProducts,
  deleteWaste,
}) => {
  const [modalState, setModalState] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [disabled, setdisabled] = useState(false);
  const [value, setValue] = useState(Options.Quilograma);
  const [selectedOption, setSelectedOption] = useState<Options | undefined>(
    undefined
  );

  const filteredColumns = columns.filter((column) => {
    if (selectedOption === Options.Unidade) {
      return column.total?.includes("un");
    } else if (selectedOption === Options.Quilograma) {
      return column.total?.includes("kg");
    }
    return true;
  });

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : (
        <Content>
          <ContentLeft>
            <ContentWaste>
              <span>Lista de desperdício</span>
              <ButtonWaste onClick={() => setModalState(true)}>
                Novo desperdício
              </ButtonWaste>
            </ContentWaste>
            <Header>
              <Col sm={4}>Data e hora</Col>
              <Col sm={5}>Id do produto</Col>
              <Col sm={5}>Produto</Col>
              <Col sm={5}>Quantidade</Col>
              <Col sm={5}>Ação</Col>
            </Header>

            <Input
              placeholder="Digite o nome do produto"
              prefix={<SearchIcon />}
              onChange={findProduct}
            />

            {(filteredProducts || products)?.map((column) => (
              <Tupla key={column.id}>
                <Col sm={4}>{column.data}</Col>
                <Col sm={5}>{column.id}</Col>
                <Col sm={5}>{`${column.produto}`}</Col>
                <Col sm={5}>{`${column.quantidade} KG`}</Col>
                <Col sm={5}>
                  <Tooltip title="Imagens">
                    <ImageIcon onClick={() => setModalImage(true)} />
                  </Tooltip>

                  <Tooltip title="Deletar desperdício">
                    <TrashIcon onClick={() => deleteWaste(column.id)} />
                  </Tooltip>
                </Col>
              </Tupla>
            ))}
          </ContentLeft>
          <ContentRight>
            <ContentWaste>
              <span>Ranking de desperdício</span>
              <SelectSearch
                placeholder="Escolha a opção"
                defaultValue={"Todos"}
                onChange={(value: any) => setSelectedOption(value)}
              >
                <Option value={''}>Todos</Option>
                <Option value={Options.Unidade}>Por unidade</Option>
                <Option value={Options.Quilograma}>Por kg</Option>
              </SelectSearch>
            </ContentWaste>

            <Header>
              <Col sm={6}>Posição</Col>
              <Col sm={6}>Categoria</Col>
              <Col sm={6}>Produto</Col>
              <Col sm={6}>Total</Col>
            </Header>
            {filteredColumns.map((column) => (
              <Tupla key={column.id}>
                <Col sm={6}>{`${column.id}º`}</Col>
                <Col sm={6}>{column.produto}</Col>
                <Col sm={6}>{column.quantidade}</Col>
                <Col sm={6}>{column.total}</Col>
              </Tupla>
            ))}
          </ContentRight>
        </Content>
      )}

      <Modal
        title="Adicionar desperdício"
        visible={modalState}
        onCancel={() => setModalState(false)}
        destroyOnClose={true}
        closable={true}
        centered
        footer={
          <Footer>
            <ButtonCancel onClick={() => setModalState(false)}>
              Cancelar
            </ButtonCancel>
            <ButtonSave onClick={() => {}} disabled={disabled}>
              Salvar
            </ButtonSave>
          </Footer>
        }
      >
        <ContentModalBody gutter={24}>
          <ColModal sm={12}>
            <Typography strong>Selecione uma opção:</Typography>
            <Input
              autoFocus={true}
              placeholder="Digite aqui"
              //   onChange={({ target: { value } }) => setReasson(value)}
            />
          </ColModal>

          <ColModal sm={12}>
            <Typography strong>Selecione uma opção:</Typography>

            <Input autoFocus={true} placeholder="Digite aqui" />
          </ColModal>
          <ColModal sm={12}>
            <Typography strong>Selecione uma opção:</Typography>

            <Input autoFocus={true} placeholder="Digite aqui" />
          </ColModal>

          <ColModal sm={12}>
            <Typography strong>Selecione uma opção:</Typography>
            <Radio.Group
              onChange={(e) => setValue(e.target.value)}
              value={value}
              style={{ alignItems: "center" }}
            >
              <Radio value={Options.Quilograma}>Quilograma</Radio>
              <Radio value={Options.Unidade}>Unidade</Radio>
            </Radio.Group>
          </ColModal>
        </ContentModalBody>
      </Modal>

      <ModalImageWaste
        setVisible={setModalImage}
        visible={modalImage}
        productsWaste={products}
        setLoading={setLoading}
        loading={loading}
      />
    </Container>
  );
};

export default WasteList;
