/**
 * Erreurs de la couche réseau, alignées sur le catalogue du dossier directeur (§ 6.5).
 * Le serveur répond au format RFC 7807 : type, title, status, detail, instance, code, errors[].
 */

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'GONE'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
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
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  410: 'GONE',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE',
};

const KNOWN_CODES = new Set<string>([...Object.values(CODE_BY_STATUS), 'UNKNOWN']);

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly title?: string;
  readonly detail?: string;
  readonly errors: FieldError[];
  readonly requestId?: string;
  /** Secondes à attendre avant de réessayer (en-tête Retry-After, 429 / 503). */
  readonly retryAfter?: number;

  constructor(init: {
    status: number;
    code?: ApiErrorCode;
    title?: string;
    detail?: string;
    errors?: FieldError[];
    requestId?: string;
    retryAfter?: number;
  }) {
    const code = init.code ?? CODE_BY_STATUS[init.status] ?? 'UNKNOWN';
    super(init.detail ?? init.title ?? `Erreur ${init.status}`);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = code;
    this.title = init.title;
    this.detail = init.detail;
    this.errors = init.errors ?? [];
    this.requestId = init.requestId;
    this.retryAfter = init.retryAfter;
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

/**
 * Normalise errors[] (format du contrat) ou detail[] (format FastAPI par défaut :
 * { loc, msg, type }) pour tolérer un backend pas encore aligné pendant le développement.
 */
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

export function parseProblem(
  status: number,
  body: unknown,
  meta: { requestId?: string; retryAfter?: number } = {},
): ApiError {
  if (!isRecord(body)) {
    return new ApiError({ status, ...meta });
  }

  const rawCode = asString(body.code);
  const code = rawCode && KNOWN_CODES.has(rawCode) ? (rawCode as ApiErrorCode) : undefined;
  const errors = body.errors !== undefined ? body.errors : body.detail;

  return new ApiError({
    status,
    code,
    title: asString(body.title),
    detail: asString(body.detail),
    errors: parseFieldErrors(errors),
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
    case 'RATE_LIMITED':
      return 'Trop de tentatives. Patientez quelques instants.';
    case 'SERVICE_UNAVAILABLE':
      return 'Le service est momentanément indisponible. Réessayez plus tard.';
    default:
      return 'Une erreur est survenue. Réessayez plus tard.';
  }
}
