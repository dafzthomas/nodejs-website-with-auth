// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail');
const config = require('../config');

const Email = {};

Email.sendEmail = function (obj) {
    sgMail.setApiKey(config.sendGrid.key);

    const msg = {
        to: obj.to,
        from: `${obj.from}`,
        templateId: obj.templateId,
        dynamicTemplateData: {
            ...obj.dynamicTemplateData,
        },
    };

    sgMail.send(msg);
};

module.exports = Email;
