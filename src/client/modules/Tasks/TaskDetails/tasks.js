import { apiProxyAxios } from '../../../components/Task/utils'

export const getTaskDetail = (id) =>
  apiProxyAxios.get(`v4/task/${id}`).then(({ data }) => data)
