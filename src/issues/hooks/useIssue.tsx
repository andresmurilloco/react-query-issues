import { useQuery } from '@tanstack/react-query';
import { Issue } from '../interfaces';
import { githubApi } from '../../api/githubApi';
import { sleep } from '../helpers/sleep';
import { IssueComment } from '../components/IssueComment';

export const getIssueInfo= async(issueNumber:number):Promise<Issue>=>{
    await sleep(2);
    const {data} = await githubApi.get<Issue>(`/issues/${issueNumber}`)
    return data;
}

export const getIssueComents= async(issueNumber:number):Promise<Issue[]>=>{
    await sleep(2);
    const {data} = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`)
    return data;
}

export const useIssue = (issueNumber:number) => {
    const issueQuery = useQuery(
        ['issue', issueNumber],
        () => getIssueInfo(issueNumber),
    )

    const commentsQuery = useQuery(
        ['issue', issueNumber, 'comments'],
        () => getIssueComents(issueQuery.data!.number),
        {
            enabled: issueQuery.data !== undefined,
        }
    )
  return {issueQuery, commentsQuery,};
}