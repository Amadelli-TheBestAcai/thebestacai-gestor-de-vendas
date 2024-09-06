import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Container, Footer, Button, TextHeader } from "./styles";

import totem_welcome_image1 from "../../../../assets/totem/img/totem_welcome_img1.png";
import totem_welcome_image2 from "../../../../assets/totem/img/totem_welcome_img2.png";
import totem_welcome_image3 from "../../../../assets/totem/img/totem_welcome_img3.png";
import totem_welcome_image4 from "../../../../assets/totem/img/totem_welcome_img4.png";
import totem_welcome_image5 from "../../../../assets/totem/img/totem_welcome_img5.png";

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
    {
      url: totem_welcome_image4,
    },
    {
      url: totem_welcome_image5,
    },
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setCurrentImage((oldImage) => (oldImage + 1) % 5);
    }, 8000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <Container urlImage={images[currentImage].url}>
      <TextHeader colorTextImage={currentImage === 2 ? true : false}>
        <p>Bem-vindo à The Best!</p>
        <p>Faça seu check-out AQUI</p>
      </TextHeader>
      <Footer>
        <Button onClick={() => stepChange(2)} loading={is_loading}>
          Iniciar Checkout
        </Button>
      </Footer>
    </Container>
  );
};

export default Welcome;
