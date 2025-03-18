"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react"; // Import React.use

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const resolvedParams = use(params); // Unwrap the params Promise

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), {
        ssr: false,
        loading: () => <Skeleton className="w-full h-[500px] rounded-md" />,
      }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: resolvedParams.documentId, // Use unwrapped params
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: resolvedParams.documentId, // Use unwrapped params
      content,
    });
  };

  if (document === undefined) {
    return (
      <div className="transition-all">
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div className="p-4">Document not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;