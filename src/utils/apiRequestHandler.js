import 'whatwg-fetch'
import Config from 'config/Config'

export const corsFetchOptions = {
  // Enable cross-domain requests (CORS)
  mode: 'cors',
  // Send credentials cross-domain
  credentials: 'include',
}

export const acceptJsonHeaders = {
  Accept: 'application/json',
}

export const contentTypeJsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
}

export const authorizationHeaders = (session) => ({
  Authorization: `Bearer ${session.token}`,
})

const sessionHeaders = (session) =>
  (session ? authorizationHeaders(session) : {})

const endpointUrl = (config, endpointUrl) => {
  return `${config.apiUrl}${endpointUrl}`
}

const checkStatus = (response) => {
  if (!response.ok) {
    const error = new Error(`${response.status} ${response.statusText}`)
    error.response = response
    // Try to parse the response body as JSON.
    return response.json().then(
      (body) => {
        // Add body property to error
        error.body = body
        // Reject the new promise
        throw error
      },
      () => {
        // Reject the new promise
        throw error
      },
    )
  } else {
    return response
  }
}

const parseJson = (response) =>
  (response.status === 204 ? {} : response.json())

export const get = (url, options) => {
  options = {
    config: Config,
    fetchFunc: fetch,
    ...options,
  }
  const {config, fetchFunc, session} = options

  const headers = {
    ...acceptJsonHeaders,
    ...sessionHeaders(session),
  }
  const fetchOptions = {
    ...corsFetchOptions,
    method: 'GET',
    headers,
  }
  const finalUrl = endpointUrl(config, url)

  return fetchFunc(finalUrl, fetchOptions)
    .then(checkStatus)
    .then(parseJson)
}

const requestWithBody = (method, url, data, options) => {
  options = {
    config: Config,
    fetchFunc: fetch,
    ...options,
  }
  const {config, fetchFunc, session} = options

  const headers = {
    ...acceptJsonHeaders,
    ...contentTypeJsonHeaders,
    ...sessionHeaders(session),
  }
  const body = JSON.stringify(data)
  const fetchOptions = {
    ...corsFetchOptions,
    method,
    headers,
    body,
  }

  const finalUrl = endpointUrl(config, url)

  return fetchFunc(finalUrl, fetchOptions)
    .then(checkStatus)
    .then(parseJson)
}

export const post = (url, data, options) =>
  requestWithBody('POST', url, data, options)
export const put = (url, data, options) =>
  requestWithBody('PUT', url, data, options)
export const patch = (url, data, options) =>
  requestWithBody('PATCH', url, data, options)
export const destroy = (url, options) => {
  options = {
    config: Config,
    fetchFunc: fetch,
    ...options,
  }
  const {config, fetchFunc, session} = options

  const headers = {
    ...acceptJsonHeaders,
    ...sessionHeaders(session),
  }
  const fetchOptions = {
    ...corsFetchOptions,
    method: 'DELETE',
    headers,
  }

  const finalUrl = endpointUrl(config, url)

  return fetchFunc(finalUrl, fetchOptions)
    .then(checkStatus)
    .then(parseJson)
}
