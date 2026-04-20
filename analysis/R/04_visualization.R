# 04_visualization.R
source("R/00_setup.R")

# Load data
data_scores <- read_rds("outputs/data/processed_data.rds")

# Create consistent theme
theme_set(
  theme_minimal() +
    theme(
      legend.position = "bottom",
      axis.text.x = element_text(angle = 45, hjust = 1),
      plot.title = element_text(hjust = 0.5, size = 14, face = "bold")
    )
)

# 1. Distribution of construct scores by group
construct_dist <- data_scores %>%
  select(group, PH_score, PU_score, PEOU_score, PCE_score, PIN_score) %>%
  pivot_longer(
    cols = -group,
    names_to = "construct",
    values_to = "score"
  ) %>%
  ggplot(aes(x = construct, y = score, fill = group)) +
  geom_boxplot(alpha = 0.7) +
  scale_y_continuous(limits = c(1, 7)) +
  labs(
    title = "Distribution of Construct Scores by Group",
    x = "Construct",
    y = "Score (1-7)",
    fill = "Group"
  )
construct_dist

# 2. Score correlations by group
plot_correlation_matrix <- function(data, group_name) {
  # Calculate correlation matrix
  cor_matrix <- data %>%
    select(PH_score:PIN_score) %>%
    cor() %>%
    round(2)
  
  # Convert to long format
  cor_data <- cor_matrix %>%
    as.data.frame() %>%
    rownames_to_column("var1") %>%
    pivot_longer(-var1, names_to = "var2", values_to = "correlation")
  
  # Create plot
  ggplot(cor_data, aes(x = var1, y = var2, fill = correlation)) +
    geom_tile() +
    geom_text(aes(label = sprintf("%.2f", correlation)), 
              color = ifelse(abs(cor_data$correlation) > 0.5, "white", "black")) +
    scale_fill_gradient2(low = "red", high = "blue", mid = "white",
                         midpoint = 0, limit = c(-1,1)) +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    labs(
      title = paste("Correlation Matrix -", group_name),
      x = "", y = "", fill = "Correlation"
    )
}

# Create correlation plots for each group
cor_plot_treatment <- plot_correlation_matrix(
  filter(data_scores, group == "Treatment"),
  "Treatment Group"
)
cor_plot_treatment

cor_plot_control <- plot_correlation_matrix(
  filter(data_scores, group == "Control"),
  "Control Group"
)
cor_plot_control

# 3. Experience vs. scores by group
experience_scores <- data_scores %>%
  select(group, mgmt_experience, PH_score:PIN_score) %>%
  pivot_longer(
    cols = c(PH_score:PIN_score),
    names_to = "construct",
    values_to = "score"
  ) %>%
  ggplot(aes(x = mgmt_experience, y = score, fill = group)) +
  geom_boxplot() +
  facet_wrap(~construct) +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  labs(
    title = "Scores by Management Experience and Group",
    x = "Years of Experience",
    y = "Score",
    fill = "Group"
  )
experience_scores

# Save plots
dir.create("outputs/figures", showWarnings = FALSE)

ggsave(
  "outputs/figures/construct_distributions.pdf",
  construct_dist,
  width = 10, height = 6
)

ggsave(
  "outputs/figures/correlation_treatment.pdf",
  cor_plot_treatment,
  width = 8, height = 8
)

ggsave(
  "outputs/figures/correlation_control.pdf",
  cor_plot_control,
  width = 8, height = 8
)

ggsave(
  "outputs/figures/experience_scores.pdf",
  experience_scores,
  width = 12, height = 8
)

# Save summary statistics
score_summary <- data_scores %>%
  group_by(group) %>%
  summarise(
    across(
      c(PH_score:GOAL_score),
      list(
        mean = ~mean(., na.rm = TRUE),
        sd = ~sd(., na.rm = TRUE)
      )
    )
  )

write_csv(score_summary, "outputs/data/score_summary.csv")

# Print basic statistics
cat("Score Summary by Group:\n")
print(score_summary)

