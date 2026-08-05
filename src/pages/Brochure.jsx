// import { useState } from "react";
// import { FaDownload } from "react-icons/fa";
// import Layout from "../components/layout/Layout";
// import FooterBar from "../components/layout/FooterBar";
// import UtilityBar from "../components/layout/UtilityBar";
// import CompactHeader from "../components/common/CompactHeader";
// import BackButton from "../components/common/BackButton";
// import Button from "../components/ui/Button";
// import { BRAND } from "../utils/constants";

// // Drop the real exported PDF at public/brochure.pdf — the download button
// // below points there directly, no other wiring needed.
// const BROCHURE_FILE = "/brochure.pdf";

// function Brochure() {
//   const [gate, setGate] = useState(false);
//   const [phone, setPhone] = useState("");

//   function handleUnlock(event) {
//     event.preventDefault();
//     if (phone.trim().length >= 10) setGate(true);
//   }

//   return (
//     <Layout>
//       <div className="relative flex h-screen flex-col overflow-hidden bg-navy-50">
//         <CompactHeader
//           eyebrow="Brochure"
//           title="The Full Story, On Paper"
//           description="Floor plans, specifications, amenities & pricing."
//         />

//         <div className="px-6 pt-8 md:px-16">
//           <BackButton />
//         </div>

//         <div className="flex min-h-0 flex-1 items-center overflow-y-auto px-6 py-4 pb-20 md:px-16">
//           <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2 md:items-center">
//             <div className="flex justify-center gap-6 [perspective:1200px]">
//               <div className="w-40 -rotate-6 bg-navy-700 p-5 text-white shadow-2xl transition-transform duration-500 hover:rotate-0 sm:w-48">
//                 <div className="flex justify-end">
//                   <span className="border border-brand-red px-2 py-0.5 text-[9px] tracking-widest">
//                     JP INFRA
//                   </span>
//                 </div>
//                 <p className="mt-12 font-display text-2xl leading-none sm:text-3xl">
//                   {BRAND.tagline}
//                 </p>
//                 <p className="mt-2 text-[10px] text-white/70">
//                   {BRAND.subline}
//                 </p>
//                 <p className="mt-16 text-[9px] leading-relaxed text-white/50 sm:mt-20">
//                   {BRAND.rera}
//                 </p>
//               </div>

//               <div className="mt-8 w-40 rotate-6 bg-white p-5 text-navy-900 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:w-48">
//                 <span className="border border-navy-900 px-2 py-0.5 text-[9px] tracking-widest">
//                   JP INFRA
//                 </span>
//                 <p className="mt-16 text-[10px] font-semibold text-navy-900 sm:mt-20">
//                   {BRAND.address}
//                 </p>
//                 <p className="mt-3 text-[10px] text-navy-900/70">
//                   {BRAND.email}
//                 </p>
//                 <p className="text-[10px] text-navy-900/70">{BRAND.website}</p>
//                 <p className="mt-3 font-display text-lg text-brand-red">
//                   {BRAND.tollFree}
//                 </p>
//               </div>
//             </div>

//             <div>
//               <h2 className="text-2xl text-navy-900 md:text-3xl">
//                 What's Inside
//               </h2>
//               <ul className="mt-4 space-y-2 text-sm text-navy-900/70">
//                 <li>— Tower-wise floor plans for 1, 2, 3 & 4 BHK homes</li>
//                 <li>— Complete amenities & specification sheet</li>
//                 <li>— Master layout, connectivity map & site address</li>
//                 <li>— Payment plans, current offers & RERA details</li>
//               </ul>

//               {!gate ? (
//                 <form
//                   onSubmit={handleUnlock}
//                   className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
//                 >
//                   <input
//                     required
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="Enter mobile number to unlock"
//                     className="w-full border border-navy-900/20 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-brand-red"
//                   />
//                   <Button type="submit" className="whitespace-nowrap">
//                     <FaDownload className="h-3.5 w-3.5" /> Unlock
//                   </Button>
//                 </form>
//               ) : (
//                 <Button href={BROCHURE_FILE} download className="mt-6">
//                   <FaDownload className="h-3.5 w-3.5" /> Download Brochure (PDF)
//                 </Button>
//               )}
//               <p className="mt-3 text-xs text-navy-900/40">
//                 {BRAND.disclaimer}
//               </p>
//             </div>
//           </div>
//         </div>

