export const PORT: number = parseInt(process.env.BUZZBASKET_PORT || "80");
export const twilioAccountSid: string|undefined = process.env.BUZZBASKET_TWILIO_ACCOUNT_SID;
export const twilioAuthToken: string|undefined = process.env.BUZZBASKET_TWILIO_AUTH_TOKEN;

export const defaultRecipient: string = process.env.BUZZBASKET_DEFAULT_RECIPIENT || "0";
export const merchantName: string = process.env.BUZZBASKET_MERCHANT_NAME || "Your friendly local business";

export const phraseInputs: Map<string, string> = new Map([
    ["hello", "hello"],
    ["hey", "hello"],
    ["hi", "hello"],
    ["sup", "hello"],
    ["order", "order"],
    ["find", "order"],
    ["eat", "order"],
    ["have", "order"],
    ["want", "order"],
    ["try", "order"],
    ["please", "please"],
    ["pls", "please"],
    ["plz", "please"],
    ["plzz", "please"],
    ["recommend", "recommend"],
    ["recomend", "recommend"],
    ["look", "recommend"],
    ["looking", "recommend"],
    ["for", "recommend"],
    ["seeking", "recommend"],
    ["find", "recommend"],
    ["thank", "thanks"],
    ["you", "thanks"],
    ["thankyou", "thanks"],
    ["cheers", "thanks"]
]);

export const phraseOutputs: Map<string, string> = new Map([
    ["hello", "Hello! Welcome to BuzzBasket 🐝. What shall we find for your basket 🧺 today?"],
    ["thanks", "You're welcome! Have a great day ✨"]
]);