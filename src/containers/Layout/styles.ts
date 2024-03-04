import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const SideBarContainer = styled.div`
  height: 100%;
  width: 7%;
  border-right: 5px solid var(--orange-200);
`;

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
  width: 93%;
  background: var(--white-25);
`;

export const Content = styled.div`
  height: 100%;
  width: 100%;
`;

export const HomologContent = styled.div`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 0, 0, 0.5);
  padding: 10px;
  color: white;
  z-index: 1;
  pointer-events: none;
`;
