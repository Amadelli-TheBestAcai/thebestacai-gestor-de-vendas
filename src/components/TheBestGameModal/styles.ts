import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 20px;
  gap: 12px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
`;

export const Button = styled.button`
  background-color: var(--orange-250);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--orange-200);
  }

  &:active {
    background-color: var(--orange-200);
  }
`;

export const BoxButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const ButtonHighlight = styled(Button)`
  position: relative;
  isolation: isolate;
  background-color: var(--white);
  color: var(--orange-250);
  border: 1px solid var(--orange-250);
  font-weight: 700;
  transform: translateZ(0);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  animation: glowPulse 1.25s ease-in-out infinite;
  transition: ease-in-out 0.3s;

  &::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    pointer-events: none;
    z-index: -1;
    box-shadow: 0 0 0 0 rgba(var(--orange-250-rgb, 255, 149, 0), 0.55);
    animation: haloPulse 1.25s ease-out infinite;
  }

  &:hover {
    transform: scale(1.03);
    background-color: var(--orange-250);
    color: var(--white);
    border: 1px solid var(--orange-250);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #fff, 0 0 0 6px var(--orange-250);
  }

  @keyframes glowPulse {
    0%,
    100% {
      transform: scale(1);
      filter: saturate(100%);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    45% {
      transform: scale(1.03);
      filter: saturate(115%);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
    }
  }

  @keyframes haloPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(var(--orange-250-rgb, 255, 149, 0), 0.55);
      opacity: 0.95;
    }
    70% {
      box-shadow: 0 0 0 14px rgba(var(--orange-250-rgb, 255, 149, 0), 0);
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &::after {
      animation: none;
    }
  }
`;

export const CloseButton = styled.button`
  background-color: white;
  color: var(--orange-250);
  border: 1px solid var(--orange-250);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background-color: var(--orange-250);
    border-color: var(--orange-250);
    color: white;
  }

  &:active {
    background-color: var(--orange-250);
  }
`;
