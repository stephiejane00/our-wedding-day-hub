const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const constantContactAccessToken = defineSecret("CONSTANT_CONTACT_ACCESS_TOKEN");
const constantContactVendorListId = defineSecret("CONSTANT_CONTACT_VENDOR_LIST_ID");
const constantContactCoupleListId = defineSecret("CONSTANT_CONTACT_COUPLE_LIST_ID");

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
      success_url: "https://ourweddingdayhub.com/signup-success.html?paid=true&session_id={CHECKOUT_SESSION_ID}",
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

    const response = await fetch("https://api.cc.email/v3/contacts/sign_up_form", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${constantContactAccessToken.value()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email_address: email,
        first_name: name || "",
        list_memberships: [listId]
      })
    });

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
      constantContactAccessToken,
      constantContactVendorListId,
      constantContactCoupleListId
    ]
  },
  app
);
