import React, { useState } from "react";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { Excalidraw } from "@excalidraw/excalidraw";
import { appWindow } from "@tauri-apps/api/window";

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [jsonData, setJsonData] = useState<string>("");

  function bye() {
    console.log("Cerrando ventana!!!!");
    appWindow.listen("tauri://close-requested", async function () {
      console.log("Cerrando ventana!!!!");
    // appWindow.hide()
    setTimeout(function () {
      appWindow.close()
    }, 10000);
    });
  }

  const exportToJSON = () => {
    if (!excalidrawAPI) {
      console.log("Excalidraw API no está disponible");
      return;
    }

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();

    // Eliminar la propiedad 'collaborators' del estado de la aplicación
    const { collaborators, ...appStateWithoutCollaborators } = appState;

    const exportData = {
      type: "excalidraw",
      version: 2,
      source: "http://localhost:1420",
      elements: elements,
      appState: appStateWithoutCollaborators
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    // Crear un blob con el JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    console.log(jsonString); // Mostrar en la consola

    // Guardar en localStorage
    localStorage.setItem('excalidrawData', jsonString);

    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = url;
    link.download = "excalidraw-data.json";

    // Simular clic en el enlace para iniciar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const json = reader.result as string;
        setJsonData(json);
      };
      reader.readAsText(file);
    }
  };

  const importFromJSON = () => {
    if (!excalidrawAPI || !jsonData) {
      console.log("Excalidraw API o JSON data no están disponibles");
      return;
    }

    try {
      // Parse the JSON data
      const data = JSON.parse(jsonData);

      // Asegurarse de que la propiedad 'collaborators' no esté presente
      if (data.appState && data.appState.collaborators) {
        delete data.appState.collaborators;
      }

      // Actualizar la escena de Excalidraw con los datos parseados
      excalidrawAPI.updateScene(data);

      console.log("Datos importados correctamente");
    } catch (error) {
      console.error("Error al importar los datos JSON:", error);
    }
  };

  return (
    <div className="App">
      <h1>Excalidraw JSON Export/Import Example</h1>
      <div style={{ height: "500px", width: "800px" }}>
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
        />
      </div>
      <button onClick={exportToJSON}>Exportar a JSON</button>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={importFromJSON}>Importar desde JSON</button>
      <button onClick={bye}>|||| bye </button>
    </div>
  );
}
