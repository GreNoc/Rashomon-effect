import marimo

__generated_with = "0.9.10"
app = marimo.App(width="medium")


@app.cell
def __():
    import json
    import pandas as pd
    return json, pd


@app.cell
def __(pd):
    df_hour = pd.read_csv("bikesharing_dataset/hour.csv")
    df_day = pd.read_csv("bikesharing_dataset/day.csv")
    return df_day, df_hour


@app.cell
def __(df_day, df_hour, json):
    with open("prepared_data/bikesharing_hour.json", 'w') as fp:
        json.dump(df_hour.to_dict("records"), fp)

    with open("prepared_data/bikesharing_day.json", 'w') as fp:
        json.dump(df_day.to_dict("records"), fp)
    return (fp,)


@app.cell
def __(df_hour):
    df_hour.head()
    return


@app.cell
def __():
    return


if __name__ == "__main__":
    app.run()
