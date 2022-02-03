import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
   --white: #FFFFFF;
   --white-30: #f7f7f7;
   --white-25: #F3F3F3;
   --white-40: #f9f9f9;
   --white-70: #f5f5f5;
   --white-80: #f6f6f6;
   --white-90: #ececec;
   
   --black-opaco: #1C1E23;
   --gray-25: #e3e3e3;
   --gray-50: #e0e0e0;
   --grey-60: #c4c4c4;
   --grey-70: #bebebe;
   --grey-80: #acacac;
   --grey-90: #a2a2a2;
   --grey-100: #666666;
   --grey-200: #4D4D4D;


   --warning: #f8f2d1;
   --success: #f6ffed;
   --error: #fff2f0;

   --orange-200: #FFB956;
   --orange-250: #FF9D0A;
   --orange-450: #f0ad4e;
   --orange-400: #E98E4E;
   --orange-700: #DD610A;
   --brown-500: #aa6600;

   
   --green-200: #29ff6f;
   --green-400: #47BC47;
   --green-600: #3A7538;
   --teal-400: #4BB8A9;
   --blue-300: #5BC0DE;
   --blue-350: #0279D5;
   --blue-400: #1963A2;
   --blue-500: #2D5AAC;
   --blue-700: #174275;
   --purple-450: #7E3AFC;
   --red-600: #A43C3F;

  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;

    ::-webkit-scrollbar {
      width: 0.5rem;
    }

    ::-webkit-scrollbar-track {
      background: var(--gray-50);
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--grey-80);
      border-radius: 5px;
    }
  }

  html, body, #root {
    max-height: 100vh;
    max-width: 100vw;

    width: 100vw;
    height: 100vh;
    font: 500 1rem "Roboto", sans-serif;
    -webkit-text-size-adjust: none;
    -webkit-font-smoothing: antialiased;

    .ant-tabs-tab.ant-tabs-tab-active,
    .ant-tabs-tab-btn {
      color: white;

      :active,
      :hover,
      :focus {
       color: white;
      }
    }

    .ant-notification-notice-warning {
      background: var(--warning);
      color: var(--black-opaco);
    }

    .ant-notification-notice-success {
      background: var(--success);
      color: var(--black-opaco);
    }

    .ant-notification-notice-error {
      background: var(--error);
      color: var(--black-opaco);
    }

    .ant-input, .ant-input-password, .ant-select-selector, .ant-picker, .ant-form-item-control-input {
      border-radius: 0.7rem;
      outline: none;
      border: none;
      box-shadow: 0 0 0 0;
      background: var(--white-70);
      
      :focus,
      :active,
      :hover {
        outline: none;
        border: none;
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
