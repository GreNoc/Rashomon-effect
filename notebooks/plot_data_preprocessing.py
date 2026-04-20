import marimo

__generated_with = "0.9.10"
app = marimo.App(width="medium")


@app.cell
def __():
    import json
    import pandas as pd
    import string
    import uuid

    from functools import reduce
    return json, pd, reduce, string, uuid


@app.cell
def __(json):
    with open("raw_data/20241104_plot_data.json", 'r') as fp:
        plot_data = json.load(fp)
    return fp, plot_data


@app.cell
def __(json, pd, plot_data, reduce, string):
    alphabet = string.ascii_uppercase


    def adjust_plot_datum(plot_datum: dict) -> dict:
        time_ticks = [0, 6, 12, 18]
        time_labels = ["00:00", "06:00", "12:00", "18:00"]
        match plot_datum["feat_name"]:
            case "Workingday":
                return {
                    **plot_datum,
                    "x_ticks": None,
                    "x_labels": ["No", "Yes"],
                    "X": ["No", "Yes"],
                    "Y": plot_datum["Y"],
                }
            case "Weekday":
                return {
                    **plot_datum,
                    "type": "categorical",
                    "X": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                }

            case "Workingday x Time":
                return {
                    **plot_datum,
                    "y_labels": ["No", "Yes"],
                    "x_ticks": time_ticks,
                    "x_labels": time_labels
                }

            case "Weekday x Time":
                return {
                    **plot_datum,
                    "Y": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    "x_ticks": time_ticks,
                    "x_labels": time_labels,
                }
            case "Time":
                return {
                    **plot_datum,
                    "x_ticks": time_ticks,
                    "x_labels": time_labels
                }
            case "Temperature x Time":
                return {
                    **plot_datum,
                    "x_ticks": time_ticks,
                    "x_labels": time_labels,
                }
            case _:
                return plot_datum

    def preprocess_df(df: pd.DataFrame) -> pd.DataFrame:
        df["monotonicity_constraints"] = df["monotonicity_constraints"].apply(lambda l: json.dumps(l))
        df["exclude"] = df["exclude"].apply(lambda l: json.dumps(l))
        df["plotData"] = df["plot_data"].apply(lambda plot_data: [adjust_plot_datum(plot_datum) for plot_datum in plot_data])
        return df

    def prepare_data_for_study_frontend(raw_data: dict) -> dict:
        df = preprocess_df(pd.DataFrame.from_dict(plot_data))

        hyper_parameters = ["exclude", "interactions", "max_bins", "min_samples_leaf", "monotonicity_constraints"]

        encodings, sorted_hyper_parameter_levels = zip(*[(one_hot_encodings := pd.get_dummies(df[hp]), {hp: list(map(str, one_hot_encodings.columns))}) for hp in hyper_parameters])


        meta_data = {"hyperparameterLevels": reduce(lambda a, b: {**a, **b}, sorted_hyper_parameter_levels)}


        configuration_data = pd.concat(
            [
                df[["plotData", "score"]], 
                pd.concat(
                    encodings, 
                    axis=1
                ).apply(lambda row: json.dumps(row.tolist()), axis=1).rename("encoding")
            ], 
            axis=1).set_index("encoding")

        deduplicated_configuration_data = configuration_data[~configuration_data.index.duplicated()]

        return { "metaData": meta_data, "configurationData": deduplicated_configuration_data.to_dict("index") }
    return (
        adjust_plot_datum,
        alphabet,
        prepare_data_for_study_frontend,
        preprocess_df,
    )


@app.cell
def __(plot_data, prepare_data_for_study_frontend):
    prepared_data = prepare_data_for_study_frontend(plot_data)
    return (prepared_data,)


@app.cell
def __(json, prepared_data, uuid):
    with open(f"prepared_data/rashomon_study_data_{str(uuid.uuid4())}.json", 'w') as fp2:
        json.dump(prepared_data, fp2)
    return (fp2,)


@app.cell
def __(adjust_plot_datum, pd, plot_data):
    pd.DataFrame.from_dict(plot_data)["plot_data"].apply(lambda plot_data: [adjust_plot_datum(plot_datum) for plot_datum in plot_data])[0]
    return


@app.cell
def __():
    return


if __name__ == "__main__":
    app.run()
