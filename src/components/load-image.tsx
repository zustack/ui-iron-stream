import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadImage({ src }: { src: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-1">
      <Skeleton
        style={{ display: !loading ? "none" : "block" }}
        className="w-full h-full rounded-[0.75rem]"
      />
      <img
        src={src}
        alt={""}
        className="rounded-[0.75rem]"
        style={{ display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
