import allData from '../../assets/rashomon_study_data_459bc8bb-cf86-40cd-86b0-c9daeb0bfb9d.json';

interface MetaData {
  hyperparameterLevels: Record<string, string[]>
}

export interface DashboardData {
  X: Array<number>;
  Y: Array<number>;
  Z: Array<Array<number>> | null;
  type: "numerical" | "categorical" | "interaction"
  feat_name: string;
  x_ticks: Array<number> | null;
  y_ticks: Array<number> | null;
  x_labels: Array<string> | null;
  y_labels: Array<string> | null;
  x_name: string;
  y_name: string;
}

export type DashboardDataByConfiguration = Record<string, {plotData: Array<DashboardData>; score: number;}>
export type HyperParameterLevels = Record<string, string[]>


interface PlotData {
  metaData: MetaData;
  configurationData: DashboardDataByConfiguration;
}

function normalizeKeys(configurationData: DashboardDataByConfiguration) : DashboardDataByConfiguration {
  return Object.entries(configurationData).reduce((acc, [key, value]) => {
    const normalizedKey = JSON.stringify(JSON.parse(key))
    acc[normalizedKey] = value
    return acc
  }, {} as DashboardDataByConfiguration)
}

export const normalizedData = {
  ...allData,
  configurationData: normalizeKeys(allData.configurationData as DashboardDataByConfiguration)
} as PlotData

export const hyperParameterLevels: HyperParameterLevels = normalizedData.metaData.hyperparameterLevels