//         <UtilityBar position="bottom-20 left-6 md:left-16" />
//         <FooterBar />
//       </div>
//     </Layout>
//   );
// }

// export default Brochure;
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import CompactHeader from "../components/common/CompactHeader";
import BackButton from "../components/common/BackButton";
import Button from "../components/ui/Button";
import { BRAND } from "../utils/constants";

const BROCHURE_FILE = "/brochure.pdf";

function Brochure() {
  const [gate, setGate] = useState(false);
  const [phone, setPhone] = useState("");

  function handleUnlock(event) {
    event.preventDefault();
    if (phone.trim().length >= 10) setGate(true);
  }

  return (
    <Layout>
      <div className="relative flex h-screen flex-col overflow-hidden bg-navy-50">
        <CompactHeader
          eyebrow="Brochure"
          title="The Full Story, On Paper"
          description="Floor plans, specifications, amenities & pricing."
        />

        {/* Back Button */}
        <BackButton
          className="
            absolute
            left-6
            top-[170px]
            z-30
            md:left-16
            md:top-[175px]
            lg:top-[180px]
            xl:top-[185px]
          "
        />

        {/* Main Content */}
        <div className="flex min-h-0 flex-1 items-center overflow-y-auto px-6 pt-24 pb-20 md:px-16 md:pt-28">
          <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2 md:items-center">
            {/* Brochure Mockup */}
            <div className="flex justify-center gap-6 [perspective:1200px]">
              <div className="w-40 -rotate-6 bg-navy-700 p-5 text-white shadow-2xl transition-transform duration-500 hover:rotate-0 sm:w-48">
                <div className="flex justify-end">
                  <span className="border border-brand-red px-2 py-0.5 text-[9px] tracking-widest">
                    JP INFRA
                  </span>
                </div>

                <p className="mt-12 font-display text-2xl leading-none sm:text-3xl">
                  {BRAND.tagline}
                </p>

                <p className="mt-2 text-[10px] text-white/70">
                  {BRAND.subline}
                </p>

                <p className="mt-16 text-[9px] leading-relaxed text-white/50 sm:mt-20">
                  {BRAND.rera}
                </p>
              </div>

              <div className="mt-8 w-40 rotate-6 bg-white p-5 text-navy-900 shadow-2xl transition-transform duration-500 hover:rotate-0 sm:w-48">
                <span className="border border-navy-900 px-2 py-0.5 text-[9px] tracking-widest">
                  JP INFRA
                </span>

                <p className="mt-16 text-[10px] font-semibold text-navy-900 sm:mt-20">
                  {BRAND.address}
                </p>

                <p className="mt-3 text-[10px] text-navy-900/70">
                  {BRAND.email}
                </p>

                <p className="text-[10px] text-navy-900/70">
                  {BRAND.website}
                </p>

                <p className="mt-3 font-display text-lg text-brand-red">
                  {BRAND.tollFree}
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div>
              <h2 className="text-2xl text-navy-900 md:text-3xl">
                What's Inside
              </h2>

              <ul className="mt-4 space-y-2 text-sm text-navy-900/70">
                <li>— Tower-wise floor plans for 1, 2, 3 & 4 BHK homes</li>
                <li>— Complete amenities & specification sheet</li>
                <li>— Master layout, connectivity map & site address</li>
                <li>— Payment plans, current offers & RERA details</li>
              </ul>

              {!gate ? (
                <form
                  onSubmit={handleUnlock}
                  className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
                >
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile number to unlock"
                    className="w-full border border-navy-900/20 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-brand-red"
                  />

                  <Button type="submit" className="whitespace-nowrap">
                    <FaDownload className="h-3.5 w-3.5" />
                    Unlock
                  </Button>
                </form>
              ) : (
                <Button
                  href={BROCHURE_FILE}
                  download
                  className="mt-6"
                >
                  <FaDownload className="h-3.5 w-3.5" />
                  Download Brochure (PDF)
                </Button>
              )}

              <p className="mt-3 text-xs text-navy-900/40">
                {BRAND.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Utility Bar */}
        <UtilityBar position="bottom-20 left-6 md:left-16" />

        <FooterBar />
      </div>
    </Layout>
  );
}

export default Brochure;