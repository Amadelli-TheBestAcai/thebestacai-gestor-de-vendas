import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale, addItem } from "./index";
import { SaleDto, ProductDto } from "../../models/gestor";

interface Request {
  id: string;
}

class RecouverStepSales implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private stepSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Step_Sale
    ),
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    ),
    private getCurrentSaleUseCase = getCurrentSale,
    private addItemUseCase = addItem
  ) {}

  async execute({ id }: Request): Promise<SaleDto> {
    const stepSale = await this.stepSaleRepository.getById(id);

    if (!stepSale) {
      throw new Error("Venda não encontrada");
    }

    const transferItem = async (
      storeProductId: number,
      quantity: number,
      total: number
    ) => {
      const product = (await this.productRepository.getById(
        storeProductId
      )) as ProductDto;
      await useCaseFactory.execute<SaleDto>(this.addItemUseCase, {
        product,
        quantity,
        total,
      });
    };

    await stepSale.items.reduce(async (previousItem, nextItem) => {
      await previousItem;
      return transferItem(
        nextItem.store_product_id,
        nextItem.quantity,
        nextItem.total
      );
    }, Promise.resolve());

    await this.stepSaleRepository.deleteById(id);

    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }
    return sale;
  }
}

export const recouverStepSales = new RecouverStepSales();
