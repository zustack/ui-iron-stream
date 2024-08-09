import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { deleteFile, getFiles, uploadFile } from "@/api/files";
import { useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WindowFiles() {
  const { videoId } = useParams();

 const [page, setPage] = useState({
    pages: [1], // Array de números
    currentPage: 0
  });
  // Función para agregar una nueva página (número)
  const addPage = () => {
    setPage(prevState => ({
      pages: [...prevState.pages, prevState.pages.length + 1],
      currentPage: prevState.pages.length // Actualiza a la nueva página
    }));
  };

  // Función para cambiar a la página siguiente
  const nextPage = () => {
    if (page.currentPage < page.pages.length - 1) {
      setPage(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage + 1
      }));
    }
  };

  // Función para cambiar a la página anterior
  const prevPage = () => {
    if (page.currentPage > 0) {
      setPage(prevState => ({
        ...prevState,
        currentPage: prevState.currentPage - 1
      }));
    }
  };
  const [file, setFile] = useState<File>();

  const queryClient = useQueryClient();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const uploadFileMutation = useMutation({
    mutationFn: () => uploadFile(file, page.pages[page.currentPage], videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: ErrorResponse) => {
      if (error.response.data.error === "") {
        toast.error("Ocurrio un error inesperado");
      }
      toast.error(error.response.data.error);
    },
  });

  // mutation to upload files
  // current files
  function uploadFiles() {
    if (!file) {
      toast.error("No files selected");
      return;
    }
    uploadFileMutation.mutate();
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["files", page],
    queryFn: () => getFiles(page.pages[page.currentPage], videoId),
  });

  const deleteFileMutation = useMutation({
    mutationFn: (id: number) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.response?.data?.error || "Ocurrió un error inesperado");
    },
  });

  console.log(data);

  return (
    <div>
      <h1 className="text-3xl">Select the files for the video (x)</h1>
  <div>
      <h1>Gestor de Páginas</h1>
      <div>
        <button onClick={prevPage} disabled={page.currentPage === 0}>
          Página Anterior
        </button>
        <button onClick={nextPage} disabled={page.currentPage === page.pages.length - 1}>
          Página Siguiente
        </button>
      </div>
      <button onClick={addPage}>Agregar Nueva Página</button>
      <p>Página Actual: {page.pages[page.currentPage]}</p>
      <p>Número Total de Páginas: {page.pages.length}</p>
    </div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload</button>
      {data &&
        data.map((file) => (
          <div key={file.id} className="bg-white py-2">
            <div
              key={file.id}
              className="container mx-auto border border-zinc-400/50 rounded-lg shadow-md"
            >
              <div className="flex justify-end">
                <Button
                  onClick={() => deleteFileMutation.mutate(file.id)}
                  variant="ghost"
                  size="icon"
                  className="h-12 gap-1 mt-7 hover:bg-zinc-200 "
                >
                  <Trash className="h-12 w-12 text-red-500" />
                </Button>
              </div>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${file.path}`}
                className="w-full h-full"
              />
              {file.path}
            </div>
          </div>
        ))}
    </div>
  );
}
