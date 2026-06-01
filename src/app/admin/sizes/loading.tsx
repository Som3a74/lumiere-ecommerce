import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-32" />
      </div>

      <div className="w-full border border-outline-variant/30 overflow-hidden bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
                <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-outline-variant/10">
                  <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-40" /></td>
                  <td className="px-6 py-4 flex justify-end"><Skeleton className="h-6 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
