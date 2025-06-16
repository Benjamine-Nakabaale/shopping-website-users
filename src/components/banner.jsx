import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="banner w-full bg-primary-light flex flex-col justify-end items-center max-sm:h-[550px] max-sm:gap-2">
      <h2 className="text-brown text-center text-6xl font-bold tracking-[1.86px] leading-[60px] max-sm:text-4xl max-[400px]:text-3xl">
        Discover the Best <br />
        Of Praise Collection
      </h2>
      <h3 className="text-brown text-3xl font-normal leading-[72px] tracking-[0.9px] max-sm:text-xl max-[400px]:text-lg">
        The High-Quality Collection
      </h3>
      <div className="flex justify-center items-center gap-3 pb-10 max-[400px]:flex-col max-[400px]:gap-1 w-[420px] max-sm:w-[350px] max-[400px]:w-[300px]">
      <Link to="/Home" className="bg-white text-black text-center text-xl border border-[rgba(0, 0, 0, 0.4)] font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">
          Shop Now
        </Link>
        <Link to="/Home" className="text-brown border-white border-2 text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">See Collection</Link>
      </div>
    </div>
  );
};
export default Banner;
