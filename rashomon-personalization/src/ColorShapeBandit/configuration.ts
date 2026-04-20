const colors = ["red", "blue", "green", "yellow"] as const;
type Color = (typeof colors)[number];

const shapes = ["circle", "triangle", "square"];
type Shape = (typeof shapes)[number];

export type ConfigurationUniverse = {
  [K in keyof Configuration]: readonly string[];
};

export interface Configuration {
  color: Color;
  shape: Shape;
}

export const configurationUniverse: ConfigurationUniverse = {
  color: colors,
  shape: shapes,
};
