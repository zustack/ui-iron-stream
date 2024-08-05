import { Button } from "@/components/ui/button";
import VideoFeed from "@/components/video-feed";
import VideoHls from "@/components/video-hls";
import { WebviewWindow } from '@tauri-apps/api/window'

export default function Video() {

function viewFiles() {
  const webview = new WebviewWindow('theUniqueLabel', {
    url: 'notes',
  })
  // since the webview window is created asynchronously,
  // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
  webview.once('tauri://created', function () {
    // webview window successfully created
  })
  webview.once('tauri://error', function (e) {
    // an error occurred during webview window creation
  })
}
  return (
    <div className="grid grid-cols-6 lg:grid-cols-12 gap-4">
      <div className="col-span-6 lg:col-span-8">
        <VideoHls />
        <h1 className="text-zinc-200 mt-4 text-xl font-semibold">go & htmx</h1>
        <p className="text-zinc-400 mt-2">
          In the first video we will setup a basic project to get stated.
        </p>
        <div className="mt-2 flex gap-2">
        <Button onClick={viewFiles}>
          Ver archivos 
        </Button>
        <Button>
          Abrir notas
        </Button>
      </div>
      </div>
      <div className="col-span-6 lg:col-span-4">
        <VideoFeed />
      </div>
    </div>
  );
}
