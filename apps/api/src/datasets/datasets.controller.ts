import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { DataService } from "../data/data.service";

@Controller()
export class DatasetsController {
  constructor(private readonly data: DataService) {}

  @Get("farming-routes")
  getFarmingRoutes() {
    return this.data.getFarmingRoutes();
  }

  @Get("farming-routes/:id")
  getFarmingRoute(@Param("id") id: string) {
    const route = this.data.getFarmingRoute(id);
    if (!route) {
      throw new NotFoundException({ message: "Route not found", id, dataset: "farming-routes" });
    }
    return { meta: this.data.getFarmingRoutes().meta, route };
  }

  @Get("leveling")
  getLeveling() {
    return this.data.getLeveling();
  }

  @Get("leveling/steps/:stepId")
  getLevelingStep(@Param("stepId") stepId: string) {
    const step = this.data.getLevelingStep(decodeURIComponent(stepId));
    if (!step) {
      throw new NotFoundException({ message: "Step not found", stepId });
    }
    return { step };
  }

  @Get("crafting-recipes")
  listCraftingRecipes() {
    return this.data.getCraftingRecipes();
  }

  @Get("crafting-recipes/:id")
  getCraftingRecipe(@Param("id") id: string) {
    const record = this.data.getCraftingRecipe(id);
    if (!record) {
      throw new NotFoundException({ message: "Record not found", id, dataset: "crafting-recipes" });
    }
    return { meta: this.data.getCraftingRecipes().meta, record };
  }

  @Get("azoth")
  getAzoth() {
    return this.data.getAzoth();
  }

  @Get("azoth/costs/:id")
  getAzothCost(@Param("id") id: string) {
    const cost = this.data.getAzothCost(id);
    if (!cost) {
      throw new NotFoundException({ message: "Cost not found", id, dataset: "azoth" });
    }
    return { meta: this.data.getAzoth().meta, cost };
  }
}