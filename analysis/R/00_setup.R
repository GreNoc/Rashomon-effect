# 00_setup.R
library(tidyverse)
library(psych)
library(corrplot)
library(ggpubr)
library(tidytext)
library(stringr)
library(quanteda)
library(wordcloud)
library(effsize)  # for effect sizes
library(rstatix)     # for tidy statistical tests
library(scales)      # for better scale formatting

# Set theme for all plots
theme_set(
  theme_minimal() +
    theme(
      plot.title = element_text(size = 14, face = "bold"),
      axis.title = element_text(size = 12),
      axis.text = element_text(size = 10),
      legend.position = "bottom"
    )
)

# Custom color palettes
scale_color_custom <- scale_color_viridis_d
scale_fill_custom <- scale_fill_viridis_d