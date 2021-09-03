import ImageKit from 'imagekit'

export const sendImageToCache = async (url: string, guid: string) => {
  try {
    const imagekit = new ImageKit({
      urlEndpoint: 'https://ik.imagekit.io/gyc0uxoln1',
      publicKey: 'public_9vWOr643awJiLr6HqhpNNF1ZVkQ=',
      privateKey: String(process.env.IMAGEKIT_KEY),
    })
    await imagekit.upload({
      file: url, // required
      folder: 'indiemakers',
      fileName: `ep_${guid}`, // required
      useUniqueFileName: false,
    })
    return Promise.resolve()
  } catch (error) {
    console.error('sendImageToCache', error, url, guid)
    return Promise.reject(error)
  }
}
