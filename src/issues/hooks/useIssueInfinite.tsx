import { useInfiniteQuery } from "@tanstack/react-query";
import { Issue, State } from "../interfaces/issue";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../helpers";

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

interface QueryProps{
    pageParam?: number;
    queryKey: (string| Props)[];
}

export const getIssues = async ({pageParam = 1, queryKey}:QueryProps): Promise<Issue[]> => {

    const [,,args] = queryKey;
    const {state, labels} = args as Props;
    
  const params = new URLSearchParams();
  if (state) params.append("state", state);

  if (labels.length > 0) {
    const labelSting = labels.join(",");
    params.append("labels", labelSting);
  }

  params.append("page", pageParam.toString());
  params.append("per_page", "8");

  const { data } = await githubApi.get("/issues", { params });
  return data;
};

export const useIssueInfinite = ({ state, labels }: Props) => {
  const issuesQuery = useInfiniteQuery([
    "issues",
    "infinite",
    { state, labels},],
    (data) => getIssues(data),
    {
        getNextPageParam:(lastPage, pages)=>{
            if(lastPage.length === 0) return;
            return pages.length + 1;
        }
    }
    );
  return {
    issuesQuery,
  };
};
