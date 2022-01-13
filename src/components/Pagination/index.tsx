import React, { SetStateAction, Dispatch } from "react";

import { Pagination as Paginator } from "antd";

interface Page {
  page: number | undefined;
  size: number | undefined;
  totalElements: number;
}

interface IProp {
  totalElements: number;
  setPaginate: Dispatch<SetStateAction<Page>>;
  setStateSearch: Dispatch<SetStateAction<boolean>>;
}

const Pagination: React.FC<IProp> = ({
  setPaginate,
  totalElements,
  setStateSearch,
}) => {
  function showTotal(total) {
    return `${total} items`;
  }
  function onChange(currentPage, currentSize) {
    setStateSearch(true);
    setPaginate({
      page: currentPage,
      size: currentSize,
      totalElements,
    });
  }
  return (
    <Paginator
      size="small"
      total={totalElements}
      showTotal={showTotal}
      pageSizeOptions={["10", "25", "50", "100"]}
      onChange={onChange}
      showSizeChanger
      showQuickJumper
    />
  );
};

export default Pagination;
