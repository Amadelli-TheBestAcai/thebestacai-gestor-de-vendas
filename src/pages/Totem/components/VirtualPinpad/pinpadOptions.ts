export const pinPadOptions1 = (
  handleSetEmail: (action: string, value?: string, upCase?: boolean) => void
) => [
  { id: 1, value: "@gmail.com", width: "11rem", action: () => handleSetEmail("add", "@gmail.com", true) },
  { id: 2, value: "@hotmail.com", width: "11rem", action: () => handleSetEmail("add", "@hotmail.com", true) },
  { id: 3, value: "@outlook.com", width: "11rem", action: () => handleSetEmail("add", "@outlook.com", true) },
  { id: 4, value: "@yahoo.com", width: "11rem", action: () => handleSetEmail("add", "@yahoo.com", true) },
  { id: 5, value: "@icloud.com", width: "11rem", action: () => handleSetEmail("add", "@icloud.com", true) },,
];

export const pinPadOptions2 = (
  handleSetEmail: (action: string, value?: string) => void
) => [
  { id: 1, value: "1", width: "5rem", action: () => handleSetEmail("add", "1") },
  { id: 2, value: "2", width: "5rem", action: () => handleSetEmail("add", "2") },
  { id: 3, value: "3", width: "5rem", action: () => handleSetEmail("add", "3") },
  { id: 4, value: "4", width: "5rem", action: () => handleSetEmail("add", "4") },
  { id: 5, value: "5", width: "5rem", action: () => handleSetEmail("add", "5") },
  { id: 6, value: "6", width: "5rem", action: () => handleSetEmail("add", "6") },
  { id: 7, value: "7", width: "5rem", action: () => handleSetEmail("add", "7") },
  { id: 8, value: "8", width: "5rem", action: () => handleSetEmail("add", "8") },
  { id: 9, value: "9", width: "5rem", action: () => handleSetEmail("add", "9") },
  { id: 10, value: "0", width: "5rem", action: () => handleSetEmail("add", "0") },
];

export const pinPadOptions3 = (
  handleSetEmail: (action: string, value?: string) => void
) => [
    { id: 1, value: "Q", width: "5rem", action: () => handleSetEmail("add", "Q") },
    { id: 2, value: "W", width: "5rem", action: () => handleSetEmail("add", "W") },
    { id: 3, value: "E", width: "5rem", action: () => handleSetEmail("add", "E") },
    { id: 4, value: "R", width: "5rem", action: () => handleSetEmail("add", "R") },
    { id: 5, value: "T", width: "5rem", action: () => handleSetEmail("add", "T") },
    { id: 6, value: "Y", width: "5rem", action: () => handleSetEmail("add", "Y") },
    { id: 7, value: "U", width: "5rem", action: () => handleSetEmail("add", "U") },
    { id: 8, value: "I", width: "5rem", action: () => handleSetEmail("add", "I") },
    { id: 9, value: "O", width: "5rem", action: () => handleSetEmail("add", "O") },
    { id: 10, value: "P", width: "5rem", action: () => handleSetEmail("add", "P") },
];

export const pinPadOptions4 = (
  handleSetEmail: (action: string, value?: string) => void
) => [
    { id: 1, value: "A", width: "5rem", action: () => handleSetEmail("add", "A") },
    { id: 2, value: "S", width: "5rem", action: () => handleSetEmail("add", "S") },
    { id: 3, value: "D", width: "5rem", action: () => handleSetEmail("add", "D") },
    { id: 4, value: "F", width: "5rem", action: () => handleSetEmail("add", "F") },
    { id: 5, value: "G", width: "5rem", action: () => handleSetEmail("add", "G") },
    { id: 6, value: "H", width: "5rem", action: () => handleSetEmail("add", "H") },
    { id: 7, value: "J", width: "5rem", action: () => handleSetEmail("add", "J") },
    { id: 8, value: "K", width: "5rem", action: () => handleSetEmail("add", "K") },
    { id: 9, value: "L", width: "5rem", action: () => handleSetEmail("add", "L") },
    { id: 10, value: "Ç", width: "5rem", action: () => handleSetEmail("add", "Ç") },
  ];

export const pinPadOptions5 = (
  handleSetEmail: (action: string, value?: string) => void
) => [
    { id: 1, value: "Z", width: "5rem", action: () => handleSetEmail("add", "Z") },
    { id: 2, value: "X", width: "5rem", action: () => handleSetEmail("add", "X") },
    { id: 3, value: "C", width: "5rem", action: () => handleSetEmail("add", "C") },
    { id: 4, value: "V", width: "5rem", action: () => handleSetEmail("add", "V") },
    { id: 5, value: "B", width: "5rem", action: () => handleSetEmail("add", "B") },
    { id: 6, value: "N", width: "5rem", action: () => handleSetEmail("add", "N") },
    { id: 7, value: "M", width: "5rem", action: () => handleSetEmail("add", "M") },
    { id: 8, value: "@", width: "5rem", action: () => handleSetEmail("add", "@") },
    { id: 9, value: "-", width: "5rem", action: () => handleSetEmail("add", "-") },
    { id: 10, value: ".", width: "5rem", action: () => handleSetEmail("add", ".") },
  ];

export const pinPadOptions6 = (
  handleSetEmail: (action: string, value?: string) => void
) => [
    { id: 1, value: "CAPS", width: "10rem", action: () => handleSetEmail("up-lower-case") },
    { id: 2, value: "+", width: "5rem", action: () => handleSetEmail("add", "+") },
    { id: 3, value: "-", width: "5rem", action: () => handleSetEmail("add", "-") },
    { id: 4, value: "!", width: "5rem", action: () => handleSetEmail("add", "!") },
    { id: 5, value: "#", width: "5rem", action: () => handleSetEmail("add", "#") },
    { id: 6, value: "$", width: "5rem", action: () => handleSetEmail("add", "$") },
    { id: 7, value: "", width: "5rem", action: () => handleSetEmail("clear-last") },
  ];
  
  export const pinPadOptions7 = (
    handleSetEmail: (action: string, value?: string) => void
  ) => [
    { id: 1, value: "Z", width: "5rem", action: () => handleSetEmail("add", "Z") },
    { id: 2, value: "X", width: "5rem", action: () => handleSetEmail("add", "X") },
    { id: 3, value: "C", width: "5rem", action: () => handleSetEmail("add", "C") },
    { id: 4, value: "V", width: "5rem", action: () => handleSetEmail("add", "V") },
    { id: 5, value: "B", width: "5rem", action: () => handleSetEmail("add", "B") },
    { id: 6, value: "N", width: "5rem", action: () => handleSetEmail("add", "N") },
    { id: 7, value: "M", width: "5rem", action: () => handleSetEmail("add", "M") },
    { id: 8, value: "", width: "5rem", action: () => handleSetEmail("clear-last") },
  ];