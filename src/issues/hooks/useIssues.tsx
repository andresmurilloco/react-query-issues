import { githubApi } from "../../api/githubApi"
import { sleep } from "../helpers/sleep";
import { Issue } from "../interfaces"
import { useQuery } from '@tanstack/react-query';
import { State } from "../interfaces/issue";
import { useState, useEffect } from 'react';

interface Props{
  state?:State;
  labels:string[];
  page?:number;
}

export const getIssues=async({labels, state, page=1}:Props):Promise<Issue[]>=>{
  await sleep(2);
  const params = new URLSearchParams();
  if(state) params.append('state', state);

  if(labels.length>0){
    const labelSting=labels.join(',');
    params.append('labels', labelSting);
  }

  params.append('page', page.toString())
  params.append('per_page', '8')

  const {data} = await githubApi.get('/issues',{params})
  return data;
}

export const useIssues = ({state, labels}:Props) => {
  const [page, setPage] = useState(1)
  useEffect(() => {
    setPage(1)
  }, [state, labels])
  const issuesQuery = useQuery(
    ['issues', {state, labels, page}],
    ()=>getIssues({labels, state, page} ),
    {
      refetchOnWindowFocus:false,
      staleTime: 1000*60*30,
    }
  );

  const nextPage =()=>{
    if(issuesQuery.data?.length === 0)return;
    setPage(page+1);
  }

  const prevPage =()=>{
    if(page > 1) setPage(page-1);
  }

    return {
        issuesQuery,
        page: issuesQuery.isFetching?'Loading...':page,
        nextPage,
        prevPage,
    }
}