include {
  path = find_in_parent_folders()
}

retryable_errors = [
  "(?s).*Error installing provider.*tcp.*connection reset by peer.*",
  "(?s).*ssh_exchange_identification.*Connection closed by remote host.*",
  "(?s).*net/http: TLS handshake timeout",
  "Unauthorized"
]

terraform {
  source = "../..//stack/"

  before_hook "before_hook" {
    commands = [
      "apply",
      "plan"
    ]
    execute = ["bash", "../environments/tfsecrets", "use"]
  }

  extra_arguments "secrets_tfvars" {
    commands = [
      "plan",
      "apply"
    ]
    arguments = [
      "-var-file=secrets.tfvars"
    ]
  }

  after_hook "after_hook" {
    commands = [
      "apply",
      "plan"
    ]
    execute      = ["bash", "../environments/tfsecrets", "remove"]
    run_on_error = true
  }
}