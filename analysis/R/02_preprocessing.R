# 02_preprocessing.R
source("R/00_setup.R")

# Read joined data
joined_data <- read_rds("outputs/data/joined_data.rds")

# Remove participants who failed attention checks
data_clean <- joined_data %>%
  mutate(
    # Count failed attention checks (AC1 should be 7, AC2 should be 1, personalizationAC should be -1 or 4)
    failed_ac = (AC1 != 7) + (AC2 != 1) + (personalizationAC != 4) - (personalizationAC == -1),
    passed_attention = failed_ac <= 1  # Pass if failed 1 or fewer ACs
  ) %>%
  filter(passed_attention)

# Print attention check summary
cat("Attention Check Summary:\n")
cat("Original participants:", nrow(joined_data), "\n")
cat("Participants after AC:", nrow(data_clean), "\n")
cat("Removed:", nrow(joined_data) - nrow(data_clean), "participants\n\n")

# Remove extreme completion times
data_clean <- data_clean %>%
  mutate(time_in_minutes = time_taken / 60) %>%
  filter(time_in_minutes <= 60)  # Remove participants who took more than 60 minutes

# Print time cleaning summary
cat("Time Cleaning Summary:\n")
cat("Participants after time cleaning:", nrow(data_clean), "\n")
cat("Time taken (minutes):\n")
print(summary(data_clean$time_in_minutes))
cat("\n")

# Calculate construct scores
data_scores <- data_clean %>%
  mutate(
    # Calculate scores
    PH_score = evaluationHelpfulnessRating,
    PU_score = rowMeans(select(., starts_with("PU")), na.rm = TRUE),
    PEOU_score = rowMeans(select(., starts_with("PEOU")), na.rm = TRUE),
    
    # PCE with reverse coding
    PCE2 = 8 - PCE2,
    PCE4 = 8 - PCE4,
    PCE_score = rowMeans(select(., starts_with("PCE")), na.rm = TRUE),
    
    # Perceived Informativeness
    PIN_score = rowMeans(select(., starts_with("PIN")), na.rm = TRUE),
    
    GOAL_score = rowMeans(select(., starts_with("GOAL")), na.rm = TRUE)
  )

# Calculate reliability
reliabilities <- tibble(
  construct = c("PU", "PEOU", "PCE", "PIN", "GOAL"),
  cronbachs_alpha = c(
    psych::alpha(data_scores %>% select(starts_with("PU")), warnings = FALSE)$total$raw_alpha,
    psych::alpha(data_scores %>% select(starts_with("PEOU")), warnings = FALSE)$total$raw_alpha,
    psych::alpha(data_scores %>% select(starts_with("PCE")), warnings = FALSE)$total$raw_alpha,
    psych::alpha(data_scores %>% select(starts_with("PIN")), warnings = FALSE)$total$raw_alpha,
    psych::alpha(data_scores %>% select(starts_with("GOAL")), warnings = FALSE)$total$raw_alpha
  )
)

# Print construct summary by group
cat("Construct Summary by Group:\n")
construct_summary <- data_scores %>%
  group_by(group) %>%
  summarise(
    n = n(),
    PU_mean = mean(PU_score, na.rm = TRUE),
    PEOU_mean = mean(PEOU_score, na.rm = TRUE),
    PCE_mean = mean(PCE_score, na.rm = TRUE),
    PIN_mean = mean(PIN_score, na.rm = TRUE),
    GOAL_mean = mean(GOAL_score, na.rm = TRUE),
    PH_mean = mean(PH_score, na.rm = TRUE)
  )
print(construct_summary)

cat("\nReliability Analysis:\n")
print(reliabilities)

# Check for missing data
missing_data <- data_scores %>%
  summarise(across(everything(), ~sum(is.na(.)))) %>%
  pivot_longer(everything(), 
               names_to = "variable", 
               values_to = "missing_count") %>%
  filter(missing_count > 0) %>%
  arrange(desc(missing_count))

if(nrow(missing_data) > 0) {
  cat("\nMissing Data Summary:\n")
  print(missing_data)
}

# Create age groups
data_scores <- data_scores %>%
  mutate(
    age_group = cut(
      age,
      breaks = c(0, 30, 40, 50, Inf),
      labels = c("20-30", "31-40", "41-50", "50+")
    )
  )

# Save processed data
write_rds(data_scores, "outputs/data/processed_data.rds")
write_csv(construct_summary, "outputs/data/construct_summary.csv")
write_csv(reliabilities, "outputs/data/reliabilities.csv")

