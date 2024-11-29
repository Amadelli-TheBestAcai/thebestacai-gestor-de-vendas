

export function readIdPinPad(inputString: string) {
    // Le o numero identifcador do PIN PAD
    const code = inputString.match(/(\d+)\s*$/)?.[1];
    return code
}