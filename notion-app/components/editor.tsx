"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable = true }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    try {
      const response = await edgestore.publicFiles.upload({
        file,
      });
      return response.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  const handleEditorChange = () => {
    try {
      const content = JSON.stringify(editor.document, null, 2);
      onChange(content);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  return (
    <div className="relative pl-[4rem] pt-[2rem] max-w-[850px]">
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleEditorChange}
         className="!block prose dark:prose-invert max-w-full"
      />
    </div>
  );
};

export default Editor;