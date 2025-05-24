import Image from "next/image";
import React from "react";

export default function GridShape() {
  return (
    <>
      <div className="absolute right-0 top-0 -z-10 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px] opacity-50 pointer-events-none">
        <Image
          width={540}
          height={254}
          src="/images/shape/grid-01.svg"
          alt="grid"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px] rotate-180 opacity-50 pointer-events-none">
        <Image
          width={540}
          height={254}
          src="/images/shape/grid-01.svg"
          alt="grid"
          priority
        />
      </div>
    </>
  );
}
