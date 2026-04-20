# 06_group_analysis.R
source("R/00_setup.R")

# Load data
data_scores <- read_rds("outputs/data/processed_data.rds")

# 1. Descriptive Statistics by Group
group_descriptives <- data_scores %>%
  group_by(group) %>%
  summarise(
    n = n(),
    across(
      c(PH_score, PU_score, PEOU_score, PCE_score, PIN_score, GOAL_score),
      list(
        mean = ~mean(., na.rm = TRUE),
        sd = ~sd(., na.rm = TRUE),
        median = ~median(., na.rm = TRUE)
      ),
      .names = "{.col}_{.fn}"
    )
  )

# 2. Statistical Tests
# Shapiro-Wilk test for normality
normality_tests <- data_scores %>%
  select(group, PH_score:GOAL_score) %>%
  pivot_longer(-group, names_to = "measure", values_to = "score") %>%
  group_by(measure, group) %>%
  summarise(
    shapiro_stat = shapiro.test(score)$statistic,
    shapiro_p = shapiro.test(score)$p.value,
    .groups = "drop"
  )

# Mann-Whitney U tests for group differences
construct_tests <- tibble(
  construct = c("PH_score", "PU_score", "PEOU_score", "PCE_score", "PIN_score", "GOAL_score")
) %>%
  rowwise() %>%
  mutate(
    test = list(wilcox.test(data_scores[[construct]] ~ data_scores$group)),
    statistic = test$statistic,
    p_value = test$p.value,
    significant = p_value < 0.05
  ) %>%
  select(-test)
construct_tests

# Calculate effect sizes (Cohen's d)
effect_sizes <- tibble(
  construct = c("PH_score", "PU_score", "PEOU_score", "PCE_score", "PIN_score", "GOAL_score")
) %>%
  rowwise() %>%
  mutate(
    cohens_d = effsize::cohen.d(data_scores[[construct]] ~ data_scores$group)$estimate
  )
effect_sizes

# 3. Demographic Influence Analysis
# Experience effect by group
experience_analysis <- data_scores %>%
  group_by(group, mgmt_experience) %>%
  summarise(
    n = n(),
    PH_mean = mean(PH_score, na.rm = TRUE),
    PU_mean = mean(PU_score, na.rm = TRUE),
    PEOU_mean = mean(PEOU_score, na.rm = TRUE),
    PCE_mean = mean(PCE_score, na.rm = TRUE),
    PIN_mean = mean(PIN_score, na.rm = TRUE),
    GOAL_mean = mean(GOAL_score, na.rm = TRUE),
    .groups = "drop"
  )

# Kruskal-Wallis tests for experience effect within each group
experience_tests <- data_scores %>%
  group_by(group) %>%
  summarise(
    across(
      c(PH_score:PIN_score),
      ~kruskal.test(. ~ mgmt_experience)$p.value,
      .names = "{.col}_p"
    )
  )

# 4. Print Results
cat("Group Analysis Results\n")
cat("=====================\n\n")

cat("1. Sample Sizes:\n")
print(table(data_scores$group))

cat("\n2. Construct Differences:\n")
results_table <- construct_tests %>%
  left_join(effect_sizes, by = "construct") %>%
  mutate(
    across(where(is.numeric), ~round(., 3)),
    interpretation = case_when(
      !significant ~ "No significant difference",
      significant & cohens_d > 0 ~ "Treatment significantly higher",
      significant & cohens_d < 0 ~ "Control significantly higher"
    )
  )
print(results_table)

# 5. Visualizations
# Score distributions by group
score_distributions <- data_scores %>%
  select(group, PH_score:GOAL_score) %>%
  pivot_longer(-group, names_to = "measure", values_to = "score") %>%
  ggplot(aes(x = score, fill = group)) +
  geom_density(alpha = 0.5) +
  facet_wrap(~measure) +
  labs(
    title = "Score Distributions by Group",
    x = "Score",
    y = "Density"
  ) +
  theme_minimal()
score_distributions

# Effect size plot
effect_plot <- ggplot(effect_sizes, aes(x = construct, y = cohens_d)) +
  geom_col(fill = "steelblue") +
  geom_hline(yintercept = 0, linetype = "dashed") +
  labs(
    title = "Effect Sizes (Cohen's d) for Group Differences",
    x = "Construct",
    y = "Cohen's d"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
effect_plot

# Save results
write_csv(group_descriptives, "outputs/data/group_descriptives.csv")
write_csv(results_table, "outputs/data/group_differences.csv")
write_csv(experience_analysis, "outputs/data/experience_analysis.csv")

# Save plots
ggsave("outputs/figures/score_distributions.pdf", score_distributions, 
       width = 12, height = 8)
ggsave("outputs/figures/effect_sizes.pdf", effect_plot, 
       width = 8, height = 6)

# Print summary for paper
cat("\nSummary for Paper:\n")
cat("=================\n")
significant_results <- results_table %>%
  filter(significant) %>%
  arrange(desc(abs(cohens_d)))

if(nrow(significant_results) > 0) {
  cat("Significant group differences were found for the following constructs:\n")
  walk2(
    significant_results$construct,
    significant_results$interpretation,
    ~cat(sprintf("- %s: %s (d = %.2f)\n", 
                 .x, .y, 
                 significant_results$cohens_d[significant_results$construct == .x]))
  )
} else {
  cat("No significant differences were found between Treatment and Control groups.\n")
}

