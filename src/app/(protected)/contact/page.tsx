'use client';

const ContactPage = () => {
  return (
    <main className="bg-white min-h-screen py-16 px-6">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ຕິດຕໍ່ພວກເຮົາ</h1>
          <p className="text-lg text-gray-600">
            ພວກເຮົາຍິນດີຮັບຟັງຄຳຖາມ ຫຼື ຂໍ້ຄວາມຈາກທ່ານ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6 text-gray-700 text-lg">
            <div>
              <h2 className="font-semibold text-gray-800 text-xl mb-2">ທີ່ຢູ່ຮ້ານ</h2>
              <p>ເມືອງວຽງຈັນ, ສປປ ລາວ</p>
              <p>ເປີດບໍລິການ: 9:00 - 18:00 (ຈັນ - ສຸກ)</p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 text-xl mb-2">ຕິດຕໍ່</h2>
              <p>📞 ໂທ: <a href="tel:+856201234567" className="text-blue-600 hover:underline">+856 20 1234 567</a></p>
              <p>📧 ອີເມວ: <a href="mailto:support@itshop.la" className="text-blue-600 hover:underline">support@itshop.la</a></p>
              <p>📘 Facebook: <a href="https://facebook.com/yourstore" target="_blank" className="text-blue-600 hover:underline">facebook.com/yourstore</a></p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-gray-50 rounded-xl p-8 shadow space-y-6">
            <div>
              <label className="block font-medium mb-1">ຊື່ຂອງທ່ານ</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ປ້ອນຊື່"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">ອີເມວ</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">ຂໍ້ຄວາມ</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ພິມຂໍ້ຄວາມຂອງທ່ານ..."
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              ສົ່ງຂໍ້ຄວາມ
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
export default ContactPage;