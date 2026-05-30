import { AgentLog } from "@/types/refund";

interface Props {
  logs: AgentLog[];
}

export default function AgentActivity({ logs }: Props) {
  return (
    <div className="space-y-2">
      {logs.length === 0 ? (
        <div className="text-sm text-gray-500">
          No activity yet. Submit a refund request.
        </div>
      ) : (
        logs.map((log, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-3 py-1 text-sm"
          >
            {log.message}
          </div>
        ))
      )}
    </div>
  );
}