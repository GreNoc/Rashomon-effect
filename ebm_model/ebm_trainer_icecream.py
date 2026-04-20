import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, FunctionTransformer
from sklearn.pipeline import Pipeline
from interpret.glassbox import ExplainableBoostingRegressor
from interpret import show
from sklearn.model_selection import ParameterGrid
import os
import pickle
import matplotlib.pyplot as plt
import numpy as np

import os
import sys
from typing import List, Tuple
from loguru import logger
from dataclasses import dataclass, field
import copy


@dataclass
class Config:
    data_path: str = "ice_cream_sales.csv"
    numerical_cols: List[str] = field(
        default_factory=lambda: [
            "Temperature",
            "Hour",
        ]
    )
    categorical_cols: List[str] = field(default_factory=lambda: ["Weekday"])
    target: str = field(default_factory=lambda: "Sales")
    test_size: float = 0.3
    random_state: int = 42
    model_save_path: str = "models_ice_cream/"
    parameters: dict = field(
        default_factory=lambda: {
            # "exclude": [],
            "max_bins": [16],
            "min_samples_leaf": [64],
            "interactions": [2],
            # "monotonicity_constraints": [],
        }
    )
    name_mapping: dict = field(
        default_factory=lambda: {
            "num__Temperature": "Temperature",
            "num__Hour": "Hour",
            "cat__Weekday_yes": "Workday",
            "num__Temperature & num__Hour": "Temperature x Hour",
            "num__Temperature & cat__Weekday_yes": "Workday x Temperature",
            "num__Hour & cat__Weekday_yes": "Workday x Hour",
            "num_Temperature & cat__Weekday_yes": "Workday x Temperature",
            "Effect on Prediction": "Effect on Sales",
        }
    )
    df_original: pd.DataFrame = field(default_factory=lambda: pd.DataFrame())


@dataclass
class Plots:
    data: List[dict] = field(default_factory=lambda: [])


config = Config()
plots = Plots()

logger.remove()
logger.add(sys.stderr, level="INFO")


def create_step_points(X, Y, num_points):
    # Initialize lists to hold the new X and Y values
    artificial_points_X = []
    artificial_points_Y = []

    # Calculate the total number of steps needed
    total_steps = num_points - len(X)

    # Determine the number of additional points per segment
    steps_per_segment = total_steps // (len(X) - 1)

    for i in range(len(X) - 1):
        # Add the current point
        artificial_points_X.append(X[i])
        artificial_points_Y.append(Y[i])

        # Calculate the step size for x between current and next point
        step_size = (X[i + 1] - X[i]) / (steps_per_segment + 1)

        # Add intermediate points at the same y level
        for j in range(1, steps_per_segment + 1):
            artificial_points_X.append(X[i] + j * step_size)
            artificial_points_Y.append(Y[i])

    # Add the last point
    artificial_points_X.append(X[-1])
    artificial_points_Y.append(Y[-1])

    return artificial_points_X, artificial_points_Y


def add_plot_data(
    plot_num: int,
    X: List[float],
    Y: List[float],
    plot_type: str,
    feat_name: str,
    x_name: str,
    y_name: str,
    Z: List[float] | None = None,
    x_labels: List[int | str] | None = None,
    y_labels: List[int | str] | None = None,
    x_min: float | None = None,
    x_max: float | None = None,
    x_ticks: List[int] | None = None,
    y_ticks: List[int] | None = None,
):

    if feat_name in [
        "num__Temperature",
        "num__Hour",
    ]:
        X, Y = create_step_points(X, Y, num_points=500)

    # Round all X values to two decimal places
    X = np.round(X, 2)

    # Round Y values based on the plot type
    if plot_type == "interaction":
        Y = np.round(Y, 2)
    else:
        Y = np.round(Y)

    if Z is not None:
        Z = np.round(Z)

    if "plot_data" not in plots.data[-1].keys():
        plots.data[-1]["plot_data"] = []

    plots.data[-1]["plot_data"].append(
        {
            "X": X,
            "Y": Y,
            "type": plot_type,
            "feat_name": config.name_mapping[feat_name],
            "x_name": config.name_mapping[x_name],
            "y_name": config.name_mapping[y_name],
            "Z": Z,
            "x_labels": x_labels,
            "y_labels": y_labels,
            "x_ticks": x_ticks,
            "y_ticks": y_ticks,
            "x_min": x_min,
            "x_max": x_max,
        }
    )


def load_data() -> pd.DataFrame:
    # Load data
    df = pd.read_csv(config.data_path)

    convert_dict = {
        "Temperature": int,
        "Hour": int,
        "Weekday": str,
    }

    df = df.astype(convert_dict)
    config.df_original = df

    return df


