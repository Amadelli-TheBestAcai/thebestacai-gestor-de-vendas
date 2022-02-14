import React from "react";

import { Container, HeaderCard, SettingsIcon, ContentCard } from "./styles";

interface IProps {
  title: string;
}

const CardSettings: React.FC<IProps> = ({ title, children }) => {
  return (
    <Container>
      <HeaderCard>
        <SettingsIcon />
        {title}
      </HeaderCard>
      <ContentCard>{children}</ContentCard>
    </Container>
  );
};

export default CardSettings;
