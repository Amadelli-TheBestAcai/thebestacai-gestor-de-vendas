const { SerialPort } = require("serialport");

class DigitalBalance {
  port;
  portName;

  connect() {
    return new Promise((resolve) => {
      this.port = new SerialPort(
        {
          path: this.portName,
          baudRate: 9600,
          dataBits: 7,
          stopBits: 1,
          parity: "none",
        },
        (err) => {
          if (err) {
            const errorFileNotFound = err?.message
              .toLowerCase()
              .includes("file not found");

            if (errorFileNotFound) {
              resolve({
                success: false,
                message: `A porta ${this.port?.path} não foi encontrada`,
              });
            }
            const errorAccessDenied = err?.message
              .toLowerCase()
              .includes("access denied");
            if (errorAccessDenied) {
              resolve({
                success: false,
                message: `A porta ${this.port?.path} já está sendo utilizada por outro dispositivo`,
              });
            }
            console.log(err);
            resolve({
              success: false,
              message: "Falha ao conectar a balança",
              error: err,
            });
          } else {
            this.port?.on("error", function (err: any) {
              console.log(err);
              resolve({
                success: false,
                message: "Falha ao conectar a balança",
                error: err,
              });
            });
            setTimeout(
              () =>
                resolve({
                  success: true,
                  message: "Conexão com a balança foi estabelecida com sucesso",
                  error: err,
                }),
              500
            );
          }
        }
      );
    });
  }

  disconnect() {
    if (this.port && !this.port.destroyed) {
      this.port.close();
    }
  }

  read() {
    return new Promise((resolve) => {
      this.port.once("data", (data) => {
        let dataString = data.toString();
        let cleanData = dataString.replace(/[^\d.]/g, "");
        let parsedValue = parseFloat(cleanData);
        resolve(parsedValue);
      });

      setTimeout(() => resolve(0), 1500);
    });
  }
}

export const digitalBalance = new DigitalBalance();
