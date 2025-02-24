"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash, {});
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentid: string) => {
        router.push(`/document/${documentid}`);
    };

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentid: Id<"documents">,
    ) => {
        event?.stopPropagation();
        const promise = restore({ id: documentid });
        toast.promise(promise, {
            loading: "Restoring Note...",
            success: "Note Restored",
            error: "Failed to restore",
        });
    };

    const onRemove = (
        documentid: Id<"documents">,
    ) => {
        const event = window.event;
        event?.stopPropagation();
        const promise = remove({ id: documentid });
        toast.promise(promise, {
            loading: "Removing Note...",
            success: "Note Removed",
            error: "Failed to remove",
        });

        if (params.documentid === documentid) {
            router.push("/documents");
        };
    };

    if (documents === undefined) {
        return (
            <div className="flex items-center justify-center h-full p-4">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                < Search className="h-4 w-4" />
                < Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by page title"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <div className="flex items-center gap-x-1 p-2 ">
                    <Search className="h-4 w-4" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                        placeholder="Filter by page title"
                    />
                </div>
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-muted-foreground pb-2 text-center">
                    No notes in trash
                </p>
                {filteredDocuments?.map((document) => (
                    <div
                        key={document._id}
                        className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-primary/10 justify-between"
                        onClick={() => onClick(document._id)}
                        role="button"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <div
                                onClick={(e) => onRestore(e, document._id)}
                                className="rounded-sm p-2 hover:bg-neutral-200"
                            >
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-neutral-200">
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}