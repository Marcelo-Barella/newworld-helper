import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  type AzothCost,
  type AzothFile,
  buildCraftingRecipesMeta,
  type CraftingRecipe,
  type CraftingRecipesFile,
  DatasetKind,
  datasetFileNames,
  type FarmingRoute,
  type FarmingRoutesFile,
  type LevelingFile,
  type LevelingStep,
  levelingStepId,
  validateDatasetFile,
} from "@newworld-helper/shared";
import { resolveDataDir } from "../config";

@Injectable()
export class DataService implements OnModuleInit {
  private readonly logger = new Logger(DataService.name);
  private readonly dataDir = resolveDataDir();
  private farmingRoutesFile: FarmingRoutesFile | null = null;
  private craftingRecipes: CraftingRecipesFile = [];
  private azoth: AzothFile | null = null;
  private leveling: LevelingFile | null = null;

  async onModuleInit(): Promise<void> {
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const kinds = Object.keys(datasetFileNames) as DatasetKind[];
    for (const kind of kinds) {
      const filePath = path.join(this.dataDir, datasetFileNames[kind]);
      const raw = await readFile(filePath, "utf8");
      const json: unknown = JSON.parse(raw);
      switch (kind) {
        case DatasetKind.Leveling: {
          const parsed = validateDatasetFile(kind, json);
          this.leveling = parsed;
          this.logger.log(`Loaded leveling: ${this.leveling.steps.length} steps from ${filePath}`);
          break;
        }
        case DatasetKind.FarmingRoutes: {
          const parsed = validateDatasetFile(kind, json);
          this.farmingRoutesFile = parsed;
          this.logger.log(
            `Loaded farming-routes: ${this.farmingRoutesFile.routes.length} routes from ${filePath}`,
          );
          break;
        }
        case DatasetKind.CraftingRecipes: {
          const parsed = validateDatasetFile(kind, json);
          this.craftingRecipes = parsed;
          this.logger.log(`Loaded crafting-recipes: ${this.craftingRecipes.length} records from ${filePath}`);
          break;
        }
        case DatasetKind.Azoth: {
          const parsed = validateDatasetFile(kind, json);
          this.azoth = parsed;
          this.logger.log(
            `Loaded azoth: ${this.azoth.costs.length} costs, ${this.azoth.earn.length} earn from ${filePath}`,
          );
          break;
        }
      }
    }
  }

  getFarmingRoutes(): FarmingRoutesFile {
    if (!this.farmingRoutesFile) {
      throw new Error("Farming routes dataset not loaded");
    }
    return this.farmingRoutesFile;
  }

  getFarmingRoute(id: string): FarmingRoute | undefined {
    return this.getFarmingRoutes().routes.find((route) => route.id === id);
  }

  getCraftingRecipes() {
    return {
      meta: buildCraftingRecipesMeta(this.craftingRecipes),
      records: this.craftingRecipes,
    };
  }

  getCraftingRecipe(id: string): CraftingRecipe | undefined {
    return this.craftingRecipes.find((recipe) => recipe.id === id);
  }

  getAzoth(): AzothFile {
    if (!this.azoth) {
      throw new Error("Azoth dataset not loaded");
    }
    return this.azoth;
  }

  getAzothCost(id: string): AzothCost | undefined {
    return this.getAzoth().costs.find((cost) => cost.id === id);
  }

  getLeveling(): LevelingFile {
    if (!this.leveling) {
      throw new Error("Leveling dataset not loaded");
    }
    return this.leveling;
  }

  getLevelingStep(stepId: string): LevelingStep | undefined {
    return this.getLeveling().steps.find((step) => levelingStepId(step) === stepId);
  }
}