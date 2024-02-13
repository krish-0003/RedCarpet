const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { fromNodeProviderChain } = require('@aws-sdk/credential-providers');
const { locations, emailRedirectEndpoints } = require('../../utils/strings');

// credentials fetched default credentials from AWS DefaultCredentialsProviderChain.
const credentials = fromNodeProviderChain();

// AWS SES Client instance
const client = new SESClient({
  credentials,
  region: process.env.AWS_REGION || 'us-west-2',
});

const approvalEmailTemplate = fs.readFileSync(
  path.join(__dirname, '../../assets/approveEmployee.html'),
  'utf-8'
);
const assignSoftwareEmailTemplate = fs.readFileSync(
  path.join(__dirname, '../../assets/assignSoftware.html'),
  'utf-8'
);
const revokeoftwareEmailTemplate = fs.readFileSync(
  path.join(__dirname, '../../assets/revokeSoftware.html'),
  'utf-8'
);

const approvalEmails = {
  india: process.env.APPROVAL_EMAIL_INDIA?.split(','),
  us: process.env.APPROVAL_EMAIL_US?.split(','),
};

const createSendEmailCommand = ({ toAddresses, html, subject }) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [...toAddresses],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: process.env.SES_EMAIL_ID,
  });
};

const employeeApprovalEmail = async (
  req,
  { employeeId, firstname, lastname, location, onboardDate, pendingRequests }
) => {
  const placeholders = {
    name: {
      firstname: firstname,
      lastname: lastname,
    },
    onboardDate: onboardDate,
    approveEmployeePage: emailRedirectEndpoints.approveEmployee.replace(
      /{([^}]+)}/g,
      employeeId
    ),
    pendingRequestMessage: pendingRequests
      ? `You have other ${pendingRequests} more requests to approve on Red
    Carpet.`
      : '',
  };

  try {
    const sendEmailCommand = createSendEmailCommand({
      toAddresses:
        location === locations.india ? approvalEmails.india : approvalEmails.us,
      subject: 'New employee approval request for RedCarpet',
      html: mustache.render(approvalEmailTemplate, placeholders),
    });

    // AWS SES Client sends an email.
    await client.send(sendEmailCommand);
  } catch (error) {
    req.log.error(
      error,
      `In employeeApprovalEmail of ${employeeId} : ${error.message}`
    );
  }
};

const assignSoftwareEmail = async (
  req,
  { managers, softwareName, employeeName, employeeId }
) => {
  const placeholders = {
    employeeName,
    softwareName,
    assignSoftwareEndpoint: emailRedirectEndpoints.assignSoftware.replace(
      /{([^}]+)}/g,
      employeeId
    ),
    currentUser: req?.user?.name,
  };
  try {
    const sendEmailCommand = createSendEmailCommand({
      toAddresses: managers,
      subject: `New request for ${softwareName} assignment on RedCarpet`,
      html: mustache.render(assignSoftwareEmailTemplate, placeholders),
    });

    // AWS SES Client sends an email.
    await client.send(sendEmailCommand);
    return true;
  } catch (error) {
    req?.log?.error(
      error,
      `In assignSoftwareEmail for ${softwareName} : ${error.message}`
    );
  }
};

const revokeSoftwareEmail = async (
  req,
  { managers, softwareName, employeeName, employeeId }
) => {
  const placeholders = {
    employeeId,
    employeeName,
    softwareName,
    revokeSoftwareEndpoint: emailRedirectEndpoints.revokeSoftware.replace(
      /{([^}]+)}/g,
      employeeId
    ),
    currentUser: req?.user?.name,
  };
  try {
    const sendEmailCommand = createSendEmailCommand({
      toAddresses: managers,
      subject: `Software revoke request for ${softwareName} on RedCarpet`,
      html: mustache.render(revokeoftwareEmailTemplate, placeholders),
    });

    // AWS SES Client sends an email.
    await client.send(sendEmailCommand);
    return true;
  } catch (error) {
    req?.log?.error(
      error,
      `In revokeSoftwareEmail for ${softwareName} : ${error.message}`
    );
  }
};

module.exports = {
  employeeApprovalEmail,
  assignSoftwareEmail,
  revokeSoftwareEmail,
};
