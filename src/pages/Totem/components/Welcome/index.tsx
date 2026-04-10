import React, { useEffect, useState } from "react";

import { Container, Footer, Button } from "./styles";

import totem_welcome_image_wordcup from "../../../../assets/totem/img/totem_welcome_image_wordcup.png";

interface IProps {
  stepChange: (step: number) => void;
  is_loading: boolean;
}

const Welcome: React.FC<IProps> = ({ stepChange, is_loading }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    {
      url: totem_welcome_image_wordcup,
    },
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setCurrentImage((oldImage) => (oldImage + 1) % images.length);
    }, 8000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <Container urlImage={images[currentImage].url}>
      <Footer>
        <Button onClick={() => stepChange(2)} loading={is_loading}>
          Iniciar Pedido
        </Button>
      </Footer>
    </Container>
  );
};

export default Welcome;
