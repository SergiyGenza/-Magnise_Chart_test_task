require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.listen(port, () => {
  console.log(`Node.js proxy server listening at http://localhost:${port}`);
});
