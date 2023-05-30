import axios from 'axios';

export const githubApi = axios.create({
    baseURL:'https://api.github.com/repos/facebook/react',
    headers:{
        Authorization: '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'
    }
})