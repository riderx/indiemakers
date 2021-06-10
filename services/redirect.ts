// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (req: any, res: any) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('Nothing here')
  res.end()
}
