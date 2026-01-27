import { Header } from "./Header";

export function Layout() {
  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">//</div>
    </div>
  );
}
