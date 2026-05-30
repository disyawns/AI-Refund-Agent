export interface AgentLog {
  time: string;
  message: string;
}

export interface RefundResponse {
  status: string;
  message?: string;
  logs?: AgentLog[];
}