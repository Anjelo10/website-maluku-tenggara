import * as Icons from "lucide-react";

const LayananView = () => {
  const LayananItems = [
    {
      name: "Kesehatan",
      icon: "Hospital",
    },
    {
      name: "Pemerintahan",
      icon: "Landmark",
    },
    {
      name: "Kependudukan",
      icon: "FileUser",
    },
    {
      name: "Layanan Keuangan",
      icon: "CreditCard",
    },
    {
      name: "Keliling Kei",
      icon: "TramFront",
    },
    {
      name: "Kesehatan",
      icon: "Hospital",
    },
    {
      name: "Kesehatan",
      icon: "Hospital",
    },
  ];

  return (
    <section className=" min-h-screen flex items-center justify-center w-full bg-primary ">
      <div className="bg-white mt-5  rounded-[20px] h-150  w-full mx-10 ">
        <div className="flex flex-col items-center justify-center mt-10 ">
          <h1 className="text-3xl font-bold">Layanan Publik</h1>
          <div className="w-40 h-[2px] bg-secondary mt-2" />
          <p className="w-150 text-center text-gray-500 text-sm mt-2">
            Nikmati kemudahan mengakses berbagai layanan publik untuk memenuhi
            kebutuhan masyarakat Yogyakarta.
          </p>
        </div>
        <div className="mx-30 my-10">
          <div className="grid grid-cols-6 gap-5">
            {LayananItems.map((item, index) => {
              const IconComponents =
                (Icons as any)[item.icon] || Icons.HelpCircle;
              return (
                <div className="  h-40 p-3" key={index}>
                  <div className="flex flex-col items-center justify-center bg-gray-100 cursor-pointer h-full  border border-gray-400 rounded-md hover:shadow-deep-soft transition-shadow">
                    <IconComponents
                      size={40}
                      strokeWidth={1.5}
                      color="#4d0002"
                    />
                    <span className="pt-4 text-sm"> {item.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayananView;