def preprocess_data(
    df: pd.DataFrame,
) -> Tuple[pd.Series, pd.Series, pd.Series, pd.Series]:
    # Select features
    X = df[config.numerical_cols + config.categorical_cols]
    y = df[config.target]

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.test_size, random_state=config.random_state
    )

    # Preprocessing
    numeric_transformer = FunctionTransformer(feature_names_out="one-to-one")
    categorical_transformer = OneHotEncoder(handle_unknown="ignore", drop="first")

    ct = ColumnTransformer(
        transformers=[
            (
                "num",
                numeric_transformer,
                X.select_dtypes(include=["int64", "float64"]).columns,
            ),
            (
                "cat",
                categorical_transformer,
                X.select_dtypes(include=["object"]).columns,
            ),
        ]
    )

    X_train = ct.fit_transform(X_train)
    X_test = ct.transform(X_test)

    return X_train, X_test, y_train, y_test, ct


def train_model(
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: pd.DataFrame,
    y_test: pd.DataFrame,
    ct: ColumnTransformer,
) -> ExplainableBoostingRegressor:

    param_grid_dict = list(ParameterGrid(config.parameters))
    logger.info(f"Number of parameter options: {len(param_grid_dict)}\n\n")
    for i, params in enumerate(param_grid_dict):
        print(params)
        logger.info(f"Training model {i + 1} of {len(param_grid_dict)}")
        # Train model
        manual_params = {
            "max_bins": 16,
            "min_samples_leaf": 64,
            "interactions": [(0, 1)],
        }
        # model_params = {
        #     param_name: param_value
        #     for (param_name, param_value) in params.items()
        #     if param_name != "monotonicity_constraints"
        # }
        ebm = ExplainableBoostingRegressor(
            feature_names=ct.get_feature_names_out(),
            random_state=config.random_state,
            n_jobs=-1,
            # **model_params,
            **manual_params,
        )
        ebm.fit(X_train, y_train)
        try:
            if params["monotonicity_constraints"]:
                for mono_index, feature in enumerate(
                    params["monotonicity_constraints"]
                ):
                    if feature not in params["exclude"]:
                        logger.debug(f"Monotonize: {feature}")
                        ebm = ebm.monotonize(feature)
                    else:
                        params["monotonicity_constraints"].pop(mono_index)
        except KeyError:
            logger.warning(
                "No monotonicity constraints in parameter found. Pipeline just continued."
            )
        score = ebm.score(X_test, y_test)
        logger.debug(f"R^2 score: {score:.6f} Params: {params}")

        # Save the model
        # Generate the model_dir dynamically based on the params dictionary
        model_dir = "__".join([f"{key}_{value}" for key, value in params.items()])
        model_dir += f"__score_{score:.6f}"
        model_path = f"{config.model_save_path}/{model_dir}"
        os.makedirs(model_path, exist_ok=True)
        with open(f"{model_path}/model.pkl", "wb") as f:
            pickle.dump(ebm, f)

        # Save the data
        plots.data.append(dict(copy.deepcopy(params), score=score))
        create_plots(ebm, model_path)


def create_plots(ebm: ExplainableBoostingRegressor, model_path: str | os.PathLike):
    ebm_global = ebm.explain_global(name="EBM")
    os.makedirs(f"{model_path}/jpg/", exist_ok=True)
    os.makedirs(f"{model_path}/svg/", exist_ok=True)

    # Save feature importances
    for index, feat_name in enumerate(ebm_global.data()["names"]):
        logger.debug(f"Create plot for {feat_name}.")
        feat_data = ebm_global.data(index)
        # Is interaction:
        if feat_data["type"] == "interaction":
            feature_name_left, feature_name_right = feat_name.split(" & ")
            create_interaction_plot(model_path, ebm_global, index, feat_name)
            y_values = ebm_global.data(index)["right_names"]
            if len(y_values) == 3:
                y_ticks = [0.25, 0.75]
                y_labels = ["No", "Yes"]
            else:
                y_ticks = None
                y_labels = None

            add_plot_data(
                index,
                np.array(ebm_global.data(index)["left_names"]),
                y_values,
                "interaction",
                feat_name,
                feature_name_left,
                feature_name_right,
                Z=np.transpose(ebm_global.data(index)["scores"])
                + 20,  # Hacky to construct case as we want
                y_ticks=y_ticks if y_ticks is not None else None,
                y_labels=y_labels if y_labels is not None else None,
            )
        # Is categorical:
        elif feat_name.split("__")[0] == "cat":
            create_cat_plot(model_path, ebm_global, index, feat_name)
            y_values = np.append(
                ebm_global.data(index)["scores"], ebm_global.data(index)["scores"][-1]
            )
            # Replace to construct a better "case"
            y_values = np.array([-6, -6, 21])

            x_values = np.array(ebm_global.data(index)["names"])
            add_plot_data(
                index,
                [  # This is a bit hacky, to show the plot as bar plot.
                    x_values[0],
                    x_values[-1],
                ],
                [  # This is a bit hacky, to show the plot as bar plot.
                    y_values[0],
                    y_values[-1],
                ],
                "categorical",
                feat_name,
                feat_name,
                "Effect on Prediction",
                x_ticks=[0.25, 0.75],
                x_labels=["No", "Yes"],
            )
        # Is numerical:
        else:
            create_num_plot(model_path, ebm_global, index, feat_name)
            y_values = np.append(
                ebm_global.data(index)["scores"], ebm_global.data(index)["scores"][-1]
            )

            y_values = y_values + 10

            x_values = np.array(ebm_global.data(index)["names"])
            x_min = config.df_original[feat_name.split("__")[1]].min()
            x_max = config.df_original[feat_name.split("__")[1]].max()

            add_plot_data(
                index,
                x_values,
                y_values,
                "numerical",
                feat_name,
                feat_name,
                "Effect on Prediction",
                x_min=x_min,
                x_max=x_max,
            )


