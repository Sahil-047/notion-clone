"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog"
import { useCoverImage } from "@/hook/use-cover-image";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
    const [file, setFile] = useState<File>();
    const [isSubmiting, setIsSubmitting] = useState(false)
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();
    const update = useMutation(api.documents.update);
    const params = useParams();

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    }

    const onChange = async (file?: File) => {
        if (file) {
            setIsSubmitting(true);
            setFile(file)
            let res;
            if (coverImage.url) {
                res = await edgestore.publicFiles.upload({
                    file,
                    options: {
                        replaceTargetUrl: coverImage.url
                    }
                })
            } else {

                const res = await edgestore.publicFiles.upload({
                    file
                })
            };
            if (res) {
                await update({
                    id: params.documentId as Id<"documents">,
                    coverImage: res.url
                });
            }
            onClose();
        }
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <SingleImageDropzone
                    className="w-full outline-none"
                    disabled={isSubmiting}
                    value={file}
                    onChange={onChange} />
            </DialogContent>
        </Dialog>
    )
}