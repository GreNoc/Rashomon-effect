# utils.R
calculate_reliability <- function(data, prefix) {
  items <- select(data, starts_with(prefix))
  alpha_result <- psych::alpha(items)
  return(list(
    alpha = alpha_result$total$raw_alpha,
    mean = alpha_result$total$mean,
    sd = alpha_result$total$sd,
    n_items = ncol(items)
  ))
}

format_statistics <- function(x, digits = 2) {
  sprintf(paste0("%.", digits, "f"), x)
}