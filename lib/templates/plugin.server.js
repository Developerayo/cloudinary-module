const sdk = require('cloudinary-core')

const createInstance = () => {
  const configurations = {
    cloud_name: '<%= options.cloudName %>',
    api_key: '<%= options.apiKey %>',
    api_secret: '<%= options.apiSecret %>',
    private_cdn: <%= options.privateCDN || false %>,
    secure: <%= options.secure === undefined ? true : options.secure %>
  }

  <% if (options.secureDistribution) { %>
    configurations.secure_distribution = '<%= options.secureDistribution %>'
  <% } else { %>
    configurations.cname = '<%= options.cname %>'
  <% } %>

  const instance = new sdk.Cloudinary(configurations)

  <% if (options.responsive) { %>instance.responsive()<% } %>

  const api = (type) => {
    const url = type === 'video' ? (...args) => instance.video_url(...args) : instance.url
    const element = type === 'video' ? instance.videoTag : instance.imageTag

    return {
      config: instance.config,
      url,
      element,
      fetchRemote(url, options) {
        return this.url(url, { ...(options || {}), type: 'fetch' })
      },
      video_url: (...args) => instance.video_url(...args)
    }
  }

  return api
}

export default function (context, inject) {
  const cloudinary = createInstance()

  context.$cloudinary = cloudinary
  inject('cloudinary', cloudinary)
}
