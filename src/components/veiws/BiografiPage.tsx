"use client";
import Image from "next/image";
import { EmblaCarousel } from "../EmblaCarousal";
import { House, Map, MapPin, Users } from "lucide-react";

const BiografiView = () => {
  return (
    <div className="bg-primary p-10">
      <div className="h-screen w-full  bg-white rounded-[50px]">
        <div className="container-x">
          <div className="grid grid-cols-[1fr_2fr_1fr] grid-rows-2 gap-3 bg h-170 w-full pt-25">
            <div className="row-span-2 ">
              <div className="h-full overflow-hidden py-3">
                <Image
                  src="/image/foto-biografi.webp"
                  alt="Foto Biografi"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full rounded-[20px] "
                />
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 ">
              <div className="relative bg-primary h-65 w-25 rounded-xl flex items-center justify-center">
                <h1 className="absolute bottom-25 w-50 rotate-90 text-white text-2xl font-bold">
                  PROFILE BUPATI
                </h1>
              </div>
              <div className="border-2  border-primary  rounded-xl">
                <EmblaCarousel />
              </div>
            </div>
            <div className="row-span-2  h-full">
              <div className="grid row-end-4 gap-1 items-center h-full">
                <div className=" h-30 flex px-5 py-1.5 ">
                  <div className="h-full w-full px-5 hover:shadow-soft-bold transition-all bg-white rounded-2xl flex items-center border-2 border-primary">
                    <div className="flex flex-col justify-center items-start w-full h-full ">
                      <h1 className="text-sm font-medium">Total Penduduk</h1>
                      <h1 className="text-xl font-bold">129.235</h1>
                      <h1 className="text-xs text-green-500 font-normal">
                        1,83% Tahun 2025
                      </h1>
                    </div>
                    <div className="bg-blue-500 w-15 h-13 p-2 flex items-center justify-center rounded-xl">
                      <div className="bg-blue-400 flex items-center justify-center p-1 rounded-md">
                        <Users color="#1414b8" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" h-30 flex px-5 py-1.5 ">
                  <div className="h-full w-full px-5 hover:shadow-soft-bold transition-all bg-white rounded-2xl flex items-center border-2 border-primary">
                    <div className="flex flex-col justify-center items-start w-full h-full ">
                      <h1 className="text-sm font-medium">Luas Wilayah</h1>
                      <h1 className="text-xl font-bold">
                        4.212,34{" "}
                        <span className="text-sm text-gray-400">
                          km<sup>2</sup>
                        </span>
                      </h1>
                    </div>
                    <div className="bg-red-500 w-15 h-13 p-2 flex items-center justify-center rounded-xl">
                      <div className="bg-red-400 flex items-center justify-center p-1 rounded-md">
                        <Map color="#b81414" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" h-30 flex px-5 py-1.5 ">
                  <div className="h-full w-full px-5 hover:shadow-soft-bold transition-all bg-white rounded-2xl flex items-center border-2 border-primary">
                    <div className="flex flex-col justify-center items-start w-full h-full ">
                      <h1 className="text-sm font-medium">Total Kecamatan</h1>
                      <h1 className="text-xl font-bold">11</h1>
                    </div>
                    <div className="bg-orange-400 w-15 h-13 p-2 flex items-center justify-center rounded-xl">
                      <div className="bg-orange-300 flex items-center justify-center p-1 rounded-md">
                        <MapPin color="#b87e14" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" h-30 flex px-5 py-1.5 ">
                  <div className="h-full w-full px-5 hover:shadow-soft-bold transition-all bg-white rounded-2xl flex items-center border-2 border-primary">
                    <div className="flex flex-col justify-center items-start w-full h-full ">
                      <h1 className="text-sm font-medium">Total Desa</h1>
                      <h1 className="text-xl font-bold">191</h1>
                    </div>
                    <div className="bg-green-500 w-15 h-13 p-2 flex items-center justify-center rounded-xl">
                      <div className="bg-green-400 flex items-center justify-center p-1 rounded-md ">
                        <House color="#0a5c0a" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 ">
              <div className="border-2  border-primary  h-65 w-full rounded-xl">
                <div className="">
                  <Image
                    src="/image/logo.png"
                    alt="logo"
                    width={50}
                    height={50}
                    className="py-2 px-1 mx-2"
                  />
                </div>
                <h1 className="text-justify px-4">
                  Kabupaten Maluku Tenggara adalah sebuah kabupaten yang berada
                  wilayah Provinsi Maluku, Indonesia. Ibu kota kabupaten ini
                  berada di Desa Langgur, yang merupakan wilayah dari Kecamatan
                  Kei Kecil. Pembentukan Kabupaten Maluku Tenggara pada tahun
                  1952. Pusat pemerintahan Kabupaten Maluku Tenggara awalnya di
                  Tual, tetapi dipindahkan ke Desa Langgur, semenjak Tual
                  menjadi kota pada tahun 2007. Wilayah Kabupaten Maluku
                  Tenggara telah dimekarkan sebagian menjadi Kabupaten Kepulauan
                  Aru dan Kota Tual.
                </h1>
              </div>
              <div className="relative bg-primary h-65 w-12 rounded-xl flex items-center justify-center">
                <h1 className="absolute bottom-27 w-50 rotate-90 text-white text-xl font-bold">
                  MALUKU TENGGARA
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiografiView;
