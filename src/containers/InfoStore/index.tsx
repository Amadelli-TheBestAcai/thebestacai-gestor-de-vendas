import React from "react";
import { InfoStoreWrapper } from "./styles";
import { useUser } from "../../hooks/useUser";

interface InfoStoreProp {
  companyName?: string | undefined;
  isOpened?: boolean | undefined;
  isOnline?: boolean | undefined;
}

const InfoStore: React.FC<InfoStoreProp> = ({
  companyName,
  isOpened,
  isOnline,
}) => {
  const { user } = useUser();
  const storeStatusColor = isOpened
    ? isOnline
      ? "var(--green-400)"
      : "var(--orange-250)"
    : "var(--red-600)";

  return (
    <InfoStoreWrapper>
      <span>
        Usuário: {user?.name ? user?.name : "Usuário não identificado"}
      </span>
      <span>Loja: {companyName ? companyName : "Loja não identificada"}</span>
      <span style={{ color: storeStatusColor }}>
        {isOpened ? (
          <>
            Aberto <span>{isOnline ? "Online" : "Offline"}</span>
          </>
        ) : (
          <>Fechado</>
        )}
      </span>
    </InfoStoreWrapper>
  );
};

export default InfoStore;
