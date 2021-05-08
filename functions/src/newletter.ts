import axios, {AxiosResponse} from "axios";
import * as functions from "firebase-functions";

const configSecret = functions.config();
axios.defaults.baseURL = "https://www.getrevue.co";
axios.defaults.headers.common.Authorization = `Token ${configSecret.getrevue.apikey}`;

export const sendUserToRevue = async (email: string, first_name: string): Promise<AxiosResponse<any>> => axios.post("/api/v2/subscribers", {
  email,
  first_name,
  double_opt_in: false,
});
