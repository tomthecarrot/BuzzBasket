export const PORT: number = parseInt(process.env.BUZZBASKET_PORT || "80");
export const twilioAccountSid: string|undefined = process.env.BUZZBASKET_TWILIO_ACCOUNT_SID;
export const twilioAuthToken: string|undefined = process.env.BUZZBASKET_TWILIO_AUTH_TOKEN;

export const defaultRecipient: string = process.env.BUZZBASKET_DEFAULT_RECIPIENT || "0";
export const merchantName: string = process.env.BUZZBASKET_MERCHANT_NAME || "Your friendly local business";