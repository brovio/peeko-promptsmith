import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, Save, Trash2 } from "lucide-react";

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface LogSidebarProps {
  logs: LogEntry[];
  onClear?: () => void;
}

export function LogSidebar({ logs, onClear }: LogSidebarProps) {
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (logs.length > 0) {
      setOpen(true);
    }
  }, [logs, setOpen]);

  const handleSaveLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleString()}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-logs-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Process Logs</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveLogs}
            disabled={logs.length === 0}
            title="Save logs"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            disabled={logs.length === 0}
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)] px-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                log.type === 'error' 
                  ? 'bg-destructive/10 text-destructive' 
                  : log.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-muted'
              }`}
            >
              <div className="text-xs opacity-70">
                {log.timestamp.toLocaleTimeString()}
              </div>
              <div className="text-sm">{log.message}</div>
            </div>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarTrigger />
    </Sidebar>
  );
}