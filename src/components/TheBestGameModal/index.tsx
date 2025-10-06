import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";
import {
  Container,
  ImageContainer,
  ButtonContainer,
  Button,
  CloseButton,
  ImagePlaceholder,
  BoxButtons,
  ButtonHighlight,
} from "./styles";

interface TheBestGameData {
  status: boolean;
  image_url: string;
  action_button_url: string;
  action_button_text: string;
  highlight_button_enabled: boolean;
  highlight_button_text: string;
  highlight_button_url: string;
}

interface TheBestGameModalProps {
  visible: boolean;
  onClose: () => void;
  gameData: TheBestGameData | null;
}

const TheBestGameModal: React.FC<TheBestGameModalProps> = ({
  visible,
  onClose,
  gameData,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (visible && gameData?.image_url) {
      setImageLoaded(false);

      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true);
      img.src = gameData.image_url;

      const timeout = setTimeout(() => {
        setImageLoaded(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible, gameData?.image_url]);

  const handleClose = () => {
    onClose();
  };

  const handleCheckDetails = () => {
    if (!gameData?.action_button_url) return;

    // @typescript-eslint/no-unsafe-assignment
    window.Main.shell.openExternal(gameData.action_button_url);
  };

  const handleHighlightButton = () => {
    if (!gameData?.highlight_button_url) return;

    //@typescript-eslint/no-unsafe-assignment
    window.Main.shell.openExternal(gameData.highlight_button_url);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
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
            <>
              {!imageLoaded && (
                <ImagePlaceholder>
                  <Spin size="default" />
                </ImagePlaceholder>
              )}
              <img
                src={gameData.image_url}
                alt="The Best Game Campaign"
                onLoad={handleImageLoad}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  display: imageLoaded ? "block" : "none",
                }}
              />
            </>
          ) : (
            <ImagePlaceholder>
              <span>Dados não disponíveis</span>
            </ImagePlaceholder>
          )}
        </ImageContainer>

        <ButtonContainer>
          <CloseButton onClick={handleClose}>Cancelar</CloseButton>
          <BoxButtons>
            {gameData?.highlight_button_enabled && (
              <ButtonHighlight
                onClick={handleHighlightButton}
                disabled={!gameData?.highlight_button_url}
              >
                {gameData?.highlight_button_text || "Ver mais"}
              </ButtonHighlight>
            )}
            <Button
              onClick={handleCheckDetails}
              disabled={!gameData?.action_button_url}
            >
              {gameData?.action_button_text || "Conferir Detalhes da Campanha"}
            </Button>
          </BoxButtons>
        </ButtonContainer>
      </Container>
    </Modal>
  );
};

export default TheBestGameModal;
