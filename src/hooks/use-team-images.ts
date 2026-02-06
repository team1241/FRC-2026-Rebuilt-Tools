import { FieldImage } from "@/lib/db/types";
import { QueryKeys } from "@/lib/queries/query-keys"
import { fetchScoutingApi } from "@/lib/scouting-api";
import { useQuery } from "@tanstack/react-query"


interface UseTeamImagesForMatchProps {
  teamNumbers?: number[]
}

export const useTeamImages = ({ teamNumbers }: UseTeamImagesForMatchProps) => {
  return useQuery({
    queryKey: [QueryKeys.TeamImagesForMatch, teamNumbers],
    queryFn: async () => {
      const params = new URLSearchParams()
      teamNumbers?.map(team => params.append("teamNumbers", team.toString()))
      const events = await fetchScoutingApi<FieldImage[]>('/robot-images?' + params.toString())

      return events
    },
    enabled: teamNumbers && teamNumbers?.length > 0,
    retry: false
  })
}