def create_cat_plot(model_path, ebm_global, index, feat):
    y_values = np.append(
        ebm_global.data(index)["scores"], ebm_global.data(index)["scores"][-1]
    )
    x_values = np.array(ebm_global.data(index)["names"])
    x_labels = list(range(len(x_values)))

    plt.xlim(0, 1)
    plt.xticks(ticks=[0.25, 0.75], labels=[0, 1])
    plt.title(f"{feat} Feature Effect")
    plt.xlabel(f"{feat}'s value")
    plt.ylabel("Effect on Prediction")
    plt.step(ebm_global.data(index)["names"], y_values, where="post")
    plt.savefig(f"{model_path}/jpg/{feat}.jpg", format="jpg", dpi=300)
    plt.savefig(f"{model_path}/svg/{feat}.svg", format="svg")

    plt.close()


def create_num_plot(model_path, ebm_global, index, feat):
    y_values = np.append(
        ebm_global.data(index)["scores"], ebm_global.data(index)["scores"][-1]
    )
    x_values = np.array(ebm_global.data(index)["names"])
    x_labels = list(range(len(x_values)))
    # We do not use the intercept value. Means, some feat combinations lead to negativ bike counts. This is confusing.
    # Hence, we artificially move up the y-value to avoid this confusion as no negativ bike counts are possible.

    plt.xlim(
        config.df_original[feat.split("__")[1]].min(),
        config.df_original[feat.split("__")[1]].max(),
    )
    plt.title(f"{feat} Feature Effect")
    plt.xlabel(f"{feat}'s value")
    plt.ylabel("Effect on Prediction")

    plt.step(ebm_global.data(index)["names"], y_values, where="post")
    plt.savefig(f"{model_path}/jpg/{feat}.jpg", format="jpg", dpi=300)
    plt.savefig(f"{model_path}/svg/{feat}.svg", format="svg")
    plt.close()


def create_interaction_plot(model_path, ebm_global, index, feat_name):
    fig, ax = plt.subplots()
    im = ax.pcolormesh(
        ebm_global.data(index)["left_names"],
        ebm_global.data(index)["right_names"],
        np.transpose(ebm_global.data(index)["scores"]),
        shading="flat",
    )
    fig.colorbar(im, ax=ax)
    feature_name_left, feature_name_right = feat_name.split(" & ")
    plt.xlabel(feature_name_left)
    plt.ylabel(feature_name_right)
    plt.title(f"Feature: {feature_name_right} x {feature_name_left}")
    # fig.tight_layout()
    plt.savefig(f"{model_path}/jpg/{feat_name}.jpg", format="jpg", dpi=300)
    plt.savefig(f"{model_path}/svg/{feat_name}.svg", format="svg")
    plt.close()


def main() -> None:
    df = load_data()
    X_train, X_test, y_train, y_test, ct = preprocess_data(df)
    train_model(X_train, X_test, y_train, y_test, ct)
    scores_df = pd.DataFrame(plots.data)
    scores_df.to_csv("ice_scores.csv", index=False)
    scores_df.to_excel("ice_scores.xlsx", index=False)
    scores_df.to_json("plot_data_ice_cream.json", orient="records")


if __name__ == "__main__":
    main()
