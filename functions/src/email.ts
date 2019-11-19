import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { moment } from './moment';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'indiemakerfr@gmail.com',
    pass: 'bandhuttseilovzy'
  }
});

const loadEmail = (name: string) => {
  try {
    const data = readFileSync(`emails/${name}.html`, 'utf8');
    console.log('loadEmail', data);
    return data;
  } catch (e) {
    console.log('loadEmail Error:', e.stack);
    return '';
  }
};

export const sendEmail = (from: string, to: string, subject: string, text: string, html = '') => {
  // send some mail
  console.log('email', to, subject, text);
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      to,
      subject,
      text,
      html,
      from,
    }, (err: any, info: any) => {
      if (err) {
        console.error('email send error', err);
        reject(err);
      }
      console.log('email send info', info);
      resolve(info);
    });
  });
};
class EmailVars {
  [name: string]: string
}
export const sendWithTemplate = (from: string, to: string, subject: string, text: string, templateName: string, vars: EmailVars) => {
  console.log('sendWithTemplate', to, subject, text, templateName, vars);
  vars.YEAR = moment().format('YYYY');
  let template = loadEmail(templateName);
  let rawText = text;
  if (template === '') {
    return Promise.reject('no template found');
  }
  if (vars) {
    Object.keys(vars).forEach((element) => {
      template = template.split(`[${element}]`).join(vars[element]);
      rawText = rawText.split(`[${element}]`).join(vars[element]);
    });
  }
  return sendEmail(from, to, subject, rawText, template);
};