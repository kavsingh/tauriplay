import { createSignal } from "solid-js";

export const useFileDrop = () => {
  const [droppedFiles, setDroppedFiles] = createSignal<DroppedFile[]>();
  const [isActive, setIsActive] = createSignal(false);

  const onDragOver = (event: DragEvent) => {
    // needed for drop handler
    event.preventDefault();
  };

  const onDragEnter = (event: DragEvent) => {
    // needed for drop handler
    event.preventDefault();
    setIsActive(true);
  };

  const onDragLeave = () => {
    setIsActive(false);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const { items, files } = event.dataTransfer ?? {};
    const entries = items
      ? Array.from(items).map((item) => item.webkitGetAsEntry())
      : [];
    const dropped = files
      ? Array.from(files).map((file) => {
          const { isDirectory, isFile } =
            entries.find((e) => e?.name === file.name) ?? {};

          return { file, isDirectory, isFile };
        })
      : [];

    setIsActive(false);
    setDroppedFiles(dropped);
  };

  return {
    isActive,
    files: droppedFiles,
    elementHandles: { onDragOver, onDragEnter, onDragLeave, onDrop },
  } as const;
};

export interface DroppedFile
  extends Partial<Pick<FileSystemEntry, "isDirectory" | "isFile">> {
  file: File;
}
