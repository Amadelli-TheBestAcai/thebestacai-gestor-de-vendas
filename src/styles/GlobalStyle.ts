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

    width: 100%;
    height: 100%;
    font: 500 1rem "Roboto", sans-serif;
    -webkit-text-size-adjust: none;
    -webkit-font-smoothing: antialiased;

    .ant-switch-checked {
      background-color: var(--orange-250);
    }

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

    .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
      @media (max-width: 1366px) {
        font-size: 0.8rem;
      }
    }

    .ant-modal-confirm-btns {
        margin-top: 0.8rem;
          .ant-btn {
            border: none;

            :last-child {
              background: var(--green-200);
              border-radius: 20px;
              color: white;
            }

            :hover,
            :active,
            :focus {
              border: none;
            }
          }
        }

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      .ant-notification-notice-with-icon, 
      .ant-notification-notice-message, 
      .ant-notification-notice-description {
        font-size: 12px !important;
      }

      .ant-notification-notice {
        padding: 0.8rem 1.2rem;
        max-width: 310px; 
      }

      .ant-modal-confirm {
        width: 350px;
        padding: 24px 24px 20px;

        .ant-modal-confirm-title {
          font-size: 0.8rem;
        }

        .ant-modal-confirm-content {
          font-size: 0.8rem;
        }

        .ant-modal-confirm-btns {
          margin-top: 0.8rem;

          .ant-btn {
            border: none;

            :last-child {
              background: var(--green-200);
              border-radius: 20px;
              color: white;
            }

            span {
              font-size: 0.7rem;
            }

            :hover,
            :active,
            :focus {
              border: none;
            }
          }
        }

      }
    }

    .ant-input, .ant-input-password,
    .ant-select-selector,
    .ant-picker,
    .ant-form-item-control-input,
    .ant-input-affix-wrapper {
      border-radius: 0.7rem;
      outline: none;
      border: none;
      box-shadow: 0 0 0 0;
      background: var(--white-70);
      padding-left: 0.8rem;
      
      :focus,
      :active,
      :hover {
        outline: none;
        border: none;
        box-shadow: 0 0 0 0;
      }
    }

    /*Responsive 1366px*/
    @media (max-width: 1366px) {
      .ant-modal-body {
        padding: 4%;
        input {
          height: 3rem !important;
          font-size: 0.8rem;
        }
      }

      .ant-modal-title {
        font-size: 0.8rem;
      }

      .ant-modal-close-x {
       font-size: 0.8rem;
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
