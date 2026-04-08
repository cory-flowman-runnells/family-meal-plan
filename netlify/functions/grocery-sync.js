const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  const store = getStore({
    name: "grocery",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });

  if (event.httpMethod === "GET") {
    const data = await store.get("checks", { type: "json" }).catch(() => null);
    return { statusCode: 200, headers, body: JSON.stringify(data ?? {}) };
  }

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body || "{}");
    await store.set("checks", JSON.stringify(body));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: "Method not allowed" };
};
