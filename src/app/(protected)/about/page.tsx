import ImageSlid from "@/features/about/components/image-slid";

// app/about/page.tsx
const AboutPage = () => {
  return (
<main className="bg-gray-50 min-h-screen py-16 px-6">
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">ກ່ຽວກັບພວກເຮົາ</h1>
          <p className="text-xl text-gray-600">
            ຮ້ານຂາຍອອນໄລນ໌ສິນຄ້າໄອທີ ທີ່ຄຸນນະພາບສູງ ໃສ່ໃຈການບໍລິການ
          </p>
        </div>

        <div className="grid grid-cols-1  gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">ວິໄສທັດຂອງພວກເຮົາ</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ພວກເຮົາມີເປົ້າໝາຍໃນການນຳເສີນສິນຄ້າໄອທີທີ່ມີມາດຕະຖານ ແລະ ໃຫ້ບໍລິການທີ່ຮວ່ມສະໄໝ
              ໂດຍມີການຈັດສົ່ງທີ່ໄວ ແລະ ການຮັບປະກັນທີ່ຊັດເຈນ.
            </p>
            <p className="text-gray-700 leading-relaxed">
              ບໍ່ວ່າຈະເປັນໂນ໋ດບຸກ, ເຄື່ອງປະກອບຄອມ, ແກ໊ດເຈັດ, ຫຼືອຸປະກອນໄອທີອື່ນໆ,
              ພວກເຮົາຄັດເລືອກແຕ່ສິນຄ້າທີ່ໄດ້ມາດຕະຖານ ແລະ ເປັນຂອງແທ້ 100%
            </p>
          </div>

          <ImageSlid />
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">ສິ່ງທີ່ພວກເຮົາໃຫ້ຄວາມສຳຄັນ</h2>
          <ul className="space-y-4 text-gray-700 list-disc list-inside">
            <li>ລາຄາຍ່ອມເຍົາ ແລະ ບໍ່ບວກເກີນໄປ</li>
            <li>ສິນຄ້າມີຮັບປະກັນ ແລະ ເປັນຂອງແທ້</li>
            <li>ບໍລິການລູກຄ້າດ້ວຍໃຈ ໃສ່ໃຈທຸກລາຍລະອຽດ</li>
            <li>ສົ່ງໄວ ແລະ ມີຫຼາຍທາງເລືອກໃນການຈ່າຍ</li>
          </ul>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">ຕິດຕໍ່ ຫຼື ຕິດຕາມຂ່າວສານ</h3>
          <div className="flex justify-center space-x-6">
            
            <a href="tel:+856201234567" className="text-gray-700 hover:text-black transition">
              📞 ໂທ: +856 20 1234 567
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
