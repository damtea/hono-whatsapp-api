import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { env } from "hono/adapter";
import z from "zod";
import { TWhatsappSuccessResponse, TWhatsappWebhookPayload } from "./types";
import dayjs from "dayjs";

const app = new Hono();

const postSchema = z.object({
  mobile_number: z.string().length(10),
});

app.use(cors());
app.use(prettyJSON());
app.use("/api/*", logger());
app
  .basePath("/api")
  .post("/send-message", zValidator("json", postSchema), async (c) => {
    const { WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN, WA_EXAMPLE_TEMPLATE } = env(c);
    const phoneNumberId = WA_PHONE_NUMBER_ID;
    const accessToken = WA_ACCESS_TOKEN;
    const templateName = WA_EXAMPLE_TEMPLATE;
    const baseURL = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;

    const { mobile_number } = c.req.valid("json");
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        type: "template",
        to: `91${mobile_number}`,
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  parameter_name: "client",
                  text: "Example",
                },
                {
                  type: "text",
                  parameter_name: "user_id",
                  text: "My ID",
                },
                {
                  type: "text",
                  parameter_name: "payment_id",
                  text: "pp123",
                },
              ],
            },
          ],
        },
      }),
    });
    if (!response.ok) {
      return c.json(
        { message: "Something went wrong on the whatsapp server site" },
        400
      );
    }
    const result = (await response.json()) as TWhatsappSuccessResponse;
    const sentMessages = result.messages;
    console.log(sentMessages);
    // you can store your message here
    return c.json({
      message: "Success",
      data: result,
    });
  })
  .get("/wa-webhook", async (c) => {
    // for testing and verification when registering your route url to facebook developer webhook
    const { WA_WEBHOOK_VERIFY_TOKEN } = env(c);
    const verifyToken = WA_WEBHOOK_VERIFY_TOKEN;
    const query = c.req.query();

    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"] as string;

    if (mode === "subscribe" && token === verifyToken) {
      return c.text(challenge, 200);
    } else {
      return c.text("Unauthorized", 403); // Unauthorized
    }
  })
  .post("/wa-webhook", async (c) => {
    // receiving every update of sent messages from your account
    const body = (await c.req.json()) as TWhatsappWebhookPayload;
    if (body.object === "whatsapp_business_account") {
      const payload = body.entry[0]?.changes[0]?.value.statuses.at(0);
      const timestamp = dayjs.unix(Number(payload?.timestamp));

      console.log({
        messageId: payload?.id,
        newStatus: payload?.status,
        timestamp: timestamp.format("DD MMMM YYYY hh:mm A"),
      });
    }
    // console.log(body.entry[0].changes[0].value);
    return c.text("EVENT_RECEIVED", 200);
  });

export default app;
