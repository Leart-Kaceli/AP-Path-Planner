# AP Path Planner Production Checklist

## Source control

- [ ] Working tree is clean
- [ ] Latest branch is pushed
- [ ] Pull request checks are green
- [ ] No `.env.local` file is committed
- [ ] No tokens, passwords, or service-account keys are committed

## Automated verification

- [ ] ESLint passes
- [ ] Unit tests pass
- [ ] Coverage thresholds pass
- [ ] Firestore Rules tests pass
- [ ] Next.js production build passes
- [ ] Emulator browser tests pass
- [ ] Production browser tests pass
- [ ] Deployed smoke tests pass

## Firebase

- [ ] Production project ID is correct
- [ ] Firestore Rules are deployed
- [ ] Firebase Authentication providers are configured
- [ ] Production domain is authorized
- [ ] Preview domain is authorized if required
- [ ] Emulator mode is false in deployed environments

## Privacy and data

- [ ] Privacy page loads
- [ ] Data export works
- [ ] Export does not contain tokens
- [ ] Clear-data confirmation works
- [ ] Account deletion confirmation works
- [ ] Account deletion recent-login error is handled

## Monitoring

- [ ] Vercel Analytics receives a visit
- [ ] Speed Insights is enabled
- [ ] Firebase Performance is receiving activity
- [ ] Client-error endpoint returns 204
- [ ] Technical error appears in deployment logs

## Security

- [ ] `npm audit` reviewed
- [ ] Dependabot alerts enabled
- [ ] Dependabot security updates enabled
- [ ] Security headers verified
- [ ] Code scanning reviewed where available
- [ ] No unresolved high-severity vulnerability is ignored without documentation

## Public pages

- [ ] Homepage loads
- [ ] Privacy page loads
- [ ] Not-found page loads
- [ ] `robots.txt` loads
- [ ] `sitemap.xml` loads
- [ ] Browser title is correct
- [ ] Description metadata is present

## Release

- [ ] Preview deployment manually tested
- [ ] Preview deployed tests pass
- [ ] Production branch is current
- [ ] Production deployment completed
- [ ] Production deployed tests pass
- [ ] Rollback deployment identified

# Rollback Procedure

1. Open the Vercel project.
2. Open Deployments.
3. Locate the last known successful production deployment.
4. Inspect its commit and deployment details.
5. Promote or redeploy the known-good version.
6. Verify the homepage.
7. Verify authentication.
8. Verify Firestore reads and writes.
9. Run deployed smoke tests against the restored URL.
10. Record why the rollback occurred.

Do not delete the failed deployment until its logs and error details have been reviewed.