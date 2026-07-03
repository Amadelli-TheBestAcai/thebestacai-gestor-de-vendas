import React, { useEffect, useState } from "react";

import { Container, Footer, Button } from "./styles";

import totem_welcome_image1 from "../../../../assets/totem/img/totem_welcome_image1.png";
import totem_welcome_image2 from "../../../../assets/totem/img/totem_welcome_image2.png";
import totem_welcome_image3 from "../../../../assets/totem/img/totem_welcome_image3.png";

interface IProps {
  stepChange: (step: number) => void;
  is_loading: boolean;
}

const Welcome: React.FC<IProps> = ({ stepChange, is_loading }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    {
      url: totem_welcome_image1,
    },
    {
      url: totem_welcome_image2,
    },
    {
      url: totem_welcome_image3,
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
