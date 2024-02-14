module.exports = {
  elasticSearchUrl: 'https://search-monqaelastic-5lo2othwsotpfp7mhp2ztjjupq.ap-southeast-2.es.amazonaws.com',
  kibanaUrl:'https://search-monqaelastic-5lo2othwsotpfp7mhp2ztjjupq.ap-southeast-2.es.amazonaws.com/_plugin/kibana/',
  events: true,
  review: process.env.NODE_ENV === 'development'
};