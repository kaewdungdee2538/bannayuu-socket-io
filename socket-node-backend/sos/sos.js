const axios = require('axios');
const ApiRoute = require('../utils/config')

 const getParcelHistoryBydID = (company_id) =>{
    const config = {
    //   headers: { Authorization: `Bearer ${authStore.access_token}` },
    };
    const bodyParameters = {
      company_id,
    };
    const url = `${ApiRoute.main_url}${ApiRoute.get_sos_info_last_record}`;
    console.log(url);
    return axios
    .post(url, bodyParameters, config)
    .then((res) => res.data.response)
    .catch((err) => {
      console.log(err);
    })
    .finally();
}
module.exports = getParcelHistoryBydID;
