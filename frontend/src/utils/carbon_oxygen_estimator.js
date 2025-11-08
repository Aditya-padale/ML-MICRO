// Utility to estimate carbon (tons CO2) and oxygen (tons O2) changes
// based on class-level area changes from the analysis data.

// Coefficients: tons CO2 per hectare per year (positive values mean sequestration)
const DEFAULT_CARBON_FACTORS = {
  Forest: 10.5,
  PermanentCrop: 3.2,
  AnnualCrop: 1.8,
  Pasture: 2.5,
  HerbaceousVegetation: 4.1,
  River: 0,
  SeaLake: 0.5,
  Highway: -2.1,
  Industrial: -8.7,
  Residential: -3.4
};

// Rough oxygen production per hectare per year (tons O2/ha/year) — approximate values
const DEFAULT_OXYGEN_FACTORS = {
  Forest: 6.6,
  PermanentCrop: 1.5,
  AnnualCrop: 0.9,
  Pasture: 1.2,
  HerbaceousVegetation: 1.8,
  River: 0,
  SeaLake: 0.1,
  Highway: -0.5,
  Industrial: -2.5,
  Residential: -1.0
};

// Helper: convert km^2 to hectares
const km2ToHectares = (km2) => km2 * 100;

// analysis object expected shape:
// { before: { probs: [...] }, after: { probs: [...] }, class_names: [...], before_year, after_year }

export function estimateCarbonAndOxygen(analysis, options = {}) {
  console.log('Carbon estimator called with:', analysis); // Debug log
  if (!analysis || !analysis.class_names) {
    console.log('Missing analysis or class_names:', analysis);
    return null;
  }

  const carbonFactors = options.carbonFactors || DEFAULT_CARBON_FACTORS;
  const oxygenFactors = options.oxygenFactors || DEFAULT_OXYGEN_FACTORS;
  const assumedAreaKm2 = options.assumedAreaKm2 || 100; // default 100 km^2

  const { class_names: classNames = [], before = {}, after = {}, before_year = 2010, after_year = 2020 } = analysis;
  const beforeProbs = before.probs || [];
  const afterProbs = after.probs || [];

  const years = (after_year || 2020) - (before_year || 2010);
  const resultsByClass = [];
  let totalCarbonBefore = 0;
  let totalCarbonAfter = 0;
  let totalOxygenBefore = 0;
  let totalOxygenAfter = 0;

  classNames.forEach((className, idx) => {
    const beforePct = (beforeProbs[idx] || 0);
    const afterPct = (afterProbs[idx] || 0);

    const areaBeforeKm2 = beforePct * assumedAreaKm2;
    const areaAfterKm2 = afterPct * assumedAreaKm2;

    const hectaresBefore = km2ToHectares(areaBeforeKm2);
    const hectaresAfter = km2ToHectares(areaAfterKm2);

    const carbonFactor = carbonFactors[className] || 0;
    const oxygenFactor = oxygenFactors[className] || 0;

    const carbonBefore = hectaresBefore * carbonFactor; // tons CO2/year
    const carbonAfter = hectaresAfter * carbonFactor;

    const oxygenBefore = hectaresBefore * oxygenFactor; // tons O2/year
    const oxygenAfter = hectaresAfter * oxygenFactor;

    totalCarbonBefore += carbonBefore;
    totalCarbonAfter += carbonAfter;
    totalOxygenBefore += oxygenBefore;
    totalOxygenAfter += oxygenAfter;

    resultsByClass.push({
      className,
      areaBeforeKm2,
      areaAfterKm2,
      hectaresBefore,
      hectaresAfter,
      carbonBefore,
      carbonAfter,
      oxygenBefore,
      oxygenAfter,
      carbonChange: carbonAfter - carbonBefore,
      oxygenChange: oxygenAfter - oxygenBefore
    });
  });

  const totalCarbonChange = totalCarbonAfter - totalCarbonBefore;
  const totalOxygenChange = totalOxygenAfter - totalOxygenBefore;

  // Human readable sentences per significant class
  const significant = resultsByClass
    .filter(r => Math.abs(r.carbonChange) > 1 || Math.abs(r.oxygenChange) > 1)
    .sort((a, b) => Math.abs(b.carbonChange) - Math.abs(a.carbonChange));

  const sentences = [];
  significant.forEach(r => {
    if (Math.abs(r.carbonChange) > 1) {
      const yearsText = `${years} ${years === 1 ? 'year' : 'years'}`;
      const change = Math.round(Math.abs(r.carbonChange));
      const verb = r.carbonChange < 0 ? 'lost' : 'gained';
      sentences.push(`Region changed ${verb} approximately ${change.toLocaleString()} tons CO₂ capacity from ${r.className} over ${yearsText}.`);
    }
    if (Math.abs(r.oxygenChange) > 1) {
      const yearsText = `${years} ${years === 1 ? 'year' : 'years'}`;
      const change = Math.round(Math.abs(r.oxygenChange));
      const verb = r.oxygenChange < 0 ? 'lost' : 'gained';
      sentences.push(`Region ${verb} approximately ${change.toLocaleString()} tons O₂ production capacity from ${r.className} over ${yearsText}.`);
    }
  });

  const summary = {
    totalCarbonBefore,
    totalCarbonAfter,
    totalCarbonChange,
    totalOxygenBefore,
    totalOxygenAfter,
    totalOxygenChange,
    years,
    resultsByClass,
    sentences
  };

  return summary;
}
