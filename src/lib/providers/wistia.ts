/**
 * Provider Wistia — résolution des IDs et métadonnées vidéo.
 *
 * // TODO: utiliser WISTIA_API_KEY (env var) pour authentifier les requêtes.
 * // TODO: endpoint : GET https://api.wistia.com/v1/medias/{hashed_id}.json
 * // TODO: récupérer : hashed_id, name, duration, thumbnail.url
 * // TODO: mapper les IDs placeholder vers les vrais hash Wistia depuis
 * //   le Google Sheet ID 1Pm3_aUZqOrlcJmxGYPGk6-O6RaXVFbWaP0YRjjsmvUc.
 *
 * // TODO: brancher l'event Wistia "end" pour marquer automatiquement
 * //   video_watched = true sans clic manuel de l'utilisateur.
 * //   Code côté client : window._wq.push({ id, onEnd: callback })
 */

/**
 * Résout un ID Wistia réel depuis un identifiant interne (placeholder ou slug).
 * Retourne null tant que la mapping n'est pas implémentée.
 */
export function resolveWistiaId(internalId: string): string | null {
  // TODO: implémenter la résolution via Google Sheet ou base de données
  void internalId;
  return null;
}

/**
 * Construit l'URL d'embed Wistia depuis un hash réel.
 */
export function buildEmbedUrl(hashedId: string): string {
  return `https://fast.wistia.com/embed/medias/${hashedId}`;
}
