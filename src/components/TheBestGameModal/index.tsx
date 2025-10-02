import React from "react";
import { Modal } from "antd";
import {
  Container,
  ImageContainer,
  ButtonContainer,
  Button,
  CloseButton,
  ImagePlaceholder,
} from "./styles";

interface TheBestGameModalProps {
  visible: boolean;
  onClose: () => void;
  gameData: any;
}

const TheBestGameModal: React.FC<TheBestGameModalProps> = ({
  visible,
  onClose,
  gameData,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleCheckDetails = () => {
    if (!gameData?.action_button_url) return;

    // eslint-disable-next-line
    window.Main.shell.openExternal(gameData.action_button_url);
  };

  return (
    <Modal
      title="The Best Game🔥"
      visible={visible}
      onCancel={handleClose}
      centered
      closable={true}
      footer={null}
      width={1100}
    >
      <Container>
        <ImageContainer>
          {gameData?.image_url ? (
            <img
              src={gameData.image_url}
              alt="The Best Game Campaign"
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : (
            <ImagePlaceholder>
              <span>Dados não disponíveis</span>
            </ImagePlaceholder>
          )}
        </ImageContainer>

        <ButtonContainer>
          <CloseButton onClick={handleClose}>Fechar</CloseButton>
          <Button
            onClick={handleCheckDetails}
            disabled={!gameData?.action_button_url}
          >
            {gameData?.action_button_text || "Conferir Detalhes da Campanha"}
          </Button>
        </ButtonContainer>
      </Container>
    </Modal>
  );
};

export default TheBestGameModal;
