import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, ListFilter, PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import CreateCourse from "@/components/admin/courses/create-course";

export default function AdminCourses() {
  const [openCreateCourse, setOpenCreateCourse] = useState(false);

  if (openCreateCourse) {
    return <CreateCourse />;
  }

  return (
    <>
      <div className="bg-muted/40 flex justify-between pt-2 pb-[10px] px-2 border border-b">
        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Busca un curso por nombre, descripción, autor, etc ..."
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">3402 courses found</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Ninguno
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Activo</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>No Activo</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span 
            onClick={() => setOpenCreateCourse(true)}
            className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Crear curso
            </span>
          </Button>
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-4rem)] w-full p-4">
        <Table>
          <TableCaption>No hay mas cursos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((invoice) => (
              <TableRow>
                <TableCell>
                <Checkbox checked={invoice.isActive} />
                </TableCell>
                <TableCell>{invoice.title}</TableCell>
                <TableCell>{invoice.descripcion}</TableCell>
                <TableCell>{invoice.autor}</TableCell>
                <TableCell>{invoice.thumbnail}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="text-right">
                  Delete bro
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
const invoices = [
  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },


  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },


  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },


  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },


  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },


  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

  {
    isActive: true,
    title: "Data Structures and Algorithms",
    descripcion: "This course is about data structures and algorithms",
    autor: "John Doe",
    thumbnail: "https://via.placeholder.com/150",
    date: "Jueves, 3 July 2025",
  },

];
