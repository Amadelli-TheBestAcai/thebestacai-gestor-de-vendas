import React, { SetStateAction, Dispatch } from "react";
import Pagination from "../../components/Pagination";
import {
  Col,
  HeaderInfo,
  TBody,
  THeaderContainer,
  Footer,
  Container,
  THead,
  LoadingContainer,
  Spin,
  SearchIcon,
} from "./styles";
import { Page } from "../../models/dtos/page";

type Header = {
  sm: number;
  xs: number;
  description: string;
  hasOrdenation?: boolean;
  ordenationProp?: string;
  ordenationFunction?: any;
};

type IProps = {
  setPaginate?: Dispatch<SetStateAction<Page>>;
  setStateSearch?: Dispatch<SetStateAction<boolean>>;
  totalElements?: number;
  header: Header[];
  loading: boolean;
};

const Table: React.FC<IProps> = ({
  children,
  setPaginate,
  setStateSearch,
  totalElements,
  header,
  loading,
}) => {
  return (
    <Container>
      <THeaderContainer>
        <THead align="middle">
          {header.map(
            (
              {
                sm,
                xs,
                description,
                hasOrdenation,
                ordenationFunction,
                ordenationProp,
              },
              index
            ) => (
              <Col sm={sm} xs={xs} key={index}>
                {hasOrdenation && (
                  <SearchIcon
                    onClick={() => ordenationFunction(ordenationProp)}
                  />
                )}
                <HeaderInfo>{description}</HeaderInfo>
              </Col>
            )
          )}
        </THead>
      </THeaderContainer>
      <TBody>
        {loading ? (
          <LoadingContainer>
            <Spin />
          </LoadingContainer>
        ) : (
          children
        )}
      </TBody>

      {setPaginate && totalElements && setStateSearch && (
        <Footer>
          <Pagination
            setPaginate={setPaginate}
            totalElements={totalElements}
            setStateSearch={setStateSearch}
          />
        </Footer>
      )}
    </Container>
  );
};

export default Table;
