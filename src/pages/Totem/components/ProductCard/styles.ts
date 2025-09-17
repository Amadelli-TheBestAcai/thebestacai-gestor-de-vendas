import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px var(--black);
  border-radius: 0.625rem;
  height: 100%;
  width: 100%;
  cursor: pointer;

  .product-name {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    text-transform: capitalize;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .product-img {
    width: 5rem;
    height: 5rem;
    object-fit: contain;
  }

  .product-img-add {
    position: absolute;
    top: -1.5rem;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateX(-50%);
    background-color: var(--orange-250);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    border: 2px solid white;
  }
`;
