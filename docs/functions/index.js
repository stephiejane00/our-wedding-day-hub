const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

admin.initializeApp();

const db = admin.firestore();

const stripeSecret = defineSecret("STRIPE_SECRET_KEY");

const constantContactClientSecret = defineSecret("CONSTANT_CONTACT_CLIENT_SECRET");
const constantContactRefreshToken = defineSecret("CONSTANT_CONTACT_REFRESH_TOKEN");
const constantContactVendorListId = defineSecret("CONSTANT_CONTACT_VENDOR_LIST_ID");
const constantContactCoupleListId = defineSecret("CONSTANT_CONTACT_COUPLE_LIST_ID");

const CONSTANT_CONTACT_CLIENT_ID = "b5586c07-4edd-442e-af03-cba30ffa9f1a";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const PRICE_IDS = {
  setup: "price_1TGpBgIfhRO5Mn4BGzLRUsB9",
  classic: "price_1TGo2OIfhRO5Mn4BUEpXk9p8",
  signature: "price_1TGp0cIfhRO5Mn4BUIferLow",
  elite: "price_1TGp1ZIfhRO5Mn4BqfzdgLud",
  platinum: "price_1TGp2pIfhRO5Mn4B3lrSq0Dj"
};

async function getConstantContactAccessToken() {
  const tokenRef = db.collection("constantContact").doc("tokens");
  const tokenSnap = await tokenRef.get();
  const tokenData = tokenSnap.exists ? tokenSnap.data() : {};

  const now = Date.now();

  if (
    tokenData.accessToken &&
    tokenData.expiresAt &&
    tokenData.expiresAt > now + 5 * 60 * 1000
  ) {
    return tokenData.accessToken;
  }

  const refreshToken =
    tokenData.refreshToken || constantContactRefreshToken.value();

  const basicAuth = Buffer.from(
    `${CONSTANT_CONTACT_CLIENT_ID}:${constantContactClientSecret.value()}`
  ).toString("base64");

  const response = await fetch(
    "https://authz.constantcontact.com/oauth2/default/v1/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Constant Contact token refresh error:", data);
    throw new Error("Could not refresh Constant Contact token.");
  }

  await tokenRef.set(
    {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresAt: now + data.expires_in * 1000,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return data.access_token;
}

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !PRICE_IDS[plan]) {
      return res.status(400).json({ error: "Invalid plan selected." });
    }

    const stripe = new Stripe(stripeSecret.value());

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: PRICE_IDS.setup, quantity: 1 },
        { price: PRICE_IDS[plan], quantity: 1 }
      ],
      success_url:
        "https://ourweddingdayhub.com/signup-success.html?paid=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://ourweddingdayhub.com/signup.html",
      allow_promotion_codes: true
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "Unable to create checkout session." });
  }
});

app.post("/add-to-constant-contact", async (req, res) => {
  try {
    const { email, name, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ error: "Missing email or account type." });
    }

    const listId =
      type === "vendor"
        ? constantContactVendorListId.value()
        : constantContactCoupleListId.value();

    const accessToken = await getConstantContactAccessToken();

    const response = await fetch(
      "https://api.cc.email/v3/contacts/sign_up_form",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email_address: {
            address: email,
            permission_to_send: "implicit"
          },
          first_name: name || "",
          list_memberships: [listId]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Constant Contact error:", data);
      return res.status(400).json({
        error: "Unable to add contact to Constant Contact.",
        details: data
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Constant Contact function error:", error);
    res.status(500).json({ error: "Unable to add contact to Constant Contact." });
  }
});

exports.api = onRequest(
  {
    secrets: [
      stripeSecret,
      constantContactClientSecret,
      constantContactRefreshToken,
      constantContactVendorListId,
      constantContactCoupleListId
    ]
  },
  app
);
