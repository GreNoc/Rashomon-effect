# 01_load_data.R
source("R/00_setup.R")

# Read raw data files
survey_data <- read_csv("data/data_pre-survey.csv") %>%
  # Clean up the index column if present
  select(-matches("^$|^Unnamed")) 

demographic_data <- read_csv("data/demographic-data_pre-survey.csv") %>%
  # Select only relevant columns and clean names
  select(
    prolific_id = `Participant id`,
    age = `Age`,
    sex = `Sex`,
    ethnicity = `Ethnicity simplified`,
    country = `Country of residence`,
    nationality = `Nationality`,
    employment = `Employment status`,
    mgmt_experience = `Years of management experience`,
    student_status = `Student status`,
    time_taken = `Time taken`,
    total_approvals = `Total approvals`,
    language = `Language` 
    ) %>%
  mutate(
    age = as.numeric(age),
    time_taken = as.numeric(time_taken)
)

# Print basic data summary
cat("Data Summary:\n")
cat("Total participants:", nrow(survey_data), "\n")
cat("Treatment group:", sum(survey_data$group == "Treatment"), "\n")
cat("Control group:", sum(survey_data$group == "Control"), "\n")

# Join datasets
joined_data <- survey_data %>%
  left_join(
    demographic_data,
    by = c("prolificId" = "prolific_id")
  )

# Check if we lost any data in the join
if(nrow(survey_data) != nrow(joined_data)) {
  warning(sprintf("Some participants lost in join: %d -> %d", 
                  nrow(survey_data), nrow(joined_data)))
}

# Print group summary
cat("\nParticipant Summary by Group:\n")
group_summary <- joined_data %>%
  group_by(group) %>%
  summarise(
    n = n(),
    age_mean = round(mean(age, na.rm = TRUE), 1),
    pct_male = round(mean(sex == "Male", na.rm = TRUE) * 100, 1),
    time_mean_min = round(mean(time_taken, na.rm = TRUE) / 60, 1)  # Convert to minutes
  )
print(group_summary)

# Create outputs directory if it doesn't exist
dir.create("outputs", showWarnings = FALSE)
dir.create("outputs/data", showWarnings = FALSE)

# Save processed data
write_rds(joined_data, "outputs/data/joined_data.rds")
write_csv(group_summary, "outputs/data/group_summary.csv")

