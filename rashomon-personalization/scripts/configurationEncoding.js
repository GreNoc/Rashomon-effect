const configurationUniverse = {
  color: ["red", "blue", "green"],
  shape: ["circle", "triangle", "square", "pentagon"],
};

const configuration = {
  color: "blue",
  shape: "pentagon",
};

function encode(configuration, configurationUniverse) {
  const relativeConfigurationPositions = Object.entries(
    configurationUniverse,
  ).map(([key, value]) => value.indexOf(configuration[key]));
  const configurationOffsets = offsets(configurationUniverse);
  const absoluteConfigurationPositions = [
    0,
    ...configurationOffsets.slice(0, -1),
  ].map((num, idx) => num + relativeConfigurationPositions[idx]);
  const totalNumberOfFeatures = Object.entries(configurationUniverse).reduce(
    (acc, [key, val]) => acc + val.length,
    0,
  );
  return assembleFeatureEncoding(
    totalNumberOfFeatures,
    absoluteConfigurationPositions,
  );
}

function decode(encoding, configurationUniverse) {
  const configurationOffsets = cumulativeSum([
    0,
    ...offsets(configurationUniverse),
  ]);
  return Object.fromEntries(
    Object.entries(configurationUniverse).map(([key, value], idx) => [
      key,
      value[
        encoding
          .slice(configurationOffsets[idx], configurationOffsets[idx + 1])
          .indexOf(1)
      ],
    ]),
  );
}

function decode2(encoding, configurationUniverse) {
  const configurationOffsets = cumulativeSum([
    0,
    ...offsets(configurationUniverse),
  ]);

  return Object.keys(configurationUniverse).reduce((acc, key, idx) => {
    const value = configurationUniverse[key];
    const slice = encoding.slice(
      configurationOffsets[idx],
      configurationOffsets[idx + 1],
    );
    acc[key] = value[slice.indexOf(1)];
    return acc;
  }, {});
}

function offsets(configurationUniverse) {
  return Object.values(configurationUniverse).map((vals) => vals.length);
}

function cumulativeSum(arr) {
  const acc = (
    (sum) => (value) =>
      (sum += value)
  )(0);
  return arr.map(acc);
}

function assembleFeatureEncoding(length, indices) {
  let arr = new Array(length).fill(0);

  indices.forEach((index) => {
    arr[index] = 1;
  });

  return arr;
}

console.log(
  decode(encode(configuration, configurationUniverse), configurationUniverse),
);
console.log(
  decode2(encode(configuration, configurationUniverse), configurationUniverse),
);
