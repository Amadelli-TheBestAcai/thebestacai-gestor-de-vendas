import React, { Dispatch, SetStateAction, useState } from "react";

import pinpad_erase from "../../../../assets/totem/svg/pinpad_erase.svg";

import {
  pinPadOptions1,
  pinPadOptions2,
  pinPadOptions3,
  pinPadOptions4,
  pinPadOptions5,
  pinPadOptions6,
  pinPadOptions7,
} from "./pinpadOptions";

import { Container, PinPadOption, EraseIcon, Row } from "./styles";

interface IProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  emailOptions?: boolean;
  othersOptions?: boolean;
  maxLenght?: number;
}
const VirtualPinpad: React.FC<IProps> = ({
  value,
  setValue,
  emailOptions,
  othersOptions,
  maxLenght,
}) => {
  const [upLowerCase, setUpLowerCase] = useState<boolean>(true);

  const handleSetValue = (
    action: string,
    _value?: string,
    lowerCase?: boolean
  ) => {
    if (action === "up-lower-case") {
      setUpLowerCase((oldValue) => !oldValue);
    }
    if (action === "clear-all") {
      setValue("");
    }
    if (action === "clear-last") {
      if (value.length === 1) setValue("");
      else setValue((oldValue) => oldValue.slice(0, -1));
    }
    if (action === "add") {
      if (maxLenght && value.length >= maxLenght) {
        return;
      }
      setValue(
        (oldValue) =>
          oldValue +
          (lowerCase
            ? _value.toLowerCase()
            : upLowerCase
            ? _value.toUpperCase()
            : _value.toLowerCase()
          )?.toString()
      );
    }
  };

  return (
    <Container>
      <Row>
        {emailOptions &&
          pinPadOptions1(handleSetValue).map((pinPadOption) => (
            <PinPadOption
              key={pinPadOption.id}
              onClick={pinPadOption.action}
              width={pinPadOption.width}
            >
              {pinPadOption.value}
            </PinPadOption>
          ))}
        {pinPadOptions2(handleSetValue).map((pinPadOption) => (
          <PinPadOption
            key={pinPadOption.id}
            onClick={pinPadOption.action}
            width={pinPadOption.width}
          >
            {pinPadOption.value}
          </PinPadOption>
        ))}
        {pinPadOptions3(handleSetValue).map((pinPadOption) => (
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
        {pinPadOptions4(handleSetValue).map((pinPadOption) => (
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
        {othersOptions &&
          pinPadOptions5(handleSetValue).map((pinPadOption) => (
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
        {othersOptions &&
          pinPadOptions6(handleSetValue).map((pinPadOption) => (
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
        {!othersOptions &&
          pinPadOptions7(handleSetValue).map((pinPadOption) => (
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
