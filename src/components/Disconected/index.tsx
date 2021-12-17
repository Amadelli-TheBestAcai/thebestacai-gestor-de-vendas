import React from "react";

import Centralizer from "../../containers/Centralizer";

import { OfflineIcon, Description } from "./styles";

const Disconected: React.FC = () => {
  return (
    <Centralizer>
      <OfflineIcon />
      <Description>Sem conexão</Description>
    </Centralizer>
  );
};

export default Disconected;
