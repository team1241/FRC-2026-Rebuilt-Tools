type ApiEnvelope<T> = {
  data: T
}

export async function fetchScoutingApi<T>(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SCOUTING_APP_URL
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SCOUTING_APP_URL env variable.")
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path
  const url = new URL(normalizedPath, normalizedBase).toString()

  const response = await fetch(url, init)
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    const detail = body ? `: ${body}` : ""
    throw new Error(
      `Scouting API request failed (${response.status} ${response.statusText})${detail}`
    )
  }

  const payload = (await response.json()) as ApiEnvelope<T>
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Scouting API response missing `data`.")
  }

  return payload.data
}
