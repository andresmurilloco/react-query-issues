import { FiInfo, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { Issue } from "../interfaces";
import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryCache, useQueryClient } from "@tanstack/react-query";
import { getIssueInfo, getIssueComents } from "../hooks/useIssue";
import { timeSince } from "../helpers";

interface Props {
  issue: Issue;
}

export const IssueItem: FC<Props> = ({ issue }) => {
  const { user, state, comments, title } = issue;
  const { login, id, avatar_url } = user;
  const navigate = useNavigate();
  const [estado, setEstado] = useState(false);
  const queryClient = useQueryClient();

  const prefetchData = () => {
    queryClient.prefetchQuery(["issue", issue.number], () =>
      getIssueInfo(issue.number)
    );
    queryClient.prefetchQuery(["issue", issue.number, "comments"], () =>
      getIssueComents(issue.number)
    );
  };

  const preSetData=() => {
    queryClient.setQueryData(
        ["issue", issue.number],
        issue,
        {
            updatedAt: new Date().getTime()+100000,
        }
    );
  }

  useEffect(() => {
    if (state === "open") {
      setEstado(true);
    }
  }, []);

  return (
    <div
      className="card mb-2 issue"
      onClick={() => navigate(`/issues/issue/${issue.number}`)}
      onMouseEnter={preSetData}
    >
      <div className="card-body d-flex align-items-center">
        {estado ? (
          <FiInfo size={30} color="red" />
        ) : (
          <FiCheckCircle size={30} color="green" />
        )}
        <div className="d-flex flex-column flex-fill px-2">
          <span>{title}</span>
          <span className="issue-subinfo">
            #{id} opened {timeSince(issue.created_at)} days ago by <span className="fw-bold">{login}</span>
          </span>
          <div>
            {
              issue.labels.map(label=>(
                <span key={label.id} className="badge rounded-pill m-1" style={{backgroundColor: `#${label.color}`, color:'black'}}>
                  {label.name}
                </span>
              ))
            }
          </div>
        </div>

        <div className="d-flex align-items-center">
          <img src={avatar_url} alt="User Avatar" className="avatar" />
          <span className="px-2">{comments}</span>
          <FiMessageSquare />
        </div>
      </div>
    </div>
  );
};
