import { isProduction } from "./isProduction"

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production App Engine URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = "https://sopra-fs24-group-32-server.oa.r.appspot.com/"
  const devUrl = "http://localhost:8181/api"

  return isProduction() ? prodUrl : devUrl
}
