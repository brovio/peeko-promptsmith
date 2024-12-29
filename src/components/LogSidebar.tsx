import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface LogSidebarProps {
  logs: LogEntry[];
}

export function LogSidebar({ logs }: LogSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (logs.length > 0) {
      setIsOpen(true);
    }
  }, [logs]);

  return (
    <Sidebar collapsed={!isOpen}>
      <SidebarHeader className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Process Logs</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
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