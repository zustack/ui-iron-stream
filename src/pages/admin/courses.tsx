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
import { File, ListFilter, Loader, PlusCircle, Search } from "lucide-react";
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
import React, { useEffect, useState, ChangeEvent } from "react";
import CreateCourse from "@/components/admin/courses/create-course";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { adminCourses } from "@/api/courses";

export default function AdminCourses() {
  const [openCreateCourse, setOpenCreateCourse] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [active, setActive] = useState<number | string>(1);

  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["admin-courses", debouncedSearchTerm, active],
    queryFn: async ({ pageParam }) => {
      return adminCourses({
        pageParam: pageParam ?? 0,
        searchParam: debouncedSearchTerm,
        active: active,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Función para debouncing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchInput); // Actualizar el término de búsqueda después del retraso
    }, 800);

    return () => {
      clearTimeout(timerId); // Limpiar el temporizador anterior en cada cambio de input
    };
  }, [searchInput]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInput(value);
  };

  console.log(data)

  if (openCreateCourse) {
    return <CreateCourse close={() => setOpenCreateCourse(false)} />;
  }

  return (
    <>
      <div className="bg-muted/40 flex justify-between pt-2 pb-[10px] px-2 border border-b">

        <div>
          <form className="ml-auto flex-1 sm:flex-initial mr-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={handleInputChange}
                type="search"
                placeholder="Busca un curso por nombre, descripción, autor, etc ..."
                className="pl-8 w-[450px]"
              />
            </div>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
          {data && data.pages[0].data != undefined && data?.pages?.[0].data.length} 
          courses found</p>
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
              <DropdownMenuCheckboxItem 
              onClick={() => setActive("")}
              checked={active === ""}>
                Ninguno
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => setActive(1)}
                checked={active === 1}
              >Activo</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => setActive(0)}
                checked={active === 0}
              >No Activo</DropdownMenuCheckboxItem>
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
              className="sr-only sm:not-sr-only sm:whitespace-nowrap"
            >
              Crear curso
            </span>
          </Button>
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(100vh-4rem)] w-full p-11">
        <Table>
          <TableCaption>
      {status === 'pending' ? ( 
        <Loader className="ml-2 h-6 w-6 text-zinc-900 animate-spin slower items-center flex justify-center" />
      ) : null}

      {status === 'error' ? ( 
        <span>Error: {error.message}</span>
      ) : null}

            <div
              ref={ref}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                  ? 'Load Newer'
                  : 'No hay mas cursos para cargar'}
            </div>

          </TableCaption>
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
          {status != "pending" && status != "error" && data && data.pages.map((page) => (
            <React.Fragment key={page.nextId}>
              {page.data != null && page.data.map((course) => (
              <TableRow>
                <TableCell>
                  <Checkbox checked={course.is_active} />
                </TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.author}</TableCell>
                <TableCell>{course.thumbnail}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell className="text-right">Delete bro</TableCell>
              </TableRow>
            ))}
            </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
