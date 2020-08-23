import * as sgClient from '@sendgrid/client'
import { ClientRequest } from '@sendgrid/client/src/request'

const sgList = 'f96e367b-1501-4992-b3f5-55f4d60128dc'
const sgEpdDesignId = '1362115d-6d78-437f-a8a6-c6c4921e5fee'
const suppressionGroupId = '28378'

export const imageLink = 'http://cdn.mcauto-images-production.sendgrid.net/d0d537150a8a5f88/40072b22-6c48-407f-9dd6-bc16d3769803/512x512.png'
export const imageStyle = 'display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:50% !important; width:50%; height:auto !important;'
interface Episode {
  title: string,
  udi: string,
  preview: string,
  image: string,
  content: string,
}
export interface Design {
  id: string,
  updated_at: string,
  created_at: string,
  thumbnail_url: string,
  name: string,
  html_content: string,
  plain_content: string,
  generate_plain_content: boolean,
  editor: string,
  categories: string[]
}
export const initEmail = async (apiKey: string) => {
  sgClient.setApiKey(apiKey)
}
export const CopyDesign = async (episodeName: string): Promise<Design> => {
  const request: ClientRequest = {
    method: 'POST',
    url: `/v3/designs/${sgEpdDesignId}`,
    body: {
      name: episodeName
    }
  }
  try {
    const [response] = await sgClient.request(request)
    return <Design>response.body
  } catch (err) {
    console.error('CopyDesign err', err)
    return Promise.reject(err)
  }
}

export const UpdateDesign = async (designId: string, html_content: string, subject: string): Promise<Design> => {
  const request: ClientRequest = {
    method: 'PATCH',
    url: `/v3/designs/${designId}`,
    body: {
      html_content,
      subject,
      generate_plain_content: true
    }
  }
  try {
    const [response] = await sgClient.request(request)
    return <Design>response.body
  } catch (err) {
    console.error('UpdateDesign err', err)
    return Promise.reject(err)
  }
}

export const sendEpToContactList = async (title: string, designId: string) => {
  const request: ClientRequest = {
    method: 'POST',
    url: '/v3/marketing/singlesends',
    body: {
      name: title,
      send_to: {
        list_ids: [sgList]
      },
      email_config: {
        subject: title,
        design_id: designId,
        suppression_group_id: suppressionGroupId,
      }
    }
  }
  try {
    await sgClient.request(request)
  } catch (err) {
    console.error('sendEpToContactList err', err)
  }
}

export const sendEmailEp = async (episode: Episode) => {
  const title = episode.title
  const udi = episode.udi
  const preview = episode.preview
  const image = episode.image
  const content = episode.content.replace('.', '.\n\n')
  const design = await CopyDesign(title)
  if (design) {
    const designId = design.id
    let htmlContent = design.html_content
    htmlContent = htmlContent.replace('{TITLE_EP}', title)
    htmlContent = htmlContent.replace('{TEXT_EP_SHORT}', preview)
    htmlContent = htmlContent.replace('{TEXT_EP}', content)
    htmlContent = htmlContent.replace('{LINK_EP}', `indiemakers.fr/episode/${udi}`)
    htmlContent = htmlContent.replace('{URL_IMG}', image)
    htmlContent = htmlContent.replace('{ALT_IMG}', title)
    htmlContent = htmlContent.replace(imageStyle, `${imageStyle}border-style: solid;border-width: 10px;border-color: white;`)
    htmlContent = htmlContent.replace(imageLink, image)
    await UpdateDesign(designId, htmlContent, preview)
    await sendEpToContactList(title, designId)
  }
}

export const sendUserToSendrid = async (email: string, first_name: string) => {
  const request: ClientRequest = {
    method: 'PUT',
    url: '/v3/marketing/contacts',
    body: {
      list_ids: [sgList],
      contacts: [{ email, first_name }]
    }
  }
  try {
    await sgClient.request(request)
  } catch (err) {
    console.error('sendUserToSendrid err', err)
  }
}
