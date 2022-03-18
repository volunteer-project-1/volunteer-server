import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";

beforeAll(async () => {
  await Container.get(MySQL).connect();
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await Container.get(MySQL).closePool();
});

describe("updateResumeInfo test", () => {
  const URL = "/api/v1/resume";
  const concatURL = "upload";

  it("POST '/', If File uploaded, return 200", async () => {
    const buffer = Buffer.from("some data");

    const res = await request(await startApp())
      .post(`${URL}/${concatURL}`)
      .attach("url", buffer, "custom_file_name.mp4")
      .set("Content-Type", "multipart/form-data");

    expect(res.status).toBe(200);
  });
});
