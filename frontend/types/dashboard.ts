import { AgentLog } from "./refund";

export interface DashboardResponse {
  status: string;
  message?: string;
  logs?: AgentLog[];
}