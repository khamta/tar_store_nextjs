import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface AuthHeaderProps {
    type: 'signup' | 'signin' | 'forgot-password' | 'reset-password',
    children: React.ReactNode
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
     let title = "";
  let desc = "";

  switch (type) {
    case "signup":
      title = "ສະໝັກສະມາຊິກ";
      desc = "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບເພື່ອສະໝັກສະມາຊິກ";
      break;
    case "signin":
      title = "ເຂົ້າສູ່ລະບົບ";
      desc = "ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອເຂົ້າສູ່ລະບົບ";
      break;
    case "forgot-password":
      title = "ລືມລະຫັດຜ່ານ";
      desc = "ກະລຸນາປ້ອນ ອີເມລ໌ ເພື່ອກູ້ຄືນລະຫັດຜ່ານ";
      break;
    case "reset-password":
      title = "ກູ້ຄືນລະຫັດຜ່ານ";
      desc = "ກະລຸນາປ້ອນລະຫັດຜ່ານໃໝ່";
      break;
  }

  return (
    <div className="px-4 md:px-0">
        <Card className="max-w-md mx-auto">
            <CardHeader>
            <CardTitle className="text-2xl font-bold text-center"> {title} </CardTitle>
            <CardDescription className="text-center"> {desc} </CardDescription>
            </CardHeader>
            {children}
        </Card>
    </div>
  )
}

export default AuthHeader