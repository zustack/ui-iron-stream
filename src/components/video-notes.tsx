import { Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

export default function VideoNotes() {
  return (
      <div className="rounded-[0.75rem]">
        <h1 className="text-zinc-300 text-2xl font-bold py-4">Notes</h1>
        <Separator className="my-4" />
        <ScrollArea className="h-[540px] w-full pr-4">
          <div className="hover:bg-zinc-950/30 pr-2 rounded-[0.75rem]">
            <div className="flex justify-between pb-2">
              <p className="text-zinc-200 font-semibold">Bubble Sort</p>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Trash className="h-5 w-5 text-red-500 hover:text-red-600 cursor-pointer" />
                  <Pencil className="h-5 w-5 text-indigo-500 hover:text-indigo-600 cursor-pointer" />
                </div>
                <p className="text-indigo-400">2:45</p>
              </div>
            </div>
            <p className="text-zinc-200">
              La tecnología ha transformado la vida cotidiana de maneras
              inimaginables hace solo unas décadas. Desde la forma en que nos
              comunicamos hasta cómo trabajamos y nos entretenemos, la
              tecnología ha permeado todos los aspectos de nuestra existencia.
              Los dispositivos móviles, como teléfonos inteligentes y tabletas,
              nos permiten estar conectados en cualquier lugar y en cualquier
              momento, lo que facilita la comunicación instantánea y el acceso a
              la información. Además, el auge de las redes sociales ha cambiado
              la manera en que interactuamos con amigos y familiares, creando
              nuevas formas de relaciones humanas. Sin embargo, este avance
              también ha traído consigo desafíos, como la sobrecarga de
              información, la disminución de la privacidad y el aumento de la
              dependencia de la tecnología
            </p>
          </div>

        </ScrollArea>

        <div className="flex gap-2 mt-[25px]">
          <Textarea rows={4} placeholder="Write a note" className="flex-grow" />
          <Button variant="outline" className="self-end">
            Save Note
          </Button>
        </div>
      </div>
  );
}

/*
      <div className="rounded-[0.75rem] pb-4">
        <h1 className="text-zinc-300 text-2xl font-bold">Notes</h1>
        <Separator className="my-4" />
        <ScrollArea className="h-[540px] w-full pr-4">
          <div className="hover:bg-zinc-950/30 pr-2 rounded-[0.75rem]">
            <div className="flex justify-between pb-2">
              <p className="text-zinc-200 font-semibold">Bubble Sort</p>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Trash className="h-5 w-5 text-red-500 hover:text-red-600 cursor-pointer" />
                  <Pencil className="h-5 w-5 text-indigo-500 hover:text-indigo-600 cursor-pointer" />
                </div>
                <p className="text-indigo-400">2:45</p>
              </div>
            </div>
            <p className="text-zinc-200">
              La tecnología ha transformado la vida cotidiana de maneras
              inimaginables hace solo unas décadas. Desde la forma en que nos
              comunicamos hasta cómo trabajamos y nos entretenemos, la
              tecnología ha permeado todos los aspectos de nuestra existencia.
              Los dispositivos móviles, como teléfonos inteligentes y tabletas,
              nos permiten estar conectados en cualquier lugar y en cualquier
              momento, lo que facilita la comunicación instantánea y el acceso a
              la información. Además, el auge de las redes sociales ha cambiado
              la manera en que interactuamos con amigos y familiares, creando
              nuevas formas de relaciones humanas. Sin embargo, este avance
              también ha traído consigo desafíos, como la sobrecarga de
              información, la disminución de la privacidad y el aumento de la
              dependencia de la tecnología
            </p>
          </div>

        </ScrollArea>

        <div className="flex gap-2 mt-[15px]">
          <Textarea rows={4} placeholder="Write a note" className="flex-grow" />
          <Button variant="outline" className="self-end">
            Save Note
          </Button>
        </div>
      </div>
*/
