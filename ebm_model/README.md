# Model Training

This folder contains the training script and the plotting script. 

## Training

The training script (`ebm_trainer.py`) is responsible for training the Explainable Boosting Machine (EBM) models. It preprocesses the data, configures the model parameters, performs the training process on the provided datasets, and saves the trained models. The script also stores plot data and saves those in (`plot_data.json`). **The plot_data.json script is already filled with the necessary plot datas.**

## Plotting

The plotting script (`ebm_plotter.py`) is responsible for generating plots based on the data stored in `plot_data.json`. It provides visualizations for numerical, categorical and interaction plots.

## Usage

To run the scripts in this folder, follow the steps below:

1. **Create a Virtual Environment**:
    - Open a terminal in the folder directory.
    - Run the following command to create a virtual environment:
  
      ```bash
      python -m venv .venv
      ```

    - Activate the virtual environment:

        ```bash
        .venv\Scripts\activate
        ```

2. **Install Requirements**:
    - Install the necessary packages by using the requirements file:

      ```bash
      pip install -r requirements.txt
      ```

3. **Run Training Script**:
    - Execute the training script to train the EBM models:

      ```bash
      python ebm_trainer.py
      ````

4. **Run Plotting Script**:
   - Execute the plotting script to generate the plots:

    ```bash
    python plotter.py
    ```