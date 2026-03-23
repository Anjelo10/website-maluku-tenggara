"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.plugins().autoplay?.play();
  }, [emblaApi]);

  return (
    <div className="embla h-full ">
      <div className="embla__viewport rounded-xl" ref={emblaRef}>
        <div className="embla__container ">
          <div className="embla__slide">
            <img src="/image/bupati-profile.svg" alt="logo" className="" />
          </div>
          <div className="embla__slide">
            <img src="/image/wakilbupati.svg" alt="logo" className="" />
          </div>
        </div>
      </div>

      {/* <button className="embla__prev" onClick={goToPrev}>
        Scroll to prev
      </button>
      <button className="embla__next" onClick={goToNext}>
        Scroll to next\\
      </button> */}
      {/* <div className="">
        <div className="flex gap-10 mt-10 w-full h-full justify-center  *:">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              title={slideTitles[index]}
              className={` h-[5px] w-[190px]  cursor-pointer hover:bg-secondary ${
                index === selectedIndex ? "bg-secondary" : "bg-gray-200"
              }`}
            >
              <span className="">{slideTitles[index]}</span>
            </DotButton>
          ))}
        </div>
      </div> */}
    </div>
  );
}
