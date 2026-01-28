export default function Loading() {
  return (
    <div className="p-8 space-y-4">
      <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}