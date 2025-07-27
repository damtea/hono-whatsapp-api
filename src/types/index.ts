export type TWhatsappSuccessResponse = {
  messaging_product: string;
  contacts: {
    input: "string";
    wa_id: "string";
  }[];
  messages: {
    id: string;
    message_status: "accepted";
  }[];
};

export type TWhatsappWebhookPayload = {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        statuses: {
          id: string;
          status: "sent" | "delivered" | "read";
          timestamp: string;
          recipient_id: string;
          category: string;
          field: string;
        }[];
      };
    }[];
  }[];
};
