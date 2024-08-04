import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { useEffect } from "react";

export default function Notes() {

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const buttonToHide = document.querySelector(
        "#root > div:nth-child(2) > div > div.layer-ui__wrapper > div > div > div.layer-ui__wrapper__top-right.zen-mode-transition > label"
      ) as HTMLElement;

      if (buttonToHide) {
        buttonToHide.style.display = 'none';
        observer.disconnect(); 
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, []); 

  return (
    <>
    <div style={{ height: "1000px" }}>
      <Excalidraw langCode="es-ES" theme="dark">
        <MainMenu>
          <MainMenu.Group>
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.LoadScene />
          </MainMenu.Group>
        </MainMenu>
      </Excalidraw>
    </div>
    </>
  );
}
