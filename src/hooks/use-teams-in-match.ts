import { TeamsInMatchResponse } from "@/lib/db/types"
import { QueryKeys } from "@/lib/queries/query-keys"
import { fetchScoutingApi } from "@/lib/scouting-api"
import { useQuery } from "@tanstack/react-query"


export const useTeamsInMatch = ({ eventId, matchNumber }: { eventId: string | null, matchNumber: string | null }) => {
  return useQuery({
    queryKey: [QueryKeys.TeamsInMatch, eventId, matchNumber],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('eventId', eventId!)
      params.set('matchNumber', matchNumber!)
      const teamsResponse = await fetchScoutingApi<TeamsInMatchResponse>('/teams?' + params.toString())

      return teamsResponse
    },
    enabled: !!eventId && !!matchNumber
  })
}