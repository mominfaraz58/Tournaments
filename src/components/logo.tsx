import { Flame } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
      <Flame className="size-6 text-primary transition-all group-data-[collapsible=icon]:size-7" />
      <h1 className="text-xl font-bold font-headline transition-all duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-translate-x-4 group-data-[collapsible=icon]:w-0">
        Victory Fire
      </h1>
    </div>
  );
}
