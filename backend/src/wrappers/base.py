from abc import ABC, abstractmethod

import numpy as np


class ModelWrapper(ABC):
    """
    Abstract Class for all model wrappers.
    Every wrapper must implement these methods so that train_model() 
    and create_plots() can work model-agnostically. 
    """

    @abstractmethod
    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """Train the model."""
        ...
    
    @abstractmethod
    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        """Return R² score."""
        ...
    
    @abstractmethod
    def get_feature_names(self) -> list[str]:
        """
        Return list of feature names in the same order as the columns in X.
        Example: ['num__hr', 'num__atemp', 'cat__workingday_1']
        """
        ...

    @abstractmethod
    def get_shape_data(self, feature_idx: int) -> dict:
        """
        Return shape function data for a single feature/term.

        Must return a dict with:
        {
            "type":        "numerical" | "categorical" | "interaction",
            "names":       List[float | str],   # x-axis values (main effect)
                                                # or left_names (interaction)
            "scores":      List[float] | np.ndarray,  # shape function values
                                                        # 2D array for interactions
            # Only for interactions:
            "left_names":  List[float],   # x-axis of first feature
            "right_names": List[float],   # y-axis of second feature
        }
        """
        ...

    @abstractmethod
    def get_term_names(self) -> list[str]:
        """
        Return list of term names (features + interactions) as they appear in plots.
        Interactions are separated by ' & '.
        Example: ['num__hr', 'num__atemp', 'num__hr & num__atemp']
        """
        ...

    def get_feature_importances(self) -> np.ndarray:
        """
        Return normalized feature importances (sum = 1).
        Default: variance of shape function over training data.
        Override in subclass if the model provides its own importance scores.
        """
        importances = []
        for i in range(len(self.get_term_names())):
            data = self.get_shape_data(i)
            if data["type"] == "interaction":
                importances.append(np.var(data["scores"]))
            else:
                importances.append(np.var(data["scores"]))
        importances = np.array(importances)
        total = importances.sum()
        if total == 0:
            return np.ones(len(importances)) / len(importances)
        return importances / total
