require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const WebSocket = require("ws");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/token", async (req, res) => {
  const fetch = (await import("node-fetch")).default;

  try {
    const { username, password } = req.body;
    const grant_type = process.env.grant_type;
    const client_id = process.env.client_id;

    const bodyParams = new URLSearchParams();
    bodyParams.append("grant_type", grant_type);
    bodyParams.append("client_id", client_id);
    bodyParams.append("username", username);
    bodyParams.append("password", password);

    const fintachartsTokenUrl = `${process.env.API_BASE_URL}/identity/realms/${process.env.REALM}/protocol/openid-connect/token`;

    const response = await fetch(fintachartsTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Could not parse error response from Fintacharts API",
      }));
      console.error("Error from Fintacharts API:", response.status, errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy server error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.get("/api/instruments", async (req, res) => {
  const fetch = (await import("node-fetch")).default;

  try {
    const { provider, kind, symbol, page, size } = req.query;

    if (!provider || !kind) {
      return res.status(400).json({
        message: "Missing required query parameters: provider and kind",
      });
    }

    const queryParams = new URLSearchParams({
      provider: provider,
      kind: kind,
    });

    if (symbol) queryParams.append("symbol", symbol);
    if (page) queryParams.append("page", page);
    if (size) queryParams.append("size", size);

    const fintachartsInstrumentsUrl = `${
      process.env.API_BASE_URL
    }/api/instruments/v1/instruments?${queryParams.toString()}`;

    const authToken = req.headers.authorization;

    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing." });
    }

    const headers = {
      Authorization: authToken,
      "Content-Type": "application/json",
      Accept: "*/*",
      "Cache-Control": "no-cache",
      "User-Agent": "Node.js-Proxy-Server",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    };

    const response = await fetch(fintachartsInstrumentsUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message:
          "Could not parse error response from Fintacharts Instruments API",
      }));
      console.error(
        "Error from Fintacharts Instruments API:",
        response.status,
        errorData
      );
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy server error for instruments:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.get("/api/bars", async (req, res) => {
  const fetch = (await import("node-fetch")).default;

  try {
    const { instrumentId, provider, interval, periodicity, barsCount } =
      req.query;

    if (!instrumentId || !provider || !interval || !periodicity || !barsCount) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters for bars." });
    }

    const queryParams = new URLSearchParams({
      instrumentId: instrumentId,
      provider: provider,
      interval: interval,
      periodicity: periodicity,
      barsCount: barsCount,
    });

    const fintachartsBarsUrl = `${
      process.env.API_BASE_URL
    }/api/bars/v1/bars/count-back?${queryParams.toString()}`;

    const authToken = req.headers.authorization;

    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing." });
    }

    const headers = {
      Authorization: authToken,
      "Cache-Control": "no-cache",
      Accept: "*/*",
      "User-Agent": "Node.js-Proxy-Server",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    };

    const response = await fetch(fintachartsBarsUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Could not parse error response from Fintacharts Bars API",
      }));
      console.error(
        "Error from Fintacharts Bars API:",
        response.status,
        errorData
      );
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy server error for bars:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Node.js proxy server listening at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server, path: "/ws" });

wss.on("connection", (angularWs, req) => {
  console.log("Angular client connected via WebSocket.");

  let fintachartsWs = null;
  let isAuthenticated = false;

  angularWs.on("message", (message) => {
    const msgStr = message.toString();

    if (!isAuthenticated) {
      try {
        // const parsedOnce = JSON.parse(msgStr);
        // console.log(parsedOnce);
        // const authMessage = JSON.parse(parsedOnce);
        // console.log(authMessage);

        const authMessage = JSON.parse(msgStr);

        if (authMessage.type === "authenticate" && authMessage.token) {
          const authToken = authMessage.token;
          isAuthenticated = true;

          const fintachartsStreamingUrl = `${process.env.WWS_URL}/?token=${authToken}`;
          console.log("fintachartsStreamingUrl", fintachartsStreamingUrl);
          fintachartsWs = new WebSocket(fintachartsStreamingUrl);

          fintachartsWs.onopen = () => {
            console.log("Connected to Fintacharts Streaming API.");
            if (angularWs.readyState === WebSocket.OPEN) {
              angularWs.send(
                JSON.stringify({
                  status: "authenticated",
                  message: "Connected to streaming API",
                })
              );
            }
          };

          fintachartsWs.onmessage = (fintachartsMsg) => {
            if (angularWs.readyState === WebSocket.OPEN) {
              angularWs.send(fintachartsMsg.data);
            }
          };

          fintachartsWs.onerror = (error) => {
            console.error("Fintacharts WebSocket error:", error);
            if (angularWs.readyState === WebSocket.OPEN) {
              angularWs.send(
                JSON.stringify({
                  error: "Fintacharts streaming error",
                  details: error.message,
                })
              );
            }
            angularWs.close();
          };

          fintachartsWs.onclose = (event) => {
            console.log(
              "Disconnected from Fintacharts Streaming API.",
              event.code,
              event.reason
            );
            if (angularWs.readyState === WebSocket.OPEN) {
              angularWs.send(
                JSON.stringify({
                  status: "Fintacharts connection closed",
                  code: event.code,
                  reason: event.reason,
                })
              );
            }
            angularWs.close();
          };
        } else {
          console.warn("Invalid authentication message from Angular client.");
          angularWs.close(
            1008,
            "Authentication failed: Invalid message format or missing token."
          );
        }
      } catch (e) {
        console.error("Error parsing authentication message:", e);
        angularWs.close(1008, "Authentication failed: Invalid JSON.");
      }
    } else {
      if (fintachartsWs && fintachartsWs.readyState === WebSocket.OPEN) {
        fintachartsWs.send(msgStr);
      } else {
        console.warn(
          "Fintacharts WebSocket not open or not authenticated, cannot forward message."
        );
        angularWs.send(
          JSON.stringify({
            error: "Fintacharts connection not ready or not authenticated.",
          })
        );
      }
    }
  });

  angularWs.on("close", () => {
    console.log("Angular client disconnected from WebSocket.");
    if (fintachartsWs && fintachartsWs.readyState === WebSocket.OPEN) {
      fintachartsWs.close();
    }
  });

  angularWs.on("error", (error) => {
    console.error("Angular WebSocket error:", error);
    if (fintachartsWs && fintachartsWs.readyState === WebSocket.OPEN) {
      fintachartsWs.close();
    }
  });
});

console.log("WebSocket proxy server for Fintacharts initialized.");
