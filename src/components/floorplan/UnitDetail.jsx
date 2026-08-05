import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Button from "../ui/Button";
import { UNIT_STATUS, formatPrice } from "../../data/units";
import { BRAND } from "../../utils/constants";
import { cx } from "../../utils/helpers";
import { EASE } from "../../utils/easing";

function UnitDetail({ unit, plan, onClose }) {
  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE.power3Out }}
          className="fixed inset-0 z-[100] flex justify-end bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE.expoOut }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel h-full w-full max-w-sm overflow-y-auto border-l border-white/10 bg-navy-900 p-8 text-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] text-white/40 uppercase">{plan?.label}</p>
                <h3 className="mt-1 text-3xl">Unit {unit.unitNo}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                data-cursor="view"
                className="text-white/60 transition-all duration-300 hover:rotate-90 hover:text-white"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <span
              className="mt-4 inline-block px-3 py-1 text-[11px] font-semibold tracking-wide uppercase"
              style={{ backgroundColor: UNIT_STATUS[unit.status].color }}
            >
              {UNIT_STATUS[unit.status].label}
            </span>

            <dl className="mt-8 space-y-5 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt className="text-white/50">Configuration</dt>
                <dd className="font-semibold">{unit.bhk} BHK</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt className="text-white/50">Carpet Area</dt>
                <dd className="font-semibold">{unit.carpetArea} sq.ft.</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt className="text-white/50">Saleable Area</dt>
                <dd className="font-semibold">{unit.saleableArea} sq.ft.</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt className="text-white/50">Facing</dt>
                <dd className="font-semibold">{unit.facing}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <dt className="text-white/50">Floor Range</dt>
                <dd className="font-semibold">{unit.floorRange?.[0]}–{unit.floorRange?.[1]}</dd>
              </div>
              <div className="flex justify-between pb-1">
                <dt className="text-white/50">Price</dt>
                <dd className={cx("font-semibold", unit.status === "sold" ? "text-white/40" : "text-brand-red")}>
                  {formatPrice(unit.price)}
                </dd>
              </div>
            </dl>

            <Button
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              className="mt-8 w-full justify-center"
              disabled={unit.status === "sold"}
            >
              {unit.status === "sold" ? "Unit Sold Out" : "Enquire About This Unit"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UnitDetail;
