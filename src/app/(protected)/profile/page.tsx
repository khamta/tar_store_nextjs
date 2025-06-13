
import React from "react";
import ProfilePreviewPage from "@/features/profile/components/preview-profile";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import formatDate from "@/lib/formatDate";

export default async function ProfilePage() {
   const user = await authCheck();
   if (!user) {
     redirect("/");
   }
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">ໂປຣໄຟລ໌</h1>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <ProfilePreviewPage imageUrl={user.picture} />

        <div className="space-y-4 text-gray-700 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>ເບີໂທລະສັບ</span>
            <span className="font-medium">{user.tel || 'ບໍ່ໄດ້ບັນທຶກ'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>ທີ່ຢູ່</span>
            <span className="font-medium text-right max-w-[60%]">{user.address || 'ບໍ່ໄດ້ບັນທຶກ'}</span>
          </div>
          <div className="flex justify-between">
            <span>ເປັນສະມາຊິກຕັ້ງແຕ່</span>
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
        </div>


      </div>
    </div>
  );
}
