# 03_demographics.R
source("R/00_setup.R")

# Load processed data
data_scores <- read_rds("outputs/data/processed_data.rds")

# Overall demographic summary
demographic_summary <- data_scores %>%
  group_by(group) %>%
  summarise(
    n = n(),
    age_mean = mean(age, na.rm = TRUE),
    age_sd = sd(age, na.rm = TRUE),
    pct_male = mean(sex == "Male", na.rm = TRUE) * 100,
    pct_female = mean(sex == "Female", na.rm = TRUE) * 100,
    pct_experienced = mean(mgmt_experience == "5+ years", na.rm = TRUE) * 100,
    countries = n_distinct(country)
  ) %>%
  mutate(across(where(is.numeric), ~round(., 1)))

# Test for demographic differences between groups
# Age comparison
age_test <- wilcox.test(age ~ group, data = data_scores)

# Gender distribution
gender_test <- chisq.test(table(data_scores$group, data_scores$sex))
print(gender_test)

# Experience distribution
experience_test <- chisq.test(table(data_scores$group, data_scores$mgmt_experience))
print(experience_test)

# Save test results
demographic_tests <- tibble(
  test = c("Age", "Gender", "Experience"),
  statistic = c(age_test$statistic, gender_test$statistic, experience_test$statistic),
  p_value = c(age_test$p.value, gender_test$p.value, experience_test$p.value)
) %>%
  mutate(
    significant = p_value < 0.05,
    p_value = round(p_value, 3)
  )

# Print results
cat("Demographic Summary by Group:\n")
print(demographic_summary)

cat("\nTests for Group Differences:\n")
print(demographic_tests)

# Age distribution visualization
age_plot <- ggplot(data_scores, aes(x = age, fill = group)) +
  geom_density(alpha = 0.5) +
  labs(title = "Age Distribution by Group",
       x = "Age",
       y = "Density") +
  theme_minimal()

# Print age_plot
age_plot

# Experience distribution
experience_plot <- ggplot(data_scores, 
                          aes(x = mgmt_experience, fill = group)) +
  geom_bar(position = "dodge") +
  labs(title = "Management Experience by Group",
       x = "Years of Experience",
       y = "Count") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

# Print experience plot
experience_plot

# Save plots
ggsave("outputs/figures/age_distribution.pdf", age_plot, width = 8, height = 6)
ggsave("outputs/figures/experience_distribution.pdf", experience_plot, width = 8, height = 6)

# Save summaries
write_csv(demographic_summary, "outputs/data/demographic_summary.csv")
write_csv(demographic_tests, "outputs/data/demographic_tests.csv")
