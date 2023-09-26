import { useState } from "react";
import ImageCode from "../../assets/svg/codeCopy.svg";
import Code from "../../assets/svg/code.svg";
import {
  Container,
  InfoContent,
  Title,
  ButtonLink,
  ContentButtons,
  Input,
  Image,
  Instruction,
  ImageSize,
  SubtitleAuth,
} from "./styles";
import { message } from "antd";

import { useIfood } from "../../hooks/useIfood";

const AuthIfood = () => {
  const [code, setCode] = useState("");
  const { setIfood } = useIfood();

  const onLogin = async () => {
    {
      await window.Main.ifood.update({
        authorizationCode: code,
      });
      const {
        has_internal_error: has_internal_error_on_auth,
        error_message: error_message_on_auth,
      } = await window.Main.ifood.authentication();
      if (has_internal_error_on_auth) {
        message.error(error_message_on_auth);
        return;
      }

      const { response } = await window.Main.ifood.update({
        is_opened: true,
      });
      setIfood(response);

      console.log({
        message: "Success on login",
        response,
      });
    }
  };
  return (
    <Container>
      <Title>Autorize o iFood no gestor</Title>

      <InfoContent>
        <ContentButtons>
          <Instruction>
            1.Copie o código de autorização disponibilizado no site do Ifood.
          </Instruction>
          <SubtitleAuth>
            Ao clicar no botão, você será redirecionado para o site do Ifood.
            Copie o código de autorização e cole no passo 2. Faça o login, se
            necessário.
          </SubtitleAuth>
          <ButtonLink
            onClick={async () => await window.Main.ifood.getCodeVerifier()}
          >
            Ver código no site
          </ButtonLink>
          <Image src={ImageCode} />
        </ContentButtons>
        <ContentButtons>
          <p className="secondTitle">2.Cole o código da autorização</p>
          <Input
            placeholder="Cole o código de autorização"
            onChange={({ target: { value } }) => setCode(value)}
          />
          <ButtonLink onClick={onLogin}>Autorizar</ButtonLink>
          <ImageSize src={Code} />
        </ContentButtons>
      </InfoContent>
    </Container>
  );
};

export default AuthIfood;
