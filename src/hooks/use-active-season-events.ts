import { EventResponse } from "@/lib/db/types"
import { QueryKeys } from "@/lib/queries/query-keys"
import { fetchScoutingApi } from "@/lib/scouting-api"
import { useQuery } from "@tanstack/react-query"

export const useActiveSeasonEvents = () => {
  return useQuery({
    queryKey: [QueryKeys.ActiveSeasonEvents],
    queryFn: async () => {
      const events = await fetchScoutingApi<EventResponse>('/events')

      return events
    }
  })
}