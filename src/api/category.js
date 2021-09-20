import {get, post, patch, destroy} from 'api/api'

export const getCategories = (options) => {
  return get(`/categories`, options)
}

export const createCategory = (category, options) => {
  return post(`/categories`, category, options)
}

export const updateCategory = (category, options) => {
  return patch(`/categories/${category.id}`, category, options)
}

export const deleteCategory = (category, options) => {
  return destroy(`/categories/${category.id}`, options)
}
