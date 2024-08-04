import { Excalidraw, MainMenu, Sidebar } from "@excalidraw/excalidraw";

export default function Notes() {
var buttonToHide = document.querySelector("#root > div:nth-child(2) > div > div.layer-ui__wrapper > div > div > div.layer-ui__wrapper__top-right.zen-mode-transition > label");
if(buttonToHide){
buttonToHide.style.display = 'none';
}
  return (
 <div style={{ height: "1000px" }}>
 <Excalidraw 
 langCode="es-ES"
 theme="dark">
        <MainMenu>
          <MainMenu.Group>
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.LoadScene />
          </MainMenu.Group>
        </MainMenu>
      </Excalidraw>

      </div>
  );
}
