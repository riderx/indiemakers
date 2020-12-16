import * as sgClient from '@sendgrid/client'
import { ClientRequest } from '@sendgrid/client/src/request'

const sgListIndie = '9d1a4cc5-92bf-4253-a408-b3277fc36ea4'
const sgListEp = 'dbedce13-afa8-48f6-8149-030a8505f50e'

const sgEpdDesignId = '1362115d-6d78-437f-a8a6-c6c4921e5fee'
const suppressionGroupId = 28378
const senderId = 950604

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
export const initEmail = (apiKey: string): void => {
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

export const getSingleSend = async (id: string) => {
  const request: ClientRequest = {
    method: 'GET',
    url: `/v3/marketing/singlesends/${id}`
  }
  try {
    return await sgClient.request(request)
  } catch (err) {
    console.error('getSingleSend err', err)
    console.error('getSingleSend err', err.response.body.errors)
    return null
  }
}

export const createSingleSend = async (name: string, designId: string) => {
  const send_at = new Date(Date.now() + 60000);
  const request: ClientRequest = {
    method: 'POST',
    url: '/v3/marketing/singlesends',
    body: {
      send_at,
      name,
      send_to: {
        list_ids: [sgListEp]
      },
      email_config: {
        sender_id: senderId,
        design_id: designId,
        suppression_group_id: suppressionGroupId
      }
    }
  }
  try {
    const [res, singlesend] =  await sgClient.request(request)
    console.log('res', res.statusCode);
    return singlesend.id;
  } catch (err) {
    console.error('createSingleSend err', err)
    console.error('createSingleSend err', err.response.body.errors)
    return null
  }
}

export const sendEpToContactList = async (id: string) => {
  const request: ClientRequest = {
    method: 'PUT',
    url: `/v3/marketing/singlesends/${id}/schedule`,
    body: {
      send_at: 'now'
    }
  }
  try {
    return await sgClient.request(request)
  } catch (err) {
    console.error('sendEpToContactList err', err)
    console.error('sendEpToContactList err', err.response.body.errors)
    return null
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
    const sendId = await createSingleSend(title, designId)
    await sendEpToContactList(sendId)
  }
}

export const sendUserToSendrid = async (email: string, first_name: string) => {
  const contact = { email, first_name }
  console.log('contact', contact);
  const request: ClientRequest = {
    method: 'PUT',
    url: '/v3/marketing/contacts',
    body: {
      list_ids: [sgListIndie, sgListEp],
      contacts: [contact]
    }
  }
  try {
    await sgClient.request(request)
  } catch (err) {
    console.error('sendUserToSendrid err', err)
  }
}
