import React from "react";

import {
  Container,
  PageContent,
  Header,
  Footer,
  ButtonSave,
  HeaderCard,
  SettingsIcon,
  ContentCard,
  Select,
  Option,
  Switch,
  SelectsContainer,
  ActionContainer,
} from "./styles";

const Settings: React.FC = () => {
  return (
    <Container>
      <PageContent>
        <Header>
          <h2>Configurações</h2>
        </Header>
        <HeaderCard>
          <SettingsIcon />
          <span>Integração de Balança</span>
        </HeaderCard>
        <ContentCard>
          <SelectsContainer>
            <Select placeholder="Porta da balança">
              <Option>1</Option>
              <Option>2</Option>
            </Select>
            <Select placeholder="Impressora">
              <Option>1</Option>
              <Option>2</Option>
            </Select>
          </SelectsContainer>

          <ActionContainer>
            <Switch />
            <span>HABILITADO</span>
          </ActionContainer>
        </ContentCard>
        <Footer>
          <ButtonSave>Salvar</ButtonSave>
        </Footer>
      </PageContent>
    </Container>
  );
};

export default Settings;
