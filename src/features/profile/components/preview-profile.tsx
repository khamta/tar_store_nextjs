"use client";

import React, { useState, ChangeEvent } from "react";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import Modal from "@/components/shared/modal";
import { imageProfileAction } from "../actions/profile";
import Form from "next/form";
import { useForm } from "@/hooks/use-form";
import SubmitBtn from "@/components/shared/submit-btn";

interface PreviewImageProps {
  imageUrl?: string | null;
}

export default function PreviewImage({ imageUrl }: PreviewImageProps) {
  const [preview, setPreview] = useState<string | null>(imageUrl!);
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { formAction, isPending, clearErrors } = useForm(
    imageProfileAction,
    "/profile"
  );

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async (formData: FormData) => {
    if (file) {
      formData.append("user-image", file);
    }
   formAction(formData);

   setFile(null)
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Form action={handleSave} onChange={clearErrors}>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-col items-center mb-6">
            {/* Profile Image with Preview */}
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border cursor-pointer"
                width={500}
                height={500}
                onClick={() => setShowModal(true)}
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <UserCircle className="w-28 h-28 text-gray-400" />
              </div>
            )}

            {/* Upload Button */}
            <label
              htmlFor="profilePic"
              className="mt-4 cursor-pointer text-sm text-blue-600 hover:underline"
            >
              ເລືອກຮູບໃໝ່
            </label>
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="text-center mt-4">
            <SubmitBtn
              name="ປ່ຽນຮູບ"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              pending={isPending}
              disabled={!file || isPending}
            />
          </div>
        </div>
      </Form>

      {/* Modal for Image Preview */}
      {showModal && preview && (
        <Modal
          open={true}
          onOpenChange={setShowModal}
          title="ໂປຣໄຟລ໌"
          description="ກົດເພື່ອເບິ່ງຮູບໂປຣໄຟລ໌ຂອງທ່ານ"
        >
          <div
            className="relative bg-white p-4 rounded-xl shadow-lg max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // prevent closing when click image
          >
            <Image
              src={preview}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] rounded-lg"
              width={500}
              height={500}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
