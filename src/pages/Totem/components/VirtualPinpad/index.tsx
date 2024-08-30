import React, { Dispatch, SetStateAction, useState } from "react";

import pinpad_erase from "../../../../assets/totem/svg/pinpad_erase.svg";

import {
  pinPadOptions1,
  pinPadOptions2,
  pinPadOptions3,
  pinPadOptions4,
  pinPadOptions5,
  pinPadOptions6,
} from "./pinpadOptions";

import { Container, PinPadOption, EraseIcon, Row } from "./styles";

interface IProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}
const VirtualPinpad: React.FC<IProps> = ({ email, setEmail }) => {
  const [upLowerCase, setUpLowerCase] = useState<boolean>(true);
  const handleSetEmail = (
    action: string,
    value?: string,
    lowerCase?: boolean
  ) => {
    if (action === "up-lower-case") {
      setUpLowerCase((oldValue) => !oldValue);
    }
    if (action === "clear-all") {
      setEmail("");
    }
    if (action === "clear-last") {
      if (email.length === 1) setEmail("");
      else setEmail((oldValue) => oldValue.slice(0, -1));
    }
    if (action === "add") {
      setEmail(
        (oldValue) =>
          oldValue +
          (lowerCase
            ? value.toLowerCase()
            : upLowerCase
            ? value.toUpperCase()
            : value.toLowerCase()
          )?.toString()
      );
    }
  };

  return (
    <Container>
      <Row>
        {pinPadOptions1(handleSetEmail).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {pinPadOption.value}
          </PinPadOption>
        ))}
        {pinPadOptions2(handleSetEmail).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {pinPadOption.value}
          </PinPadOption>
        ))}
        {pinPadOptions3(handleSetEmail).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {upLowerCase
              ? pinPadOption.value.toUpperCase()
              : pinPadOption.value.toLowerCase()}
          </PinPadOption>
        ))}
        {pinPadOptions4(handleSetEmail).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {upLowerCase
              ? pinPadOption.value.toUpperCase()
              : pinPadOption.value.toLowerCase()}
          </PinPadOption>
        ))}
        {pinPadOptions5(handleSetEmail).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {upLowerCase
              ? pinPadOption.value.toUpperCase()
              : pinPadOption.value.toLowerCase()}
          </PinPadOption>
        ))}
        {pinPadOptions6(handleSetEmail).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {pinPadOption.value ? (
              upLowerCase ? (
                pinPadOption.value.toUpperCase()
              ) : (
                pinPadOption.value.toLowerCase()
              )
            ) : (
              <EraseIcon src={pinpad_erase} />
            )}
          </PinPadOption>
        ))}
      </Row>
    </Container>
  );
};

export default VirtualPinpad;
