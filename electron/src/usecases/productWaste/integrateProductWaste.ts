import { IUseCaseFactory } from "../useCaseFactory.interface";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { ProductWasteDTO } from "../../models/gestor/productWaste";
import { checkInternet } from "../../providers/internetConnection";

import s3Api from "../../providers/s3Api";
import odinApi from "../../providers/odinApi";
import axios from "axios";

const handleUpload = async (url: string) => {
  const { data: file } = await axios({
    url,
    method: "GET",
    responseType: "blob",
  });
  const imageToUpload = new FormData();
  imageToUpload.append("file", file);

  const {
    data: { location, key },
  } = await s3Api.post(`/s3-upload/upload/waste-files`, imageToUpload);
  return { url_file: location, s3_key: key };
};

class IntegrateProductWaste implements IUseCaseFactory {
  constructor(
    private productWasteRepository = new BaseRepository<ProductWasteDTO>(
      StorageNames.PRODUCT_WAST
    )
  ) {}

  async execute(): Promise<void> {
    const is_online = await checkInternet();
    if (is_online) {
      const wastes = await this.productWasteRepository.getAll();
      await Promise.all(
        wastes.map(async (waste) => {
          const { id, file, ...props } = waste;

          const upload = await handleUpload(file);
          await odinApi.post(`/product_store_waste`, { ...props, ...upload });

          await this.productWasteRepository.deleteById(id);
        })
      );
    }
  }
}

export const integrateProductWaste = new IntegrateProductWaste();
