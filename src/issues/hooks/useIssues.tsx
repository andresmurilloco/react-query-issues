import { githubApi } from "../../api/githubApi"
import { Issue } from "../interfaces"
import { useQuery } from '@tanstack/react-query';

const getIssues=async():Promise<Issue[]>=>{
    const {data} = await githubApi.get('/issues')
    return data;
}

export const useIssues = () => {
  const issuesQuery = useQuery(
    ['issues'],
    getIssues,
    {
      refetchOnWindowFocus:false,
      staleTime: 1000*60*30,
    }
  );
    return {
        issuesQuery,
    }
}