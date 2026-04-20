import {
  type Configuration,
  type ConfigurationUniverse,
} from "./configuration";
import { assembleFeatureEncoding, cumulativeSum, offsets } from "./utils.ts";

type Encoding = number[];

export function encode(
  configuration: Configuration,
  configurationUniverse: ConfigurationUniverse,
): number[] {
  const relativeConfigurationPositions = (
    Object.entries(configurationUniverse) as Array<
      [keyof Configuration, string[]]
    >
  ).map(([key, value]) => value.indexOf(configuration[key]));
  const configurationOffsets = offsets(configurationUniverse);
  const absoluteConfigurationPositions = [
    0,
    ...configurationOffsets.slice(0, -1),
  ].map((num, idx) => num + relativeConfigurationPositions[idx]);
  const totalNumberOfFeatures = Object.entries(configurationUniverse).reduce(
    (acc, [, val]) => acc + val.length,
    0,
  );
  return assembleFeatureEncoding(
    totalNumberOfFeatures,
    absoluteConfigurationPositions,
  );
}

export function decode(
  encoding: Encoding,
  configurationUniverse: ConfigurationUniverse,
): Configuration {
  const configurationOffsets = cumulativeSum([
    0,
    ...offsets(configurationUniverse),
  ]);

  return (
    Object.keys(configurationUniverse) as Array<keyof Configuration>
  ).reduce((acc, key, idx) => {
    const value = configurationUniverse[key];
    const slice = encoding.slice(
      configurationOffsets[idx],
      configurationOffsets[idx + 1],
    );
    // @ts-expect-error not clear how to make the types work out here in an elegant way
    acc[key] = value[slice.indexOf(1)];
    return acc;
  }, {} as Configuration);
}
