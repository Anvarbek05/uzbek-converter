# Security Policy

## Reporting a vulnerability

Please do not publish exploit details, credentials, tokens, private documents, or other sensitive data in a public issue or pull request.

If GitHub Private vulnerability reporting is enabled for this repository, use the repository's **Security → Advisories → Report a vulnerability** flow. Otherwise, contact the repository maintainer privately through the contact method shown on the maintainer's GitHub profile.

## Secret handling

- Never commit real `.env` files, access tokens, passwords, API keys, or private keys.
- Store deployment secrets in the hosting provider's environment-variable settings.
- If a secret is exposed, revoke or rotate it immediately. Removing it from the latest commit is not enough because Git history may still contain it.
- Do not upload confidential documents to public issues, pull requests, or share links.

## Scope

This policy applies to the NexUz repository and its currently maintained application code.
