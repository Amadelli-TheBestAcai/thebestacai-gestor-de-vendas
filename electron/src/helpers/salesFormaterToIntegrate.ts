import { PaymentType } from "../models/enums/paymentType";
import { SaleDto, StoreCashDto } from "../models/gestor";

export const salesFormaterToIntegrate = (
  payload: SaleDto | SaleDto[],
  storeCash: StoreCashDto
) => {
  if (Array.isArray(payload)) {
    return payload.map((_payload) => ({
      quantity: _payload.quantity,
      gv_id: _payload.gv_id,
      client_cpf: _payload.client_cpf,
      client_phone: _payload.client_phone,
      client_email: _payload.client_email,
      abstract_sale: _payload.abstract_sale,
      change_amount: _payload.change_amount,
      type: _payload.type,
      discount: _payload.discount,
      cash_id: _payload.cash_id || storeCash.cash_id,
      user_id: _payload.user_id,
      cash_history_id: _payload.cash_history_id || storeCash.history_id,
      nfce_id: _payload.nfce_id,
      nfce_focus_id: _payload.nfce_focus_id,
      nfce_url: _payload.nfce_url,
      cupom: _payload.customerVoucher,
      payments: _payload.payments.map((_payment) => ({
        amount: +_payment.amount,
        type: +_payment.type,
        flag_card:
          _payment.type === PaymentType.CREDITO || _payment.type === PaymentType.DEBITO || _payment.type === PaymentType.TICKET
            ? _payment.flag_card
            : null,
        code_nsu: _payment.code_nsu ? _payment.code_nsu : null,
        cnpj_credenciadora: _payment.cnpj_credenciadora ? _payment.cnpj_credenciadora : null,
        numero_autorizacao: _payment.numero_autorizacao ? _payment.numero_autorizacao : null,
        tef_status_payment: _payment.tef_status_payment,
        cnpj_beneficiario: _payment.cnpj_beneficiario ? _payment.cnpj_beneficiario : null,
        id_terminal_pagamento: _payment.id_terminal_pagamento ? _payment.id_terminal_pagamento : null
      })),
      items: _payload.items.map((_item) => ({
        name: _item.product.name,
        product_id: _item.product.id,
        category_id: _item.product.category.id,
        product_store_id: _item.store_product_id,
        price_unit: _item.storeProduct.price_unit,
        quantity: _item.quantity,
        total: _item.total,
        sale_id: _payload.id,
        created_at: _item.created_at,
        deleted_at: _item.deleted_at,
        store_product_id: _item.store_product_id,
        storeProduct: {
          id: _item.storeProduct.id,
          product_id: _item.storeProduct.product_id,
          store_id: _item.storeProduct.store_id,
          price_unit: _item.storeProduct.price_unit,
          permission: _item.storeProduct.permission,
          price_sell: _item.storeProduct.price_sell,
          unity: _item.storeProduct.unity,
          unity_taxable: _item.storeProduct.unity_taxable,
          price_taxable: _item.storeProduct.price_taxable,
          cfop: _item.storeProduct.cfop,
          icms_origin: _item.storeProduct.icms_origin,
          icms_tax_situation: _item.storeProduct.icms_tax_situation,
          tax_regime: _item.storeProduct.tax_regime,
          pis_tax_situation: _item.storeProduct.pis_tax_situation,
          pis_aliquot_value: _item.storeProduct.pis_aliquot_value,
          pis_aliquot_percentage: _item.storeProduct.pis_aliquot_percentage,
          cofins_tax_situation: _item.storeProduct.cofins_tax_situation,
          cofins_aliquot_value: _item.storeProduct.cofins_aliquot_value,
          cofins_aliquot_percentage:
            _item.storeProduct.cofins_aliquot_percentage,
          additional_information: _item.storeProduct.additional_information,
          price_permission: _item.storeProduct.price_permission,
          icms_aliquot_percentage: _item.storeProduct.icms_aliquot_percentage,
          bc_icms: _item.storeProduct.bc_icms,
          bc_icms_st: _item.storeProduct.bc_icms_st,
          redution_icms: _item.storeProduct.redution_icms,
          aliquot_final_consumer: _item.storeProduct.aliquot_final_consumer,
          quantity: _item.storeProduct.quantity,
          cest: _item.storeProduct.cest,
          created_at: _item.storeProduct.created_at,
          deleted_at: _item.storeProduct.deleted_at,
        },
        product: {
          id: _item.product.id,
          name: _item.product.name,
          category_id: _item.product.category.id,
          category: {
            id: _item.product.category.id,
            name: _item.product.category.name,
            sort: _item.product.category.sort,
            created_at: _item.product.category.created_at,
            deleted_at: _item.product.category.deleted_at,
          },
          product_store_id: _item.store_product_id,
          price_buy: _item.product.price_buy,
          permission_store: _item.product.permission_store,
          permission_order: _item.product.permission_order,
          permission_purchase: _item.product.permission_purchase,
          cod_product: _item.product.cod_product,
          cod_ncm: _item.product.cod_ncm,
          brand: _item.product.brand,
          unity: _item.product.unity,
          weight: _item.product.weight,
          price_sell: _item.product.price_sell,
          description: _item.product.description,
          created_at: _item.product.created_at,
          deleted_at: _item.product.deleted_at,
        },
        update_stock: _item.update_stock,
      })),
      ref: _payload.ref,
      created_at: _payload.created_at,
      cpf_used_club: _payload.cpf_used_club,
      cpf_used_nfce: _payload.cpf_used_nfce
    }));
  } else {
    const response = {
      quantity: payload.quantity,
      gv_id: payload.gv_id,
      client_cpf: payload.client_cpf,
      client_phone: payload.client_phone,
      client_email: payload.client_email,
      cash_id: payload.cash_id || storeCash.cash_id,
      cash_history_id: payload.cash_history_id || storeCash.history_id,
      abstract_sale: payload.abstract_sale,
      change_amount: payload.change_amount,
      type: payload.type,
      discount: payload.discount,
      user_id: payload.user_id,
      nfce_id: payload.nfce_id,
      nfce_focus_id: payload.nfce_focus_id,
      cupom: payload.customerVoucher,
      nfce_url: payload.nfce_url,
      payments: payload.payments.map((_payment) => ({
        amount: +_payment.amount,
        type: +_payment.type,
        flag_card:
          _payment.type === PaymentType.DEBITO || _payment.type === PaymentType.CREDITO || _payment.type === PaymentType.TICKET
            ? _payment.flag_card
            : null,
        code_nsu: _payment.code_nsu ? _payment.code_nsu : null,
        cnpj_credenciadora: _payment.cnpj_credenciadora ? _payment.cnpj_credenciadora : null,
        numero_autorizacao: _payment.numero_autorizacao ? _payment.numero_autorizacao : null,
        tef_status_payment: _payment.tef_status_payment,
        cnpj_beneficiario: _payment.cnpj_beneficiario ? _payment.cnpj_beneficiario : null,
        id_terminal_pagamento: _payment.id_terminal_pagamento ? _payment.id_terminal_pagamento : null
      })),
      items: payload.items.map((_item) => ({
        name: _item.product.name,
        product_id: _item.product.id,
        category_id: _item.product.category.id,
        product_store_id: _item.store_product_id,
        price_unit: _item.storeProduct.price_unit,
        quantity: _item.quantity,
        total: _item.total,
        sale_id: payload.id,
        created_at: _item.created_at,
        deleted_at: _item.deleted_at,
        store_product_id: _item.store_product_id,
        storeProduct: {
          id: _item.storeProduct.id,
          product_id: _item.storeProduct.product_id,
          store_id: _item.storeProduct.store_id,
          price_unit: _item.storeProduct.price_unit,
          permission: _item.storeProduct.permission,
          price_sell: _item.storeProduct.price_sell,
          unity: _item.storeProduct.unity,
          unity_taxable: _item.storeProduct.unity_taxable,
          price_taxable: _item.storeProduct.price_taxable,
          cfop: _item.storeProduct.cfop,
          icms_origin: _item.storeProduct.icms_origin,
          icms_tax_situation: _item.storeProduct.icms_tax_situation,
          tax_regime: _item.storeProduct.tax_regime,
          pis_tax_situation: _item.storeProduct.pis_tax_situation,
          pis_aliquot_value: _item.storeProduct.pis_aliquot_value,
          pis_aliquot_percentage: _item.storeProduct.pis_aliquot_percentage,
          cofins_tax_situation: _item.storeProduct.cofins_tax_situation,
          cofins_aliquot_value: _item.storeProduct.cofins_aliquot_value,
          cofins_aliquot_percentage:
            _item.storeProduct.cofins_aliquot_percentage,
          additional_information: _item.storeProduct.additional_information,
          price_permission: _item.storeProduct.price_permission,
          icms_aliquot_percentage: _item.storeProduct.icms_aliquot_percentage,
          bc_icms: _item.storeProduct.bc_icms,
          bc_icms_st: _item.storeProduct.bc_icms_st,
          redution_icms: _item.storeProduct.redution_icms,
          aliquot_final_consumer: _item.storeProduct.aliquot_final_consumer,
          quantity: _item.storeProduct.quantity,
          created_at: _item.storeProduct.created_at,
          deleted_at: _item.storeProduct.deleted_at,
        },
        product: {
          id: _item.product.id,
          name: _item.product.name,
          category_id: _item.product.category.id,
          category: {
            id: _item.product.category.id,
            name: _item.product.category.name,
            sort: _item.product.category.sort,
            created_at: _item.product.category.created_at,
            deleted_at: _item.product.category.deleted_at,
          },
          product_store_id: _item.store_product_id,
          price_buy: _item.product.price_buy,
          permission_store: _item.product.permission_store,
          permission_order: _item.product.permission_order,
          permission_purchase: _item.product.permission_purchase,
          cod_product: _item.product.cod_product,
          cod_ncm: _item.product.cod_ncm,
          brand: _item.product.brand,
          unity: _item.product.unity,
          weight: _item.product.weight,
          price_sell: _item.product.price_sell,
          description: _item.product.description,
          created_at: _item.product.created_at,
          deleted_at: _item.product.deleted_at,
        },
        update_stock: _item.update_stock,
      })),
      ref: payload.ref,
      created_at: payload.created_at,
      cpf_used_club: payload.cpf_used_club,
      cpf_used_nfce: payload.cpf_used_nfce
    };
    return [response];
  }
};
