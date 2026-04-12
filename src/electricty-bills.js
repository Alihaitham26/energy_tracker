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

  if (typeof energyKwh !== 'number' || Number.isNaN(energyKwh) || energyKwh < 0) {
    throw new Error('Energy consumption must be a non-negative number');
  }

  let remaining = energyKwh;
  let previousMax = 0;
  let subtotal = 0;
  const breakdown = [];

  for (const tier of tiers) {
    if (remaining <= 0) break;

    const tierLimit = tier.max === Infinity ? remaining : tier.max - previousMax;
    const tierKwh = Math.min(remaining, tierLimit);
    if (tierKwh <= 0) {
      previousMax = tier.max;
      continue;
    }

    const tierCost = Number((tierKwh * tier.rate).toFixed(2));
    breakdown.push({
      tier: tier.max === Infinity ? `${previousMax + 1}+` : `${previousMax + 1}-${tier.max}`,
      kwh: Number(tierKwh.toFixed(2)),
      rate: tier.rate,
      cost: tierCost,
    });

    subtotal += tierCost;
    remaining -= tierKwh;
    previousMax = tier.max;
  }

  const totalCost = Number((subtotal * extraFactor + fixedFee).toFixed(2));

  return {
    energyKwh: Number(energyKwh.toFixed(2)),
    totalCost,
    breakdown,
    fixedFee: Number(fixedFee.toFixed(2)),
    extraFactor: Number(extraFactor.toFixed(3)),
  };
}

export default calculateEgyptElectricityBill;
