import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";

describe("API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATA_DIR = `${process.cwd()}/../../data`;
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/v1/health", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/health").expect(200);
    expect(res.body.ok).toBe(true);
  });

  it("GET /api/v1/leveling returns 15 steps", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/leveling").expect(200);
    expect(res.body.steps).toHaveLength(15);
    expect(res.body.sheet_url).toContain("docs.google.com");
  });

  it("GET /api/v1/farming-routes returns meta and 61 routes", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/farming-routes").expect(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.routes).toHaveLength(61);
  });

  it("GET /api/v1/crafting-recipes returns meta and 44 records", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/crafting-recipes").expect(200);
    expect(res.body.meta.record_count).toBe(44);
    expect(res.body.records).toHaveLength(44);
  });

  it("GET /api/v1/azoth returns costs with meta", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/azoth").expect(200);
    expect(res.body.meta).toBeDefined();
    expect(res.body.costs).toHaveLength(16);
  });
});