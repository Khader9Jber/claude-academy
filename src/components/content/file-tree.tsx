import { FolderOpen, File } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeItem } from "@/types";

interface FileTreeProps {
  items: TreeItem[];
}

function TreeNode({ item, depth = 0 }: { item: TreeItem; depth?: number }) {
  const isFolder = item.type === "folder";
  const Icon = isFolder ? FolderOpen : File;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1 font-mono text-sm",
          item.highlight && "text-accent font-medium"
        )}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {/* Indent guide lines */}
        {depth > 0 && (
          <span className="text-border select-none" aria-hidden>
            {"\u2514\u2500"}
          </span>
        )}

        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isFolder ? "text-accent" : "text-muted",
            item.highlight && "text-accent"
          )}
        />
        <span
          className={cn(
            isFolder ? "text-text" : "text-muted",
            item.highlight && "text-accent"
          )}
        >
          {item.name}
        </span>
      </div>

      {isFolder && item.children && (
        <div className="relative">
          {/* Vertical connecting line */}
          <div
            className="absolute left-[9px] top-0 bottom-0 w-px bg-border"
            style={{ marginLeft: `${depth * 20}px` }}
            aria-hidden
          />
          {item.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ items }: FileTreeProps) {
  return (
    <div className="my-4 rounded-lg border border-border bg-surface p-4 font-mono">
      {items.map((item, i) => (
        <TreeNode key={`${item.name}-${i}`} item={item} />
      ))}
    </div>
  );
}
