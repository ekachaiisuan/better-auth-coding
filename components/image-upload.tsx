"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageUploadProps {
    defaultUrl?: string;
    onChange: (url: string | null) => void;
    endpoint: keyof OurFileRouter;
}

export default function ImageUpload({ defaultUrl, onChange, endpoint }: ImageUploadProps) {
    const [value, setValue] = useState<string | null>(defaultUrl ?? null);
    const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);
    const handleChangeImage = (url: string | null) => {
        setValue(url);
        onChange?.(url);
    }
    if (!showDropzone && value) {
        return (
            <div className="relative">
                <div className="relative w-[100px] h-[100px] shadow-lg overflow-hidden rounded-full">
                    <Image src={value!} className="object-cover" fill alt="user image" />
                </div>
                <div className="mt-3 flex gap-2">
                    <Trash className="absolute rounded-full left-40 top-0 text-rose-600 cursor-pointer" />

                </div>
            </div>
        )
    }
    return (
        <div className="relative">
            <UploadDropzone
                endpoint={endpoint}
                content={{
                    label: value
                        ? "Drop or click to change image"
                        : "Drop or click to upload image",
                }}
                appearance={{ container: "rouded-xl border", button: "!bg-black" }}
                onClientUploadComplete={(res) => {
                    const url = res?.[0].url;
                    if (url) {
                        setShowDropzone(false);
                        handleChangeImage(url);
                    }
                }}


            />
        </div>
    );
}
