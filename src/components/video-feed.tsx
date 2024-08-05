import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "../assets/image.png";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

export default function VideoFeed() {
  return (
    <>
      <form className="ml-auto flex-1 sm:flex-initial mb-4 mr-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Busca un video..."
            className="pl-8 w-full"
          />
        </div>
      </form>
      <ScrollArea className="h-[715px] w-full pr-4">
        <div className="mb-2 p-1 hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
        transition-colors duration-200">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[0.75rem]">
              <img src={Image} alt="" className="w-full" />
              <div className="absolute bottom-0 left-0 w-[70%] h-[6px] bg-indigo-600 rounded-b-[0.75rem]"></div>
            </div>
          </div>
          <div className="flex-col mx-2">
            <h4 className="font-semibold mt-2">1- go & htmx into</h4>
            <p className="text-sm text-zinc-200 mt-2">
              Some description about the video or something else here and there
              and now and then
            </p>
            <div className="flex gap-2 mt-2">
              <p className="text-sm text-zinc-400">20 minutos</p>
              <p className="text-sm text-zinc-400">•</p>
              <p className="text-sm text-zinc-400">42069 views</p>
            </div>
          </div>
        </div>

        <div className="mb-2 p-1 hover:bg-zinc-800 rounded-[0.75rem] cursor-pointer 
        transition-colors duration-200 border border-indigo-600">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[0.75rem]">
              <img src={Image} alt="" className="w-full" />
              <div className="absolute bottom-0 left-0 w-[0%] h-[6px] bg-indigo-600 rounded-b-[0.75rem]"></div>
            </div>
          </div>
          <div className="flex-col mx-2">
            <h4 className="font-semibold mt-2">1- go & htmx into</h4>
            <p className="text-sm text-zinc-200 mt-2">
              Some description about the video or something else here and there
              and now and then
            </p>
            <div className="flex gap-2 mt-2">
              <p className="text-sm text-zinc-400">20 minutos</p>
              <p className="text-sm text-zinc-400">•</p>
              <p className="text-sm text-zinc-400">42069 views</p>
            </div>
          </div>
        </div>

      </ScrollArea>
    </>
  );
}
