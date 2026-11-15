import { All, Controller, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { McpService } from "./mcp.service";

@Controller()
export class McpController {
  constructor(private readonly mcp: McpService) {}

  @All("mcp")
  async handleMcp(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.mcp.handleRequest(req, res, req.body);
  }
}