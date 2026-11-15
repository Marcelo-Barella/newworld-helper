import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import { DataService } from "../data/data.service";

@Injectable()
export class McpService implements OnModuleInit {
  private readonly logger = new Logger(McpService.name);
  readonly server: McpServer;
  readonly transport: StreamableHTTPServerTransport;

  constructor(private readonly data: DataService) {
    this.server = new McpServer({
      name: "newworld-helper",
      version: "0.1.0",
    });
    this.transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
  }

  async onModuleInit(): Promise<void> {
    this.registerFarmingTools();
    this.registerCraftingTools();
    this.registerAzothTools();
    this.registerLevelingTools();
    await this.server.connect(this.transport);
    this.logger.log("MCP tools registered (read-only list/get per dataset)");
  }

  handleRequest(req: IncomingMessage, res: ServerResponse, body: unknown): Promise<void> {
    return this.transport.handleRequest(req, res, body);
  }

  private registerFarmingTools(): void {
    this.server.tool("get_farming_routes", "Full farming routes export with meta.", {}, async () => ({
      content: [{ type: "text", text: JSON.stringify(this.data.getFarmingRoutes(), null, 2) }],
    }));

    this.server.tool(
      "list_farming_routes",
      "Farming route ids, names, and regions.",
      {},
      async () => {
        const file = this.data.getFarmingRoutes();
        const routes = file.routes.map((route) => ({
          id: route.id,
          name: route.name,
          region: route.region,
          materials: route.materials,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify({ meta: file.meta, routes }, null, 2) }],
        };
      },
    );

    registerGetById(this.server, "get_farming_route", "Farming route by id.", (id) =>
      this.data.getFarmingRoute(id),
    );
  }

  private registerCraftingTools(): void {
    this.server.tool("get_crafting_recipes", "Full crafting recipes with meta.", {}, async () => ({
      content: [{ type: "text", text: JSON.stringify(this.data.getCraftingRecipes(), null, 2) }],
    }));

    this.server.tool(
      "list_crafting_recipes",
      "Crafting recipe ids and names.",
      {},
      async () => {
        const payload = this.data.getCraftingRecipes();
        const records = payload.records.map((recipe) => ({
          id: recipe.id,
          name: recipe.name,
          tradeskill: recipe.tradeskill,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify({ meta: payload.meta, records }, null, 2) }],
        };
      },
    );

    registerGetById(this.server, "get_crafting_recipe", "Crafting recipe by id.", (id) =>
      this.data.getCraftingRecipe(id),
    );
  }

  private registerAzothTools(): void {
    this.server.tool("get_azoth", "Full azoth currency dataset with meta.", {}, async () => ({
      content: [{ type: "text", text: JSON.stringify(this.data.getAzoth(), null, 2) }],
    }));

    this.server.tool(
      "list_azoth_costs",
      "Azoth spend cost ids and confidence.",
      {},
      async () => {
        const doc = this.data.getAzoth();
        const costs = doc.costs.map((cost) => ({
          id: cost.id,
          name: cost.name,
          amount: cost.amount,
          confidence: cost.confidence,
          outdated_risk: cost.outdated_risk,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify({ meta: doc.meta, costs }, null, 2) }],
        };
      },
    );

    registerGetById(this.server, "get_azoth_cost", "Azoth cost entry by id.", (id) =>
      this.data.getAzothCost(id),
    );
  }

  private registerLevelingTools(): void {
    this.server.tool("get_leveling", "Full NW Leveling export (metadata + steps).", {}, async () => ({
      content: [{ type: "text", text: JSON.stringify(this.data.getLeveling(), null, 2) }],
    }));

    this.server.tool(
      "list_leveling_steps",
      "Leveling step ids with level ranges.",
      {},
      async () => {
        const doc = this.data.getLeveling();
        const steps = doc.steps.map((step) => ({
          step: step.step,
          level_range: step.level_range,
          zone: step.zone,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify({ steps }, null, 2) }],
        };
      },
    );

    const getStep = this.server.tool.bind(this.server) as (
      name: string,
      description: string,
      shape: { step_id: z.ZodString },
      handler: (args: { step_id: string }) => Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>,
    ) => void;

    getStep(
      "get_leveling_step",
      "Leveling step by id.",
      { step_id: z.string().describe("Step id from the export") },
      async (args: { step_id: string }) => {
        const step = this.data.getLevelingStep(args.step_id);
        if (!step) {
          return {
            isError: true,
            content: [
              { type: "text", text: JSON.stringify({ error: "not_found", step_id: args.step_id }) },
            ],
          };
        }
        return {
          content: [{ type: "text", text: JSON.stringify({ step }, null, 2) }],
        };
      },
    );
  }
}

function registerGetById(
  server: McpServer,
  name: string,
  description: string,
  lookup: (id: string) => unknown,
): void {
  const callTool = server.tool.bind(server) as (
    toolName: string,
    toolDescription: string,
    shape: { id: z.ZodString },
    handler: (args: { id: string }) => Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>,
  ) => void;

  callTool(name, description, { id: z.string().describe("Record id") }, async (args: { id: string }) => {
    const record = lookup(args.id);
    if (!record) {
      return {
        isError: true,
        content: [{ type: "text", text: JSON.stringify({ error: "not_found", id: args.id }) }],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify({ record }, null, 2) }],
    };
  });
}