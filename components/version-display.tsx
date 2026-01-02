import { APP_VERSION } from "@/lib/version";

export function VersionDisplay() {
  return (
    <div className="fixed bottom-2 left-2 text-xs text-gray-400 opacity-30 hover:opacity-100 transition-opacity">
      v{APP_VERSION}
    </div>
  );
}
