import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="bg-surface-container-low rounded-md border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-dim">
              <tr>
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="p-4">
                    <Skeleton className="h-4 w-24" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </td>
                  <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
