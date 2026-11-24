function destination(repository, formatVersion) {
  const owner = repository.split("/")[0].toLowerCase();
  return Object.freeze({
    formatVersion,
    source: `https://github.com/${repository}`,
    images: Object.freeze({
      web: `ghcr.io/${owner}/radishink-web`,
      server: `ghcr.io/${owner}/radishink-server`,
    }),
  });
}

export const RELEASE_DESTINATIONS = Object.freeze({
  "laugh0608/RadishInk": destination("laugh0608/RadishInk", 1),
  "RadishIntelligence/RadishInk": destination(
    "RadishIntelligence/RadishInk",
    2,
  ),
});

export function releaseDestination(repository = "laugh0608/RadishInk") {
  if (!Object.hasOwn(RELEASE_DESTINATIONS, repository))
    throw new Error("Unsupported RadishInk release repository");
  return RELEASE_DESTINATIONS[repository];
}

export function releaseDestinationForFormat(formatVersion) {
  const destination = Object.values(RELEASE_DESTINATIONS).find(
    (item) => item.formatVersion === formatVersion,
  );
  if (!destination) throw new Error("Unsupported RadishInk release format");
  return destination;
}
