const moment = require('moment');
const csv = require('csv-parser');
const fs = require('fs');

const csvFilePath = 'Path for CSV file';
const apiRootPath = 'API root path';
const authToken = 'ACCESS_TOKEN';

const usersBulkCreate = async () => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const user = {
        //uncomment this code to add India employees
        // company_email: row.company_email,
        // employee_id: row.employee_id,
        // first_name: row.first_name,
        // last_name: row.last_name,
        // personal_email: row.personal_email === '' ? null : row.personal_email,
        // country_code:
        //   row.country_code === ''
        //     ? null
        //     : row.country_code[0] === '+'
        //     ? row.country_code
        //     : `+${row.country_code}`,
        // phone_number: row.phone_number,
        // address: row.address === '' ? null : row.address,
        // city: row.city === '' ? null : row.city,
        // state: row.state === '' ? null : row.state,
        // zipcode: row.zipcode === '' ? null : row.zipcode,
        // branch_id:
        //   row.employee_id.split('/')[2] === 'PUN'
        //     ? 2
        //     : row.employee_id.split('/')[2] === 'CHI'
        //     ? 3
        //     : row.employee_id.split('/')[2] === 'LA'
        //     ? 4
        //     : row.employee_id.split('/')[2] === 'HM'
        //     ? 5
        //     : 1,
        // join_date: moment(row.join_date, 'YY-MM-DD').format('YYYY-MM-DD'),
        // employment_type: row.employment_type,
        // job_title: row.job_title,
        // status: row.status || 'active',
        // note: row.note === '' ? null : row.note,
        // capacity: row.capacity,
        // role_id: row.role_id || 5,

        //for remote employees
        company_email: row.company_email,
        employee_id: row.employee_id,
        first_name: row.first_name,
        last_name: row.last_name,
        personal_email: row.personal_email === '' ? null : row.personal_email,
        country_code:
          row.country_code === ''
            ? null
            : row.country_code[0] === '+'
            ? row.country_code
            : `+${row.country_code}`,
        phone_number: row.phone_number === '' ? null : row.phone_number,
        address: row.address === '' ? null : row.address,
        city: row.city === '' ? null : row.city,
        state: row.state === '' ? null : row.state,
        zipcode: row.zipcode === '' ? null : row.zipcode,
        branch_id:
          row.employee_id.split('/')[2] === 'PUN'
            ? 2
            : row.employee_id.split('/')[2] === 'CHI'
            ? 3
            : row.employee_id.split('/')[2] === 'LA'
            ? 4
            : row.employee_id.split('/')[2] === 'HM'
            ? 5
            : 1,
        join_date: moment(row.join_date, 'MM/DD/YY').format('YYYY-MM-DD'),
        employment_type:
          row.employment_type === '' ? null : row.employment_type,
        job_title: row.job_title === '' ? null : row.job_title,
        status: row.status || 'active',
        note: row.note === '' ? null : row.note,
        capacity: row.capacity === '' ? null : 40,
        role_id: row.role_id || 5,
      };
      userBody.push(user);
    })
    .on('end', () => {
      postUsers(userBody);
    });
};
const postUsers = async (userData) => {
  const response = await fetch(`${apiRootPath}/allusers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify(userData),
  });
  if (response.status === 201)
    console.log(`${userData.length} data successfully added`);
  else console.log('Something went wrong, please try again later');
};

usersBulkCreate();
