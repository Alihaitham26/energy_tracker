const defaultEgyptResidentialTiers = [
  { max: 50, rate: 0.68 },
  { max: 100, rate: 0.78 },
  { max: 200, rate: 0.95 },
  { max: 350, rate: 1.55 },
  { max: 650, rate: 1.95 },
  { max: Infinity, rate: 2.1 },
];

/**
 * Calculate an Egypt residential electricity bill using tiered pricing.
 *
 * @param {number} energyKwh - Total energy consumed in kWh.
 * @param {object} [options]
 * @param {Array<{max:number,rate:number}>} [options.tiers] - Override default pricing tiers.
 * @param {number} [options.fixedFee=0] - Fixed monthly fee added to the bill.
 * @param {number} [options.extraFactor=1] - Multiplier for taxes or surcharges.
 * @returns {{energyKwh:number,totalCost:number,breakdown:Array, fixedFee:number, extraFactor:number}}
 */
export function calculateEgyptElectricityBill(energyKwh, options = {}) {
  const { tiers = defaultEgyptResidentialTiers, fixedFee = 0, extraFactor = 1 } = options;
  let rate = tiers.find((cr)=>energyKwh <= cr.max ).rate
  let totalCost = rate * energyKwh 

  return {
    energyKwh: Number(energyKwh.toFixed(2)),
    totalCost,
    fixedFee: Number(fixedFee.toFixed(2)),
    extraFactor: Number(extraFactor.toFixed(3)),
    rate: rate
  };
}

export default calculateEgyptElectricityBill;
