import { encode, decode } from "./encoding";
import { configurationUniverse, type Configuration } from "./configuration";

describe("Test Configuration Encoding and Decoding", () => {
  it("Encoding <> Decoding Roundtrip", () => {
    const sampleConfiguration: Configuration = {
      color: "blue",
      shape: "square",
    };
    const encoded = encode(sampleConfiguration, configurationUniverse);
    const decoded = decode(encoded, configurationUniverse);

    expect(decoded).toEqual(sampleConfiguration);
  });
});
