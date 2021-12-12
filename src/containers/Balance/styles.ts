import styled, { css } from "styled-components";

import MonetaryInput from "../../components/MonetaryInput";

export const InputPrice = styled(MonetaryInput)``;

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const TopContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  background: white;
  height: 65%;
  font-size: 20px;
  color: black;
  padding: 0 15px;
  justify-content: center;

  input {
    background: white;
    height: 10vh;
    padding-right: 10px;
    border-radius: 2px;
    font-size: 32px;
    text-align: end;
    border: 1px solid #b0afae;
  }
`;

export const BottomContainer = styled.div`
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BottomContainerCSS = css`
  height: 100%;
  color: #b0afae;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24px;
  background: #eae8e8;
`;

export const Price = styled.div`
  ${BottomContainerCSS};
`;

export const Weight = styled.div`
  ${BottomContainerCSS};
`;

export const PriceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 50%;
  height: 80%;
  margin: 5px 10px 5px 10px;
  color: #9a9a9a;
`;

export const Text = styled.label`
  font-size: 14px;

  text-align: end;
`;

export const WeightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 50%;
  height: 80%;
  margin: 5px 10px 5px 10px;
  color: #9a9a9a;
`;
export const DisabledInput = styled.input`
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 1;
  caret-color: transparent;
`;
