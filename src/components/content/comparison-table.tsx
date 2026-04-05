import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonTable({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: ComparisonTableProps) {
  return (
    <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Before column */}
      <div className="rounded-lg border border-red/30 bg-red/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red/20">
            <X className="h-3.5 w-3.5 text-red" />
          </span>
          <span className="text-sm font-semibold text-red">{beforeLabel}</span>
        </div>
        <div className="whitespace-pre-wrap font-mono text-sm text-text/80 leading-relaxed">
          {before}
        </div>
      </div>

      {/* After column */}
      <div className="rounded-lg border border-green/30 bg-green/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green/20">
            <Check className="h-3.5 w-3.5 text-green" />
          </span>
          <span className="text-sm font-semibold text-green">{afterLabel}</span>
        </div>
        <div className="whitespace-pre-wrap font-mono text-sm text-text/80 leading-relaxed">
          {after}
        </div>
      </div>
    </div>
  );
}
