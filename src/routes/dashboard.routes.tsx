import DashboardHome from "@/features/dashboard/pages/DashboardHome";
import { RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  { index: true, element: <DashboardHome /> },
];