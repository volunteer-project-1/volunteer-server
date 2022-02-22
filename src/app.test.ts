import request from "supertest";
import { startApp } from "./app";

describe("index test", () => {
  it("GET /health return {200, 'ok'}", async () => {
    const res = await request(await startApp()).get("/health");

    expect(res.status).toBe(200);
    expect(res.text).toBe("ok");
  });
});
