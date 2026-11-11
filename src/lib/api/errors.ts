/**
 * Erreurs de la couche réseau, alignées sur le guide d'API (API Specification & Integration
 * Handbook v1.0, § 2.5, § 2.6 et annexe A).
 *
 * Format d'erreur du contrat :
 * { "success": false, "message": "...", "error": { "code": "VALIDATION_ERROR",
 *   "details": [{ "field": "due_date", "message": "..." }] }, "request_id": "..." }
 *
 * Le format RFC 7807 (type/title/detail/errors[]) et le format FastAPI par défaut
 * (detail[{loc,msg,type}]) restent tolérés pour un backend pas encore aligné.
 * Règle : les écrans décident selon `code` et `status`, jamais selon le texte du message.
 */

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'PAYMENT_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'CONFLICT'
  | 'GONE'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'VALIDATION_ERROR'
  | 'LOCKED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'UPSTREAM_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'INSUFFICIENT_STORAGE'
  | 'UNKNOWN';

export type FieldError = {
  /** Nom du champ concerné (ex. "title"). Vide si l'erreur porte sur la requête entière. */
  field: string;
  message: string;
  code?: string;
};

const CODE_BY_STATUS: Record<number, ApiErrorCode> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  402: 'PAYMENT_REQUIRED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  409: 'CONFLICT',
  410: 'GONE',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  422: 'VALIDATION_ERROR',
  423: 'LOCKED',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_ERROR',
  502: 'UPSTREAM_ERROR',
  503: 'SERVICE_UNAVAILABLE',
  507: 'INSUFFICIENT_STORAGE',
};

const KNOWN_CODES = new Set<string>([...Object.values(CODE_BY_STATUS), 'UNKNOWN']);

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  /** Message lisible renvoyé par le serveur (à ne pas utiliser pour décider). */
  readonly serverMessage?: string;
  readonly errors: FieldError[];
  readonly requestId?: string;
  /** Secondes à attendre avant de réessayer (en-tête Retry-After, 429 / 503). */
  readonly retryAfter?: number;
  /** Version actuelle de la ressource, renvoyée avec un 409 (verrouillage optimiste). */
  readonly currentVersion?: number;

  constructor(init: {
    status: number;
    code?: ApiErrorCode;
    message?: string;
    errors?: FieldError[];
    requestId?: string;
    retryAfter?: number;
    currentVersion?: number;
  }) {
    const code = init.code ?? CODE_BY_STATUS[init.status] ?? 'UNKNOWN';
    super(init.message ?? `Erreur ${init.status}`);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = code;
    this.serverMessage = init.message;
    this.errors = init.errors ?? [];
    this.requestId = init.requestId;
    this.retryAfter = init.retryAfter;
    this.currentVersion = init.currentVersion;
  }

  /** Erreurs de validation indexées par champ, prêtes pour un formulaire. */
  fieldErrors(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const error of this.errors) {
      if (error.field && !result[error.field]) {
        result[error.field] = error.message;
      }
    }
    return result;
  }
}

/** Pas de réponse du serveur : hors ligne, DNS, délai dépassé. */
export class NetworkError extends Error {
  readonly timedOut: boolean;

  constructor(timedOut = false) {
    super(timedOut ? 'Délai de réponse dépassé' : 'Connexion impossible');
    this.name = 'NetworkError';
    this.timedOut = timedOut;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/** Normalise details[] (contrat), errors[] (RFC 7807) ou detail[] (FastAPI : { loc, msg, type }). */
function parseFieldErrors(source: unknown): FieldError[] {
  if (!Array.isArray(source)) {
    return [];
  }
  return source.filter(isRecord).map((item) => {
    const loc = Array.isArray(item.loc) ? item.loc : [];
    const fromLoc = loc.filter((part) => part !== 'body').join('.');
    return {
      field: asString(item.field) ?? fromLoc,
      message: asString(item.message) ?? asString(item.msg) ?? 'Valeur invalide',
      code: asString(item.code) ?? asString(item.type),
    };
  });
}

/** Convertit le corps d'une réponse en échec en ApiError. */
export function parseProblem(
  status: number,
  body: unknown,
  meta: { requestId?: string; retryAfter?: number } = {},
): ApiError {
  if (!isRecord(body)) {
    return new ApiError({ status, ...meta });
  }

  // Format du guide d'API : { success:false, message, error:{ code, details }, request_id }
  if (isRecord(body.error)) {
    const rawCode = asString(body.error.code);
    const details = body.error.details;
    return new ApiError({
      status,
      code: rawCode && KNOWN_CODES.has(rawCode) ? (rawCode as ApiErrorCode) : undefined,
      message: asString(body.message),
      errors: parseFieldErrors(details),
      requestId: asString(body.request_id) ?? meta.requestId,
      retryAfter: meta.retryAfter,
      currentVersion: asNumber(body.error.current_version) ?? asNumber((body.data as Record<string, unknown> | undefined)?.version),
    });
  }

  // Tolérance : RFC 7807 ou FastAPI par défaut.
  const rawCode = asString(body.code);
  return new ApiError({
    status,
    code: rawCode && KNOWN_CODES.has(rawCode) ? (rawCode as ApiErrorCode) : undefined,
    message: asString(body.detail) ?? asString(body.title),
    errors: parseFieldErrors(body.errors !== undefined ? body.errors : body.detail),
    ...meta,
  });
}

/**
 * Message en français pour l'utilisateur, sans détail technique.
 * Les écrans peuvent le remplacer par un message plus précis selon le contexte.
 */
export function userMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return error.timedOut
      ? 'Le serveur met trop de temps à répondre. Réessayez dans un instant.'
      : 'Connexion impossible. Vérifiez votre réseau puis réessayez.';
  }

  if (!isApiError(error)) {
    return 'Une erreur inattendue est survenue.';
  }

  switch (error.code) {
    case 'UNAUTHENTICATED':
      return 'Votre session a expiré. Veuillez vous reconnecter.';
    case 'PAYMENT_REQUIRED':
      return 'Le paiement n’a pas pu être effectué. Vérifiez votre moyen de paiement.';
    case 'FORBIDDEN':
      return "Vous n'avez pas l'autorisation d'effectuer cette action.";
    case 'NOT_FOUND':
      return "Cet élément n'existe pas ou n'est plus disponible.";
    case 'CONFLICT':
      return 'Cet élément a été modifié entre-temps. Rechargez puis réessayez.';
    case 'GONE':
      return 'Ce lien a expiré. Recommencez la démarche.';
    case 'PAYLOAD_TOO_LARGE':
      return 'Le fichier est trop volumineux.';
    case 'UNSUPPORTED_MEDIA_TYPE':
      return "Ce format de fichier n'est pas accepté.";
    case 'VALIDATION_ERROR':
    case 'BAD_REQUEST':
      return 'Certaines informations sont invalides. Vérifiez le formulaire.';
    case 'LOCKED':
      return 'Compte temporairement bloqué après plusieurs essais. Réessayez plus tard.';
    case 'RATE_LIMITED':
      return 'Trop de tentatives. Patientez quelques instants.';
    case 'UPSTREAM_ERROR':
      return 'Un service partenaire ne répond pas correctement. Réessayez plus tard.';
    case 'SERVICE_UNAVAILABLE':
      return 'Le service est momentanément indisponible. Réessayez plus tard.';
    case 'INSUFFICIENT_STORAGE':
      return 'Votre espace de stockage est plein.';
    default:
      return 'Une erreur est survenue. Réessayez plus tard.';
  }
}
