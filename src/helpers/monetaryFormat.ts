export const monetaryFormat = (value: number): string => {
    if (!value) {
        return "0,00";
    }
    return value.toFixed(2).replace(".", ",");
};