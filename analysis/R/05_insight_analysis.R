# 05_insight_analysis.R
source("R/00_setup.R")

# Load data
data_scores <- read_rds("outputs/data/processed_data.rds")

# Basic insight metrics
insight_metrics <- data_scores %>%
  select(group, matches("^insight\\d+$")) %>%
  group_by(group) %>%
  summarise(
    across(matches("^insight\\d+$"), 
           list(
             words = ~mean(str_count(., "\\w+"), na.rm = TRUE),
             chars = ~mean(nchar(.), na.rm = TRUE)
           )
    )
  )

# Quality metrics per insight
insight_quality <- data_scores %>%
  select(internalId, group, matches("^insight\\d+$")) %>%
  pivot_longer(
    cols = matches("^insight\\d+$"),
    names_to = "insight_number",
    values_to = "text"
  ) %>%
  mutate(
    # Content metrics
    has_numbers = str_detect(text, "\\d+"),  # Contains numerical evidence
    has_comparison = str_detect(text, "more|less|higher|lower|increase|decrease"),
    has_conditional = str_detect(text, "if|when|during|while"),
    has_time = str_detect(text, "am|pm|morning|afternoon|evening|\\d+:\\d+"),
    has_temperature = str_detect(text, "degree|temp|°|cold|hot|warm"),
    has_weather = str_detect(text, "wind|speed|weather|temperature"),
    has_causality = str_detect(text, "because|therefore|cause|lead|due to"),
    
    # Calculate quality score
    quality_score = has_numbers + has_comparison + has_conditional + 
      has_time + has_temperature + has_weather + has_causality
  )

# Aggregate quality metrics by group
quality_summary <- insight_quality %>%
  group_by(group) %>%
  summarise(
    n_insights = n(),
    mean_quality = mean(quality_score, na.rm = TRUE),
    sd_quality = sd(quality_score, na.rm = TRUE),
    pct_numerical = mean(has_numbers, na.rm = TRUE) * 100,
    pct_comparative = mean(has_comparison, na.rm = TRUE) * 100,
    pct_temporal = mean(has_time, na.rm = TRUE) * 100,
    pct_causal = mean(has_causality, na.rm = TRUE) * 100
  ) %>%
  mutate(across(where(is.numeric), ~round(., 2)))

# Statistical tests
# Compare quality scores between groups
quality_test <- wilcox.test(quality_score ~ group, data = insight_quality)

# Compare insight lengths
length_test <- wilcox.test(
  str_count(text, "\\w+") ~ group, 
  data = insight_quality
)

# Print results
cat("Insight Quality Summary by Group:\n")
print(quality_summary)

cat("\nStatistical Tests:\n")
cat("Quality Score Comparison (Wilcoxon test):\n")
cat("W =", quality_test$statistic, ", p =", round(quality_test$p.value, 3), "\n")

cat("\nInsight Length Comparison (Wilcoxon test):\n")
cat("W =", length_test$statistic, ", p =", round(length_test$p.value, 3), "\n")

# Visualizations
# 1. Quality score distribution
quality_plot <- ggplot(insight_quality, aes(x = quality_score, fill = group)) +
  geom_density(alpha = 0.5) +
  labs(
    title = "Distribution of Insight Quality Scores",
    x = "Quality Score",
    y = "Density",
    fill = "Group"
  ) +
  theme_minimal()
quality_plot

# 2. Feature presence by group
feature_summary <- insight_quality %>%
  group_by(group) %>%
  summarise(
    Numerical = mean(has_numbers) * 100,
    Comparative = mean(has_comparison) * 100,
    Conditional = mean(has_conditional) * 100,
    Temporal = mean(has_time) * 100,
    Temperature = mean(has_temperature) * 100,
    Weather = mean(has_weather) * 100,
    Causal = mean(has_causality) * 100
  ) %>%
  pivot_longer(-group, names_to = "feature", values_to = "percentage")

feature_plot <- ggplot(feature_summary, 
                       aes(x = feature, y = percentage, fill = group)) +
  geom_bar(stat = "identity", position = "dodge") +
  labs(
    title = "Presence of Features in Insights by Group",
    x = "Feature",
    y = "Percentage of Insights",
    fill = "Group"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
feature_plot

# Save results
write_csv(quality_summary, "outputs/data/insight_quality_summary.csv")
write_csv(feature_summary, "outputs/data/insight_feature_summary.csv")

# Save plots
ggsave("outputs/figures/insight_quality_distribution.pdf", quality_plot, 
       width = 10, height = 6)
ggsave("outputs/figures/insight_features.pdf", feature_plot, 
       width = 12, height = 6)

