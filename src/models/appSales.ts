export type AppSale = {
  id: number;
  store_id: number;
  codigo_pedido: number;
  tipo_entrega: number;
  valor_pedido: number;
  valor_produtos: number;
  valor_entrega: number;
  data_pedido: string;
  tipo_pagamento: number;
  data_conclusao: string;
  integrated: boolean;
  created_at: string;
  deleted_at: string;
};
