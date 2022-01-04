import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
   --white: #FFFFFF;
   --white-25: #F3F3F3;
   --white-30: #f7f7f7;
   --white-40: #f9f9f9;
   --white-70: #f5f5f5;
   
   --black-opaco: #1C1E23;
   --gray-50: #e0e0e0;
   --grey-70: #bebebe;
   --grey-80: #acacac;
   --grey-100: #666666;


   --orange-200: #FFB956;
   --orange-250: #FF9D0A;

   --green-400: #47BC47;
   --green-600: #3A7538;
   --teal-400: #4BB8A9;
   --blue-300: #5BC0DE;
   --blue-400: #1963A2;
   --purple-450: #7E3AFC;
   --red-600: #A43C3F;

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
