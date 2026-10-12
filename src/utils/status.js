// Status do presente: available | reserved | paid | received
export const STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  PAID: 'paid',
  RECEIVED: 'received'
};

export const STATUS_LABELS = {
  available: 'Disponível',
  reserved: 'Reservado',
  paid: 'Pago (conferir)',
  received: 'Recebido'
};

// Docs antigos não têm `status`: deriva de reservedBy
export const getProductStatus = (product) => {
  if (product?.status) return product.status;
  return product?.reservedBy ? STATUS.RESERVED : STATUS.AVAILABLE;
};

export const formatPrice = (price) =>
  typeof price === 'number'
    ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null;
