export const normalizeState = (state) => {
  const map = {
    "DELHI": "NCT OF DELHI",
    "JAMMU AND KASHMIR": "JAMMU & KASHMIR",
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": "DADRA & NAGAR HAVELI",
  };
  return map[state?.toUpperCase()] || state?.toUpperCase();
};

export const normalizeDistrict = (district) => {
  const map = {
    "EAST DELHI": "EAST DELHI",
    "WEST DELHI": "WEST DELHI",
    "NORTH DELHI": "NORTH DELHI",
    "SOUTH DELHI": "SOUTH DELHI",
    "NORTH WEST DELHI": "NORTH WEST DELHI",
    "NORTH EAST DELHI": "NORTH EAST DELHI",
    "SOUTH WEST DELHI": "SOUTH WEST DELHI",
    "SOUTH EAST DELHI": "SOUTH EAST DELHI",
  };
  return map[district?.toUpperCase()] || district?.toUpperCase();
};
