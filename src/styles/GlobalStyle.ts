import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
   --white: #FFFFFF;
   --white-25: #F3F3F3;
   --white-30: #f7f7f7;
   --black-opaco: #1C1E23;
   --grey-70: #bebebe;
   --grey-80: #acacac;


   --orange-200: #FFB956;
   --orange-250: #FF9D0A;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  html, body, #root {
    max-height: 100vh;
    max-width: 100vw;

    width: 100%;
    height: 100%;
    font: 500 1rem "Roboto", sans-serif;
    -webkit-text-size-adjust: none;
    -webkit-font-smoothing: antialiased;


    .ant-input, .ant-input-password, .ant-select-selector, .ant-picker {
      :focus,
      :active,
      :hover {
        outline: none;
        box-shadow: 0 0 0 0;
      }
    }
  }

  *, button, input{
    border: 0;
    background: none;
    outline: none;
  }

  html {
    color: black;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
