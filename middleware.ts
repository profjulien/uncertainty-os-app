import { authMiddleware } from "@ai-sdk/next";
import { NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: ["/api/tick"],   // ← no auth check here
});

export const config = {
  matcher: "/((?!_next).*)",     // leave as‑is
};
