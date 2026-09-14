export const ORDER_STATUS_TONE: Record<string, "gold" | "black" | "white" | "red"> = {
  RECEBIDO: "white",
  EM_PRODUCAO: "gold",
  ENVIADO: "black",
  FINALIZADO: "gold",
  CANCELADO: "red",
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  RECEBIDO: "Recebido",
  EM_PRODUCAO: "Em Produção",
  ENVIADO: "Enviado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABEL);
