export const AMENITY_NAMES = ["WiFi","Coffee","Phone Booth","Printing","Parking","Reception","A/V Setup","Natural Light"];

export const scoreSpace = (space, criteria) => {
  let score = 0;
  const pm = space.pricePerMonth || 0;
  const budget = Number(criteria.budget);

  if (budget > 0) {
    if (pm <= budget) score += 3;
    else if (pm <= budget * 1.2) score += 1;
  }
  criteria.amenities.forEach(a => {
    if (space.amenities && space.amenities.includes(a)) score += 1;
  });
  if (criteria.floors.length > 0 && !criteria.floors.includes("Any")) {
    const preferredFloors = criteria.floors.map(f => parseInt(f.replace("Floor ","")));
    if (space.floor && preferredFloors.includes(space.floor)) score += 2;
  }
  const emp = Number(criteria.employees);
  if (emp > 0 && space.capacity) {
    if (space.capacity >= emp) score += 2;
    else if (space.capacity >= emp * 0.8) score += 1;
  }
  return score;
};

export const runRecommendations = (criteria, spaces) => {
  const budget = Number(criteria.budget);
  const scored = spaces
    .filter(s => s.pricePerMonth)
    .map(s => ({ ...s, score: scoreSpace(s, criteria) }));

  const sorted = [...scored].sort((a,b) => b.score - a.score);
  const affordable = [...scored].filter(s => budget <= 0 || s.pricePerMonth <= budget).sort((a,b) => a.pricePerMonth - b.pricePerMonth);
  const premium = [...scored].sort((a,b) => b.pricePerMonth - a.pricePerMonth);
  const efficient = [...scored].filter(s => s.capacity > 0).sort((a,b) => (b.capacity/b.pricePerMonth) - (a.capacity/a.pricePerMonth));

  return {
    bestMatch: sorted[0] || null,
    mostAffordable: affordable[0] || null,
    premium: premium[0] || null,
    mostEfficient: efficient[0] || null,
  };
};
