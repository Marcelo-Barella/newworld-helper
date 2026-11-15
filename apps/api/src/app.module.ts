import { Module } from "@nestjs/common";
import { DataModule } from "./data/data.module";
import { DatasetsController } from "./datasets/datasets.controller";
import { HealthController } from "./health/health.controller";
import { McpModule } from "./mcp/mcp.module";

@Module({
  imports: [DataModule, McpModule],
  controllers: [HealthController, DatasetsController],
})
export class AppModule {}