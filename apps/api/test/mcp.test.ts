import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";

describe("MCP", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATA_DIR = `${process.cwd()}/../../data`;
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication({ rawBody: true });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("tools/call get_crafting_recipes returns recipe meta", async () => {
    const res = await request(app.getHttpServer())
      .post("/mcp")
      .set("Accept", "application/json, text/event-stream")
      .send({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "get_crafting_recipes", arguments: {} },
      });

    expect(res.status).toBeLessThan(500);
    const bodyText = typeof res.text === "string" ? res.text : JSON.stringify(res.body);
    expect(bodyText).toContain("nwdb_recipe_id");
    expect(bodyText).toContain("iron_longsword");
  });
});