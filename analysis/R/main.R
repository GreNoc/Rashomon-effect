# main.R
source("R/00_setup.R")
source("R/utils.R")
source("R/01_load_data.R")
source("R/02_preprocessing.R")
source("R/03_demographics.R")
source("R/04_visualization.R")
source("R/05_insight_analysis.R")

# Load and process data
raw_data <- load_survey_data()
joined_data <- join_datasets(raw_data$survey, raw_data$demographics)
# Get details about removed participants before processing
removed_participants <- get_attention_check_details(joined_data)
write_csv(removed_participants, "outputs/tables/removed_participants.csv")
processed_data <- joined_data %>%
  filter(prolificId != "60f9a6667b1fcbceec1401ea") %>%
  calculate_scores() %>%
  create_age_groups()

# Check data quality
missing_data <- check_missing_data(processed_data)
reliabilities <- check_construct_reliability(processed_data)
write_csv(missing_data, "outputs/tables/missing_data.csv")
write_csv(reliabilities, "outputs/tables/reliabilities.csv")

# Validity checks
validity_results <- check_validity(processed_data)
write_csv(as.data.frame(validity_results$correlations), 
          "outputs/tables/validity_correlations.csv")
write_csv(validity_results$metrics, 
          "outputs/tables/validity_metrics.csv")

# Demographic analysis
demographic_summary <- create_demographic_summary_table(processed_data)
demographic_tests <- analyze_scores_by_demographics(processed_data)
write_csv(demographic_summary, "outputs/tables/demographic_summary.csv")

# Group comparisons
group_comparisons <- analyze_by_groups(processed_data)
write_csv(group_comparisons$gender, 
          "outputs/tables/gender_comparisons.csv")
write_csv(group_comparisons$experience, 
          "outputs/tables/experience_comparisons.csv")

# Analyze user insights
user_insight_results <- analyze_user_insights(processed_data)
insight_plots <- plot_user_insight_quality(user_insight_results)
insight_examples <- get_insight_examples(processed_data, user_insight_results)
insight_factors <- analyze_insight_quality_factors(user_insight_results, processed_data)

# Save results
write_csv(user_insight_results %>% 
            select(internalId, overall_quality, specificity_score, 
                   analytical_score, domain_score, quality_rank),
          "outputs/tables/user_insight_quality.csv")

write_csv(insight_examples, "outputs/tables/insight_examples.csv")

# Print summary
cat("\nInsight Analysis Summary:\n")
cat("Mean quality score:", mean(user_insight_results$overall_quality), "\n")
cat("Quality score range:", range(user_insight_results$overall_quality), "\n")
cat("\nCorrelations with other measures:\n")
print(insight_factors$correlations)

# Create visualizations
plots <- list(
  constructs = plot_construct_distributions(processed_data),
  correlations = plot_score_correlations(processed_data),
  experience = plot_scores_by_experience(processed_data),
  time = plot_time_analysis(processed_data),
  insights = analyze_text_insights(processed_data)
)

# Add plots to the plot list
plots$insight_quality <- insight_plots$quality_dist
plots$insight_components <- insight_plots$components

# Save all plots
walk2(
  plots,
  names(plots),
  ~save_plots(.x, .y)
)

print(plots)

# Save all plots
walk2(
  plots,
  names(plots),
  ~save_plots(.x, .y)
)

# Create a summary report
cat("\nAnalysis Summary:\n")
cat("----------------\n")
cat("Sample size:", nrow(processed_data), "\n")
cat("Reliability range:", 
    round(min(reliabilities$cronbachs_alpha), 2), "to",
    round(max(reliabilities$cronbachs_alpha), 2), "\n")
cat("Number of insights analyzed:", 
    sum(!is.na(processed_data$insight1)), "\n\n")
