import { CONTENT } from "@/constants/content";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LayersPlus } from "lucide-react";

export function Header() {
  return (
    <header className="flex-none min-h-14 border-b border-border flex items-center justify-between px-4 sm:px-6 py-2 bg-background">
      <div className="flex items-center gap-3">
        <LayersPlus className="h-5 w-5 text-primary hidden sm:block" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            {CONTENT.main.title}
          </h1>
          <Badge variant="secondary" className="text-xs font-normal w-fit">
            {CONTENT.main.subtitle}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Separator orientation="vertical" className="h-6 hidden sm:block" />
        <ThemeToggle />
      </div>
    </header>
  );
}
